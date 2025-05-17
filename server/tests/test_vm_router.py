from fastapi.testclient import TestClient
import pytest
from app.main import app

client = TestClient(app)


def test_list_vms():
    """Test listing all VMs"""
    response = client.get("/api/vms")
    assert response.status_code == 200
    data = response.json()
    assert "vms" in data
    assert isinstance(data["vms"], list)


def test_create_vm():
    """Test creating a new VM"""
    # First create a disk to use
    disk_data = {
        "name": "vm-test-disk",
        "size": "10G",
        "format": "qcow2",
        "dynamic": True,
    }
    disk_response = client.post("/api/disks", json=disk_data)
    assert disk_response.status_code == 201
    disk_id = disk_response.json()["id"]

    # Now create the VM
    vm_data = {
        "name": "test-vm",
        "cpu_cores": 2,
        "memory_size": 4096,  # 4GB in MB
        "disk_id": disk_id,
    }
    response = client.post("/api/vms", json=vm_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == vm_data["name"]
    assert data["cpu_cores"] == vm_data["cpu_cores"]
    assert data["memory_size"] == vm_data["memory_size"]
    assert data["disk_id"] == vm_data["disk_id"]
    assert "id" in data
    assert "status" in data


def test_get_vm():
    """Test getting a specific VM"""
    # First create a disk
    disk_data = {
        "name": "get-vm-test-disk",
        "size": "10G",
        "format": "qcow2",
        "dynamic": True,
    }
    disk_response = client.post("/api/disks", json=disk_data)
    disk_id = disk_response.json()["id"]

    # Then create a VM
    vm_data = {
        "name": "get-test-vm",
        "cpu_cores": 2,
        "memory_size": 4096,
        "disk_id": disk_id,
    }
    create_response = client.post("/api/vms", json=vm_data)
    vm_id = create_response.json()["id"]

    # Then get the VM
    response = client.get(f"/api/vms/{vm_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == vm_data["name"]
    assert data["cpu_cores"] == vm_data["cpu_cores"]
    assert data["memory_size"] == vm_data["memory_size"]
    assert data["disk_id"] == vm_data["disk_id"]


def test_delete_vm():
    """Test deleting a VM"""
    # First create a disk
    disk_data = {
        "name": "delete-vm-test-disk",
        "size": "10G",
        "format": "qcow2",
        "dynamic": True,
    }
    disk_response = client.post("/api/disks", json=disk_data)
    disk_id = disk_response.json()["id"]

    # Then create a VM
    vm_data = {
        "name": "delete-test-vm",
        "cpu_cores": 2,
        "memory_size": 4096,
        "disk_id": disk_id,
    }
    create_response = client.post("/api/vms", json=vm_data)
    vm_id = create_response.json()["id"]

    # Then delete it
    response = client.delete(f"/api/vms/{vm_id}")
    assert response.status_code == 204

    # Verify it's deleted
    get_response = client.get(f"/api/vms/{vm_id}")
    assert get_response.status_code == 404
