from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional
from .base import BaseResponse
from datetime import datetime

class VMStatus(str, Enum):
    STOPPED = "stopped"
    RUNNING = "running"
    ERROR = "error"

class CreateVMRequest(BaseModel):
    name: str
    cpu_cores: int = 1
    memory_size: int = 1024  # MB
    disk_id: str

class VMResponse(BaseResponse):
    name: str
    cpu_cores: int
    memory_size: int
    disk_id: str
    status: VMStatus = VMStatus.STOPPED
    ip_address: Optional[str] = None

class VMListResponse(BaseModel):
    vms: List[VMResponse]