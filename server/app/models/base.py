from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import uuid4

class BaseResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

# app/models/disk.py
from pydantic import BaseModel, Field
from typing import List, Optional
from .base import BaseResponse
from datetime import datetime

class CreateDiskRequest(BaseModel):
    name: str
    size: str = "10G"  # Default 10GB
    format: str = "qcow2"  # Default format

class DiskResponse(BaseResponse):
    name: str
    size: str
    format: str
    path: str
    in_use: bool = False

class DiskListResponse(BaseModel):
    disks: List[DiskResponse]