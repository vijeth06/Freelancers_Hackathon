from pydantic import BaseModel, field_validator
from typing import List, Optional
from enum import Enum


class PriorityEnum(str, Enum):
    """Task priority levels"""
    High = "High"
    Medium = "Medium"
    Low = "Low"


class AnalyzeRequest(BaseModel):
    """Request schema for the analyze endpoint"""
    text: str

    @field_validator('text')
    @classmethod
    def validate_text(cls, v):
        """Ensure text is not empty"""
        if not v or not v.strip():
            raise ValueError('Text cannot be empty')
        if len(v) < 10:
            raise ValueError('Text must be at least 10 characters')
        return v.strip()


class Task(BaseModel):
    """Task schema extracted from meeting transcript"""
    owner: str
    task: str
    deadline: Optional[str] = None
    priority: PriorityEnum = PriorityEnum.Medium

    @field_validator('task')
    @classmethod
    def validate_task(cls, v):
        """Ensure task is not empty"""
        if not v or not v.strip():
            raise ValueError('Task cannot be empty')
        return v.strip()


class AnalyzeResponse(BaseModel):
    """Response schema for the analyze endpoint"""
    summary: List[str]
    tasks: List[Task]
    next_meeting_date: Optional[str] = None
