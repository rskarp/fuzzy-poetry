from typing import Optional
from pydantic import BaseModel, Field
from src.models.common import ReplacementTypeCounts


class PoemV2CreateRequest(BaseModel):
    poem: Optional[str] = Field(None, alias="inputPoem")
    replacement_type_counts: Optional[ReplacementTypeCounts] = Field(
        None, alias="replacementTypeCounts"
    )

    class Config:
        populate_by_name = True
