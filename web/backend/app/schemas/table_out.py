from pydantic import BaseModel


class TableOut(BaseModel):
    name: str
    columns: list[str]
