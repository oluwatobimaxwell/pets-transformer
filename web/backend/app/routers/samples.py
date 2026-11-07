from fastapi import APIRouter

from app.schemas.sample_out import SampleOut
from app.services import datasets

router = APIRouter()


@router.get("/", response_model=list[SampleOut])
def list_samples():
    return datasets.samples()
