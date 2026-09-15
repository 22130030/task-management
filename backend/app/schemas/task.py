from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "TODO"
    priority: str = "MEDIUM"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }