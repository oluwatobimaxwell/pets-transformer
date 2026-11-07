from pydantic import BaseModel, Field


class SampleRequest(BaseModel):
    name: str = Field(min_length=1)
