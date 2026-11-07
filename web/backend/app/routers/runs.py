from fastapi import APIRouter, status
from fastapi.responses import FileResponse

from app.schemas.run_out import RunOut
from app.schemas.run_request import RunRequest
from app.services import downloads, runs

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


@router.get("/{run_id}/dashboard/", response_class=FileResponse)
def get_dashboard(run_id: str):
    # Evidence can be regenerated, so the browser must check for a newer page instead of reusing a stored one.
    return FileResponse(downloads.dashboard(runs.get(run_id).folder), media_type="text/html", headers={"Cache-Control": "no-cache"})


@router.get("/{run_id}/download/{part}/", response_class=FileResponse)
def download(run_id: str, part: str):
    path = downloads.archive(runs.get(run_id).folder, part)
    return FileResponse(path, media_type="application/zip", filename=f"{run_id}-{part}.zip")
