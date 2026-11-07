"""Packs what may leave the machine. The private folder, with its row maps, is never offered."""

import shutil
from pathlib import Path

from fastapi import HTTPException

SHAREABLE = ("release", "evidence")
DASHBOARD = Path("evidence") / "dashboard.html"


def archive(run_dir: Path, part: str) -> Path:
    if part not in SHAREABLE:
        raise HTTPException(status_code=404, detail="Only the release and the evidence can be downloaded.")
    source = run_dir / part
    if not source.is_dir():
        raise HTTPException(status_code=404, detail="Nothing was released for this run." if part == "release" else "No evidence yet.")
    target = run_dir / "downloads" / part
    target.parent.mkdir(exist_ok=True)
    return Path(shutil.make_archive(str(target), "zip", root_dir=source))


def dashboard(run_dir: Path) -> Path:
    path = run_dir / DASHBOARD
    if not path.exists():
        raise HTTPException(status_code=404, detail="The dashboard appears when the run finishes.")
    return path
