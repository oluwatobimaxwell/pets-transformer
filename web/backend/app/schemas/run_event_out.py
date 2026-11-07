from pydantic import BaseModel


class RunEventOut(BaseModel):
    stage: str
    message: str
    at: str
