from fastapi import APIRouter, status
from fastapi.responses import FileResponse

from app.schemas.evidence_out import EvidenceOut
from app.schemas.preview_out import PreviewOut
from app.schemas.record_table_out import RecordTableOut
from app.schemas.run_out import RunOut
from app.schemas.run_request import RunRequest
from app.services import downloads, evidence, previews, runs

router = APIRouter()


@router.post("/", response_model=RunOut, status_code=status.HTTP_202_ACCEPTED)
def start_run(request: RunRequest):
    return runs.start(request).to_out()


@router.get("/", response_model=list[RunOut])
def list_runs():
    return [job.to_out() for job in runs.recent()]


@router.get("/{run_id}/", response_model=RunOut)
def get_run(run_id: str):
    return runs.get(run_id).to_out()


@router.get("/{run_id}/evidence/", response_model=EvidenceOut)
def get_evidence(run_id: str):
    return evidence.evidence(runs.get(run_id).folder)


@router.get("/{run_id}/records/{table}/", response_model=RecordTableOut)
def get_records(run_id: str, table: str):
    return evidence.records(runs.get(run_id).folder, table)


@router.get("/{run_id}/download/{part}/", response_class=FileResponse)
def download(run_id: str, part: str):
    path = downloads.archive(runs.get(run_id).folder, part)
    return FileResponse(path, media_type="application/zip", filename=f"{run_id}-{part}.zip")


@router.get("/{run_id}/preview/", response_model=PreviewOut)
def get_preview(run_id: str):
    return previews.preview(runs.get(run_id))
