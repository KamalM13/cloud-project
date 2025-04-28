from pydantic import BaseModel

class DiskCreateRequest(BaseModel):
    name: str
    size: str  # Example: "5G"
    format: str = "qcow2"  # Default format
