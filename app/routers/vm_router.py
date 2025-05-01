from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.models.vm import CreateVMRequest, VMResponse, VMListResponse
from app.services.vm_service import VMService
from app.services.disk_service import DiskService

router = APIRouter(
    prefix="/vms",
    tags=["vms"],
    responses={404: {"description": "Not found"}},
)

# Dependencies
def get_disk_service():
    return DiskService()

def get_vm_service(disk_service: DiskService = Depends(get_disk_service)):
    return VMService(disk_service)


@router.post("/", response_model=VMResponse, status_code=201)
def create_vm(request: CreateVMRequest, service: VMService = Depends(get_vm_service)):
    """
    Create a new virtual machine with specified parameters.
    """
    try:
        return service.create_vm(
            request.name,
            request.cpu_cores,
            request.memory_size,
            request.disk_id
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=VMListResponse)
def list_vms(service: VMService = Depends(get_vm_service)):
    """
    List all available virtual machines.
    """
    vms = service.list_vms()
    return VMListResponse(vms=vms)


@router.get("/{vm_id}", response_model=VMResponse)
def get_vm(vm_id: str, service: VMService = Depends(get_vm_service)):
    """
    Get details of a specific virtual machine.
    """
    vm = service.get_vm(vm_id)
    if not vm:
        raise HTTPException(status_code=404, detail="VM not found")
    return vm


@router.post("/{vm_id}/start", response_model=VMResponse)
def start_vm(vm_id: str, service: VMService = Depends(get_vm_service)):
    """
    Start a virtual machine.
    """
    try:
        return service.start_vm(vm_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{vm_id}/stop", response_model=VMResponse)
def stop_vm(vm_id: str, service: VMService = Depends(get_vm_service)):
    """
    Stop a virtual machine.
    """
    try:
        return service.stop_vm(vm_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{vm_id}", status_code=204)
def delete_vm(vm_id: str, service: VMService = Depends(get_vm_service)):
    """
    Delete a virtual machine.
    """
    try:
        success = service.delete_vm(vm_id)
        if not success:
            raise HTTPException(status_code=404, detail="VM not found")
        return None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))