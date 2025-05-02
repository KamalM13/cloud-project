import os
import json
import logging
from typing import List, Optional, Dict
from datetime import datetime
from uuid import uuid4

from app.config import VIRTUAL_DISK_FOLDER, VM_DATA_FOLDER
from app.models.disk import DiskResponse
from app.utils.subprocess_utils import run_command, check_command_exists

logger = logging.getLogger(__name__)

class DiskService:
    def __init__(self):
        """Initialize the disk service and ensure QEMU is available"""
        if not check_command_exists("qemu-img"):
            raise RuntimeError("qemu-img command not found - please install QEMU")
        
        # Create disk metadata file if it doesn't exist
        self.metadata_file = os.path.join(VIRTUAL_DISK_FOLDER, "metadata.json")
        if not os.path.exists(self.metadata_file):
            with open(self.metadata_file, 'w') as f:
                json.dump({}, f)
    
    def _load_metadata(self) -> Dict:
        """Load disk metadata from JSON file"""
        try:
            with open(self.metadata_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}
    
    def _save_metadata(self, metadata: Dict) -> None:
        """Save disk metadata to JSON file"""
        with open(self.metadata_file, 'w') as f:
            json.dump(metadata, f, default=str)
    
    def _get_disk_size_info(self, path: str) -> Dict:
        """Get detailed disk size information using qemu-img info"""
        command = ["qemu-img", "info", "--output=json", path]
        stdout, _, _ = run_command(command)
        return json.loads(stdout)
    
    def create_disk(self, name: str, size: str, format: str) -> DiskResponse:
        """
        Create a new virtual disk
        
        Args:
            name: Name for the disk
            size: Size of the disk (e.g., "10G")
            format: Format of the disk (e.g., "qcow2", "raw")
            
        Returns:
            DiskResponse object with the created disk details
        """
        # Validate format
        if format not in ["qcow2", "raw", "vdi", "vmdk"]:
            raise ValueError(f"Unsupported disk format: {format}")
        
        # Create unique filename
        disk_id = str(uuid4())
        filename = f"{name.replace(' ', '_')}_{disk_id}.{format}"
        path = os.path.join(VIRTUAL_DISK_FOLDER, filename)
        
        # Create the disk using qemu-img
        command = ["qemu-img", "create", "-f", format, path, size]
        run_command(command)
        
        # Create and save metadata
        disk_info = {
            "id": disk_id,
            "name": name,
            "size": size,
            "format": format,
            "path": path,
            "in_use": False,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        metadata = self._load_metadata()
        metadata[disk_id] = disk_info
        self._save_metadata(metadata)
        
        return DiskResponse(
            id=disk_id,
            name=name,
            size=size,
            format=format,
            path=path,
            in_use=False,
            created_at=datetime.fromisoformat(disk_info["created_at"]),
            updated_at=datetime.fromisoformat(disk_info["updated_at"])
        )
    
    def list_disks(self) -> List[DiskResponse]:
        """
        List all available virtual disks
        
        Returns:
            List of DiskResponse objects
        """
        metadata = self._load_metadata()
        return [
            DiskResponse(
                id=disk_id,
                name=info["name"],
                size=info["size"],
                format=info["format"],
                path=info["path"],
                in_use=info.get("in_use", False),
                created_at=datetime.fromisoformat(info["created_at"]),
                updated_at=datetime.fromisoformat(info["updated_at"])
            )
            for disk_id, info in metadata.items()
            if os.path.exists(info["path"])  # Skip if file doesn't exist
        ]
    
    def get_disk(self, disk_id: str) -> Optional[DiskResponse]:
        """
        Get details of a specific disk
        
        Args:
            disk_id: ID of the disk to retrieve
            
        Returns:
            DiskResponse object or None if not found
        """
        metadata = self._load_metadata()
        if disk_id not in metadata:
            return None
        
        info = metadata[disk_id]
        if not os.path.exists(info["path"]):
            return None
            
        return DiskResponse(
            id=disk_id,
            name=info["name"],
            size=info["size"],
            format=info["format"],
            path=info["path"],
            in_use=info.get("in_use", False),
            created_at=datetime.fromisoformat(info["created_at"]),
            updated_at=datetime.fromisoformat(info["updated_at"])
        )
    
    def delete_disk(self, disk_id: str) -> bool:
        """
        Delete a virtual disk
        
        Args:
            disk_id: ID of the disk to delete
            
        Returns:
            Boolean indicating success
        """
        metadata = self._load_metadata()
        if disk_id not in metadata:
            return False
        
        disk_info = metadata[disk_id]
        
        # Check if disk is in use
        if disk_info.get("in_use", False):
            raise ValueError("Cannot delete disk that is in use by a VM")
        
        # Delete the file if it exists
        if os.path.exists(disk_info["path"]):
            os.remove(disk_info["path"])
        
        # Remove from metadata
        del metadata[disk_id]
        self._save_metadata(metadata)
        
        return True
    
    def mark_disk_in_use(self, disk_id: str, in_use: bool = True) -> bool:
        """
        Mark a disk as in use or not in use
        
        Args:
            disk_id: ID of the disk
            in_use: Whether the disk is in use
            
        Returns:
            Boolean indicating success
        """
        metadata = self._load_metadata()
        if disk_id not in metadata:
            return False
        
        metadata[disk_id]["in_use"] = in_use
        metadata[disk_id]["updated_at"] = datetime.now().isoformat()
        self._save_metadata(metadata)
        
        return True