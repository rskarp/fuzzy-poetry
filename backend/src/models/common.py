from enum import Enum
from pydantic import BaseModel
from typing import Optional


class ReplacementType(str, Enum):
    """Enum for different types of word replacements"""

    MEANS_LIKE = "MEANS_LIKE"
    TRIGGERED_BY = "TRIGGERED_BY"
    ANAGRAM = "ANAGRAM"
    SPELLED_LIKE = "SPELLED_LIKE"
    CONSONANT_MATCH = "CONSONANT_MATCH"
    HOMOPHONE = "HOMOPHONE"


class PoemResponse(BaseModel):
    """Response model for a poem"""

    poem_content: str


class ReplacementTypeCounts(BaseModel):
    """Counts for each type of replacement to apply"""

    means_like: Optional[int] = None
    triggered_by: Optional[int] = None
    anagram: Optional[int] = None
    spelled_like: Optional[int] = None
    consonant_match: Optional[int] = None
    homophone: Optional[int] = None
