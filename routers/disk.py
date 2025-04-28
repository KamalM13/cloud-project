from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.models.disk import CreateDiskRequest, DiskResponse, DiskListResponse
from app.services.disk_service import DiskService

router = APIRouter(
    prefix="/disks",
    tags=["disks"],
    responses={404: {"description": "Not found"}},
)

# Dependency
def get_disk_service():
    return DiskService()


@router.post("/", response_model=DiskResponse, status_code=201)
def create_disk(request: CreateDiskRequest, service: DiskService = Depends(get_disk_service)):
    """
    Create a new virtual disk with specified parameters.
    """
    try:
        return service.create_disk(request.name, request.size, request.format)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=DiskListResponse)
def list_disks(service: DiskService = Depends(get_disk_service)):
    """
    List all available virtual disks.
    """
    disks = service.list_disks()
    return DiskListResponse(disks=disks)


@router.get("/{disk_id}", response_model=DiskResponse)
def get_disk(disk_id: str, service: DiskService = Depends(get_disk_service)):
    """
    Get details of a specific virtual disk.
    """
    disk = service.get_disk(disk_id)
    if not disk:
        raise HTTPException(status_code=404, detail="Disk not found")
    return disk


@router.delete("/{disk_id}", status_code=204)
def delete_disk(disk_id: str, service: DiskService = Depends(get_disk_service)):
    """
    Delete a virtual disk.
    """
    success = service.delete_disk(disk_id)
    if not success:
        raise HTTPException(status_code=404, detail="Disk not found")
    return None