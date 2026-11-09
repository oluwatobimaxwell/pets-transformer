"""Starts releases in the background, one at a time, and reports on them."""

import json
import os
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from fastapi import HTTPException

from pets_engine.domain.run_config import RunConfig
from pets_engine.pipeline import run_release

from app.config import settings
from app.schemas.run_request import RunRequest
from app.services import datasets, scenarios
from app.services.run_job import RECORD, RunJob
from app.services.workspace import folder, new_id, read_record, write_record

REVIEW_FILE = "review.json"
INTERRUPTED = "The server stopped before this run finished. Start the release again."
_EXECUTOR = ThreadPoolExecutor(max_workers=1)  # runs use most of the CPU, so they queue instead of competing
_JOBS: dict = {}


def _require_key() -> None:
    if settings.pets_engine_key:
        os.environ.setdefault("PETS_ENGINE_KEY", settings.pets_engine_key)
    if len(os.environ.get("PETS_ENGINE_KEY", "")) < 16:
        raise HTTPException(status_code=503, detail="The server has no engine key. Set PETS_ENGINE_KEY in the repository's .env.")


def _config(request: RunRequest, run_dir: Path) -> RunConfig:
    record = datasets.load(request.dataset_id)
    data = Path(record["data_dir"])
    if request.scenario_id:
        scenario, root = scenarios.challenge_scenario(request.scenario_id, data.name, record["source"]), settings.package_root
    elif request.custom:
        scenario, root = scenarios.custom_scenario(request.custom, data.name, run_dir), None
    else:
        raise HTTPException(status_code=400, detail="Choose a challenge scenario or describe your own recipient.")
    review = None
    if request.review:
        review = run_dir / REVIEW_FILE
        write_record(review, {key: decision.model_dump() for key, decision in request.review.items()})
    return RunConfig(data, run_dir, scenario, root, review)


def _execute(job: RunJob, config: RunConfig) -> None:
    job.status = "running"
    job.log("start", f"Protecting {config.data_dir.name} for {config.scenario.id}")
    try:
        result = run_release(config, job.log)
        job.status, job.summary = result.status, result.summary
        job.log("done", f"Gate decided: {result.status}")
    except Exception as error:  # noqa: BLE001 - any engine failure must reach the person, not vanish in a thread
        job.status, job.error = "error", f"{type(error).__name__}: {error}"
        job.log("error", job.error)


def start(request: RunRequest) -> RunJob:
    _require_key()
    run_id = new_id()
    run_dir = folder("runs", run_id)
    run_dir.mkdir(parents=True, exist_ok=True)
    config = _config(request, run_dir)
    job = RunJob(run_id, request.dataset_id, config.scenario.id, run_dir)
    _JOBS[run_id] = job  # known in memory before its record exists, so get() never takes it for an interrupted run
    job.save()
    _EXECUTOR.submit(_execute, job, config)
    return job


def get(run_id: str) -> RunJob:
    if run_id in _JOBS:
        return _JOBS[run_id]
    record = read_record(folder("runs", run_id) / RECORD)
    record["folder"] = Path(record["folder"])
    job = RunJob(**record)
    if job.status in ("queued", "running"):
        # Runs only progress inside the server that started them. One still unfinished on disk was cut off when an
        # earlier server stopped, and would otherwise show as running forever.
        job.status, job.error = "error", INTERRUPTED
        job.save()
    return job


def recent(limit: int = 20) -> list:
    root = settings.workspace / "runs"
    records = sorted(root.glob(f"*/{RECORD}"), key=lambda path: path.stat().st_mtime, reverse=True)[:limit] if root.exists() else []
    return [get(json.loads(path.read_text(encoding="utf-8"))["id"]) for path in records]
