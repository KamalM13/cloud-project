from fastapi.testclient import TestClient
import pytest
from app.main import app

client = TestClient(app)


def test_list_disks():
    """Test listing all disks"""
    response = client.get("/api/disks")
    assert response.status_code == 200
    data = response.json()
    assert "disks" in data
    assert isinstance(data["disks"], list)


def test_get_disk():
    """Test getting a specific disk"""
    # First create a test disk
    disk_data = {"name": "test-disk", "size": "10G", "format": "qcow2", "dynamic": True}
    create_response = client.post("/api/disks", json=disk_data)
    assert create_response.status_code == 201
    disk_id = create_response.json()["id"]

    # Then get the disk
    response = client.get(f"/api/disks/{disk_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == disk_data["name"]
    assert data["size"] == disk_data["size"]
    assert data["format"] == disk_data["format"]
    assert data["dynamic"] == disk_data["dynamic"]


def test_create_disk():
    """Test creating a new disk"""
    disk_data = {"name": "new-disk", "size": "20G", "format": "qcow2", "dynamic": True}
    response = client.post("/api/disks", json=disk_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == disk_data["name"]
    assert data["size"] == disk_data["size"]
    assert data["format"] == disk_data["format"]
    assert data["dynamic"] == disk_data["dynamic"]
    assert "id" in data


def test_delete_disk():
    """Test deleting a disk"""
    # First create a test disk
    disk_data = {
        "name": "delete-test-disk",
        "size": "5G",
        "format": "qcow2",
        "dynamic": True,
    }
    create_response = client.post("/api/disks", json=disk_data)
    disk_id = create_response.json()["id"]

    # Then delete it
    response = client.delete(f"/api/disks/{disk_id}")
    assert response.status_code == 204

    # Verify it's deleted
    get_response = client.get(f"/api/disks/{disk_id}")
    assert get_response.status_code == 404
