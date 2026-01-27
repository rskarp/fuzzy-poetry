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


class LLMName(str, Enum):
    """Enum for different LLM model names"""

    DEEPSEEK_R1 = "deepseek-r1"
    CLAUDE_OPUS_4_1 = "claude-opus-4_1"
    CLAUDE_OPUS_4 = "claude-opus-4"
    CLAUDE_SONNET_4 = "claude-sonnet-4"
    GPT_4_1_NANO = "gpt-4.1-nano"
    GPT_5_MINI = "gpt-5-mini"
    GPT_5_1 = "gpt-5.1"


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
