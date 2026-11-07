"""Runs one release from start to finish: detect, select, tune, transform, verify, report."""
from __future__ import annotations

import shutil

import pandas as pd

from pets_eval import io

from .detect.detector import ColumnDetector
from .detect.labelling import apply_review, label_tables
from .domain.check import BLOCK, Check
from .domain.run_config import RunConfig
from .domain.run_paths import RunPaths
from .domain.run_result import RunResult
from .domain.verdict import Verdict
from .report.dashboard import write_dashboard
from .report.manifest import build_manifest, write_manifest
from .report.summary import write_summary
from .select.key_order import time_ordered_keys
from .select.selector import select_pets
from .select.standard_checks import standard_tasks
from .select.task_needs import minimal_columns, required_tasks, tasks_using, with_join_keys
from .text.column_redaction import group_column, redact_columns
from .transform.keys import recipient_key
from .transform.row_order import shuffled_positions
from .transform.transformer import Transformer
from .tune.repair import repair_plan
from .tune.search import clue_columns, tune
from .tune.suppression import linked_keep_masks, rows_to_keep
from .utils.tables import read_text_tables
from .verify.gate import run_gate
from .verify.strong_attacker import stronger_attacker

MAX_ATTEMPTS = 2
LOOK_ALIKE = "Look-alike rule"
SUPPRESSION_PASSES = 3


def _quiet(stage: str, message: str) -> None:
    return None


def _needed_columns(config: RunConfig, tables: dict, labels: list, tasks: list) -> dict:
    """Columns the questions need, plus any the person asked to keep. With no questions: harmless columns and the keep list."""
    wanted = set(config.keep)
    if tasks:
        needed = with_join_keys(minimal_columns(config.scenario, tables, labels, tasks), tables)
    else:
        needed = {}
        wanted |= {label.key for label in labels if label.role == "non_sensitive" and not label.needs_review}
    for label in labels:
        if label.key in wanted and label.column not in needed.get(label.table, []):
            needed.setdefault(label.table, []).append(label.column)
    return needed


def _needed_by(labels: list, tasks: list) -> dict:
    return {label.key: tasks_using(label.table, label.column, tasks) for label in labels}


def _record_key(config: RunConfig, table: str, frame: pd.DataFrame, labels: list):
    if config.package_root:
        key = io.record_key(io.load_catalog(config.package_root), config.dataset, table, frame)
        if key:
            return key
    return next((label.column for label in labels if label.table == table and label.role == "record_key"), None)


def _keep_masks(config: RunConfig, tables: dict, release: dict, plan: list, labels: list) -> dict:
    """Rows that still stand out go, along with their rows in linked tables."""
    masks = {table: pd.Series(True, index=frame.index) for table, frame in release.items()}
    k = config.scenario.k_required
    for _ in range(SUPPRESSION_PASSES):
        changed = False
        for table, frame in release.items():
            keep = rows_to_keep(frame[masks[table]], clue_columns(plan, table), k).reindex(frame.index, fill_value=False)
            if bool((masks[table] & ~keep).any()):
                changed = True
                masks[table] = masks[table] & keep
                key = _record_key(config, table, tables[table], labels)
                if key:
                    linked = linked_keep_masks({t: tables[t] for t in release}, table, key, masks[table])
                    for other, mask in linked.items():
                        masks[other] = masks[other] & mask
        if not changed:
            break
    return masks


def _write_release(config: RunConfig, paths: RunPaths, tables: dict, release: dict, masks: dict, labels: list, key: bytes) -> tuple:
    """Writes shuffled tables, and row maps that follow the same shuffle. Returns the original row behind each released row."""
    if paths.staged.exists():
        shutil.rmtree(paths.staged)
    paths.staged.mkdir(parents=True)
    trimmed, rowmaps, sources = {}, {}, {}
    for table, frame in release.items():
        kept = frame[masks[table]]
        order = shuffled_positions(kept, key, table, group_column(kept, labels, table, release))
        shuffled = kept.iloc[order].reset_index(drop=True)
        sources[table] = kept.index[order]
        trimmed[table] = shuffled
        shuffled.to_csv(paths.staged / f"{table}.csv", index=False)
        record_key = _record_key(config, table, tables[table], labels)
        if record_key:
            target = paths.private / f"rowmap_{table}.csv"
            pd.DataFrame({"protected_row": range(len(shuffled)), "original_record_id": tables[table].loc[sources[table], record_key].astype(str).values}).to_csv(
                target, index=False)
            rowmaps[table] = target
    return trimmed, rowmaps, sources


def _row_counts(release: dict, masks: dict) -> dict:
    total = sum(len(frame) for frame in release.values())
    kept = sum(int(mask.sum()) for mask in masks.values())
    return {"total": total, "kept": kept, "by_table": {t: {"total": len(f), "kept": int(masks[t].sum())} for t, f in release.items()}}


def _finish(paths: RunPaths, config: RunConfig, labels: list, plan: list, tuned, verdicts: list, report, rows: dict, attack: dict | None = None,
            results: list | None = None) -> RunResult:
    manifest = build_manifest(config, labels, plan, tuned, verdicts, report, rows, attack or {}, results or [])
    write_manifest(manifest, paths.evidence)
    write_summary(manifest, paths.evidence)
    status = manifest["status"]
    if paths.release.exists():
        shutil.rmtree(paths.release)
    if status == "release":
        paths.staged.rename(paths.release)
    elif paths.staged.exists() and status == "block":
        shutil.rmtree(paths.staged)
    write_dashboard(paths.root)
    return RunResult(status, paths.root, verdicts, {"scores": manifest["scores"], "rows": rows, "tasks": manifest["tasks"], "top_risks": manifest["top_risks"]})


def _public_block(config: RunConfig) -> Verdict:
    return Verdict(1, [Check("Recipient may receive row-level data", False, BLOCK,
                             f"{config.scenario.id} is a public release, which must be anonymous. This engine makes row-level releases and doesn't build aggregates yet.")])


def run_release(config: RunConfig, on_event=_quiet) -> RunResult:
    paths = RunPaths(config.out_dir)
    paths.create()
    key = recipient_key(config.scenario.id)
    on_event("detect", "Reading and profiling columns")
    text_tables = read_text_tables(config.data_dir)
    labels = apply_review(label_tables(text_tables, ColumnDetector.load()), config.review_file)
    if config.scenario.is_public:
        return _finish(paths, config, labels, [], None, [_public_block(config)], None, {})
    tables = io.load_tables(config.data_dir)
    on_event("select", "Finding what the required tasks need")
    tasks = required_tasks(config.scenario) if config.scenario.has_tasks else []
    needed = _needed_columns(config, tables, labels, tasks)
    time_leaks = time_ordered_keys(tables, labels) if config.scenario.k_required else set()
    plan = select_pets(labels, needed, config.scenario, time_leaks, _needed_by(labels, tasks))
    if not tasks:
        tasks = standard_tasks(plan, labels)
        on_event("select", f"No questions given, so {len(tasks)} kept columns get a standard shape check")
    text = redact_columns(plan, tables, labels, on_event)
    transformer = Transformer(tables, plan, key, text)
    on_event("tune", "Searching settings")
    tuned = tune(transformer, plan, config.scenario, tasks, tables)
    plan, repaired = repair_plan(transformer, plan, labels, tuned.levels, tasks, tables, config.scenario)
    if repaired:
        on_event("tune", f"Brought back {', '.join(repaired)}, so searching again")
        tuned = tune(transformer, plan, config.scenario, tasks, tables)
    release = transformer.build(tuned.levels)
    verdicts, report, rows, results = [], None, {}, []
    for attempt in range(1, MAX_ATTEMPTS + 1):
        masks = _keep_masks(config, tables, release, plan, labels) if attempt > 1 else {t: pd.Series(True, index=f.index) for t, f in release.items()}
        rows = _row_counts(release, masks)
        trimmed, rowmaps, sources = _write_release(config, paths, tables, release, masks, labels, key)
        on_event("verify", f"Attempt {attempt}: running the gate")
        kept_share = rows["kept"] / max(rows["total"], 1)
        verdict, report, results = run_gate(attempt, config, plan, labels, tasks, trimmed, tables, sources, kept_share, paths.staged, rowmaps, paths.evidence)
        verdicts.append(verdict)
        on_event("verify", f"Attempt {attempt}: {verdict.status}")
        if not verdict.has_failed(LOOK_ALIKE):
            break
    on_event("verify", "Running our stronger attacker")
    return _finish(paths, config, labels, plan, tuned, verdicts, report, rows, stronger_attacker(trimmed, plan, labels), results)
