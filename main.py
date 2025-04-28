from fastapi import FastAPI, HTTPException
from models.disk import DiskCreateRequest
from models.vm import VMCreateRequest
from services.disk_service import create_virtual_disk, list_virtual_disks
from services.vm_service import create_virtual_machine
import logging

app = FastAPI()

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

@app.get("/")
def read_root():
    return {"message": "Cloud Management System is running."}

@app.post("/create-disk")
def api_create_disk(request: DiskCreateRequest):
    try:
        print(request.name, request.size, request.format)
        path = create_virtual_disk(request.name, request.size, request.format)
        return {"message": f"Disk created at {path}"}
    except Exception as e:
        logging.error(str(e))
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/list-disks")
def api_list_disks():
    disks = list_virtual_disks()
    return {"disks": disks}

@app.post("/create-vm")
def api_create_vm(request: VMCreateRequest):
    try:
        create_virtual_machine(request.disk_name, request.memory, request.cpu)
        return {"message": "VM started successfully"}
    except Exception as e:
        logging.error(str(e))
        raise HTTPException(status_code=400, detail=str(e))
