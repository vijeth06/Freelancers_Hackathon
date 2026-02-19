from pydantic import BaseModel
from typing import List, Optional


class AnalyzeRequest(BaseModel):
    """Request schema for the analyze endpoint"""
    text: str


class Task(BaseModel):
    """Task schema extracted from meeting transcript"""
    owner: str
    task: str
    deadline: Optional[str] = None
    priority: str  # High, Medium, Low


class AnalyzeResponse(BaseModel):
    """Response schema for the analyze endpoint"""
    summary: List[str]
    tasks: List[Task]
    next_meeting_date: Optional[str] = None
