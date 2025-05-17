from pydantic import BaseModel, Field
from typing import List, Optional
from .base import BaseResponse
from datetime import datetime


class CreateDiskRequest(BaseModel):
    name: str
    size: str = "10G"  # Default 10GB
    format: str = "qcow2"  # Default format
    dynamic: bool = True  # Default to dynamic disk


class EditDiskRequest(BaseModel):
    name: Optional[str] = None
    size: Optional[str] = None


class DiskResponse(BaseResponse):
    name: str
    size: str
    format: str
    path: str
    in_use: bool = False
    dynamic: bool = True
    created_at: datetime
    updated_at: datetime


class EditDiskResponse(BaseModel):
    name: str
    size: str
    format: str
    path: str
    in_use: bool = False
    dynamic: bool


class DiskListResponse(BaseModel):
    disks: List[DiskResponse]
