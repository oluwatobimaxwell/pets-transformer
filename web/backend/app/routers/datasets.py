from fastapi import APIRouter, File, UploadFile, status

from app.schemas.column_out import ColumnOut
from app.schemas.dataset_out import DatasetOut
from app.schemas.sample_request import SampleRequest
from app.services import datasets

router = APIRouter()


@router.post("/", response_model=DatasetOut, status_code=status.HTTP_201_CREATED)
async def upload_dataset(files: list[UploadFile] = File(...)):
    return await datasets.register_upload(files)


@router.post("/sample/", response_model=DatasetOut, status_code=status.HTTP_201_CREATED)
def register_sample(request: SampleRequest):
    return datasets.register_sample(request.name)


@router.get("/{dataset_id}/", response_model=DatasetOut)
def get_dataset(dataset_id: str):
    return datasets.load(dataset_id)


@router.get("/{dataset_id}/columns/", response_model=list[ColumnOut])
def get_columns(dataset_id: str):
    return datasets.columns(dataset_id)
