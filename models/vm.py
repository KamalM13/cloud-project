from pydantic import BaseModel

class VMCreateRequest(BaseModel):
    disk_name: str  # name of the disk file
    memory: int     # in MB
    cpu: int        # number of CPUs
