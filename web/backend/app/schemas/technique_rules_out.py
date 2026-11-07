from pydantic import BaseModel


class TechniqueRulesOut(BaseModel):
    """The technique each role gets when a question needs the column, and the subtypes that override it."""

    roles: dict[str, str]
    subtypes: dict[str, str]
