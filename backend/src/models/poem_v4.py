from typing import Optional, List
from pydantic import BaseModel, Field
from src.models.common import ReplacementTypeCounts


class PoemV4CreateRequest(BaseModel):
    """Request model for generating a multimodal variation"""

    input_image_url: Optional[str] = Field(None, alias="inputImageUrl")
    replacement_type_counts: Optional[ReplacementTypeCounts] = Field(
        None, alias="replacementTypeCounts"
    )
    num_related_images: Optional[int] = Field(None, alias="numRelatedImages")
    model: Optional[str] = None
    pass_image_to_model: Optional[bool] = Field(None, alias="passImageToModel")

    class Config:
        populate_by_name = True
