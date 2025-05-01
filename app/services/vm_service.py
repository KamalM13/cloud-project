import os
import json
import logging
import signal
import platform
import psutil
import time
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import uuid4

from app.config import VM_DATA_FOLDER, ISO_PATH
from app.models.vm import VMResponse, VMStatus
from app.services.disk_service import DiskService
from app.utils.subprocess_utils import run_command, run_command_background, check_command_exists

logger = logging.getLogger(__name__)

class VMService:
    def __init__(self, disk_service: DiskService):
        """
        Initialize the VM service
        
        Args:
            disk_service: DiskService instance for disk operations
        """
        self.disk_service = disk_service
        
        # Check if QEMU is installed
        if not check_command_exists("qemu-system-x86_64"):
            raise RuntimeError("qemu-system-x86_64 command not found - please install QEMU")
        
        # Create VM metadata file if it doesn't exist
        self.metadata_file = os.path.join(VM_DATA_FOLDER, "metadata.json")
        if not os.path.exists(self.metadata_file):
            with open(self.metadata_file, 'w') as f:
                json.dump({}, f)
        
        # Track running VMs
        self.running_vms = {}
        
        # Restore VM processes from metadata
        self._restore_running_vms()
    
    def _load_metadata(self) -> Dict:
        """Load VM metadata from JSON file"""
        try:
            with open(self.metadata_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}
    
    def _save_metadata(self, metadata: Dict) -> None:
        """Save VM metadata to JSON file"""
        with open(self.metadata_file, 'w') as f:
            json.dump(metadata, f, default=str)
    
    def _restore_running_vms(self) -> None:
        """Restore running VM processes from metadata"""
        metadata = self._load_metadata()
        
        for vm_id, info in metadata.items():
            # Skip VMs that aren't marked as running
            if info.get("status") != VMStatus.RUNNING:
                continue
            
            pid = info.get("pid")
            if pid and self._check_process_running(pid):
                self.running_vms[vm_id] = pid
            else:
                # Update status if VM isn't actually running
                metadata[vm_id]["status"] = VMStatus.STOPPED
                metadata[vm_id]["pid"] = None
        
        self._save_metadata(metadata)
    
    def _check_process_running(self, pid: int) -> bool:
        """Check if a process with the given PID is running"""
        try:
            process = psutil.Process(pid)
            if "qemu" in process.name().lower():
                return True
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
        return False
    
    def create_vm(self, name: str, cpu_cores: int, memory_size: int, disk_id: str) -> VMResponse:
        """
        Create a new virtual machine
        
        Args:
            name: Name for the VM
            cpu_cores: Number of CPU cores
            memory_size: Amount of memory in MB
            disk_id: ID of the disk to use
            
        Returns:
            VMResponse object with the created VM details
        """
        # Validate disk exists
        disk = self.disk_service.get_disk(disk_id)
        if not disk:
            raise ValueError(f"Disk with ID {disk_id} not found")
        
        # Create VM ID and metadata
        vm_id = str(uuid4())
        
        vm_info = {
            "id": vm_id,
            "name": name,
            "cpu_cores": cpu_cores,
            "memory_size": memory_size,
            "disk_id": disk_id,
            "status": VMStatus.STOPPED,
            "ip_address": None,
            "pid": None,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        # Save metadata
        metadata = self._load_metadata()
        metadata[vm_id] = vm_info
        self._save_metadata(metadata)
        
        # Mark disk as in use
        self.disk_service.mark_disk_in_use(disk_id, True)
        
        return VMResponse(
            id=vm_id,
            name=name,
            cpu_cores=cpu_cores,
            memory_size=memory_size,
            disk_id=disk_id,
            status=VMStatus.STOPPED,
            ip_address=None,
            created_at=datetime.fromisoformat(vm_info["created_at"]),
            updated_at=datetime.fromisoformat(vm_info["updated_at"])
        )
    
    def list_vms(self) -> List[VMResponse]:
        """
        List all virtual machines
        
        Returns:
            List of VMResponse objects
        """
        metadata = self._load_metadata()
        return [
            VMResponse(
                id=vm_id,
                name=info["name"],
                cpu_cores=info["cpu_cores"],
                memory_size=info["memory_size"],
                disk_id=info["disk_id"],
                status=info["status"],
                ip_address=info.get("ip_address"),
                created_at=datetime.fromisoformat(info["created_at"]),
                updated_at=datetime.fromisoformat(info["updated_at"])
            )
            for vm_id, info in metadata.items()
        ]
    
    def get_vm(self, vm_id: str) -> Optional[VMResponse]:
        """
        Get details of a specific virtual machine
        
        Args:
            vm_id: ID of the VM to retrieve
            
        Returns:
            VMResponse object or None if not found
        """
        metadata = self._load_metadata()
        if vm_id not in metadata:
            return None
        
        info = metadata[vm_id]
        return VMResponse(
            id=vm_id,
            name=info["name"],
            cpu_cores=info["cpu_cores"],
            memory_size=info["memory_size"],
            disk_id=info["disk_id"],
            status=info["status"],
            ip_address=info.get("ip_address"),
            created_at=datetime.fromisoformat(info["created_at"]),
            updated_at=datetime.fromisoformat(info["updated_at"])
        )
    
    def start_vm(self, vm_id: str) -> VMResponse:
        """
        Start a virtual machine
        
        Args:
            vm_id: ID of the VM to start
            
        Returns:
            Updated VMResponse object
        """
        metadata = self._load_metadata()
        if vm_id not in metadata:
            raise ValueError(f"VM with ID {vm_id} not found")
        
        vm_info = metadata[vm_id]
        
        # Check if VM is already running
        if vm_info["status"] == VMStatus.RUNNING:
            if vm_id in self.running_vms and self._check_process_running(self.running_vms[vm_id]):
                return self.get_vm(vm_id)
            # Fall through if VM is marked as running but process doesn't exist
        
        # Get disk information
        disk = self.disk_service.get_disk(vm_info["disk_id"])
        if not disk:
            raise ValueError(f"Disk with ID {vm_info['disk_id']} not found")
        
        # Build QEMU command
        command = [
            "qemu-system-x86_64",
            "-m", str(vm_info["memory_size"]),
            "-smp", str(vm_info["cpu_cores"]),
            "-hda", disk.path,
            "-boot", "d"
        ]
        
        # Add ISO if it exists
        if os.path.exists(ISO_PATH):
            command.extend(["-cdrom", ISO_PATH])
        
        # Add KVM acceleration if on Linux and available
        if platform.system() == "Linux" and check_command_exists("kvm"):
            command.append("-enable-kvm")
        
        # Start the VM
        process = run_command_background(command)
        
        if process and process.pid:
            # Update metadata
            vm_info["status"] = VMStatus.RUNNING
            vm_info["pid"] = process.pid
            vm_info["updated_at"] = datetime.now().isoformat()
            self._save_metadata(metadata)
            
            # Track the running VM
            self.running_vms[vm_id] = process.pid
            
            # Try to determine IP address (in a real system, this would be more robust)
            # For demo purposes, we'll simulate this with a placeholder
            time.sleep(1)  # Give VM a moment to start
            vm_info["ip_address"] = "192.168.122." + str(hash(vm_id) % 253 + 1)
            self._save_metadata(metadata)
        else:
            raise RuntimeError("Failed to start VM")
        
        return self.get_vm(vm_id)
    
    def stop_vm(self, vm_id: str) -> VMResponse:
        """
        Stop a virtual machine
        
        Args:
            vm_id: ID of the VM to stop
            
        Returns:
            Updated VMResponse object
        """
        metadata = self._load_metadata()
        if vm_id not in metadata:
            raise ValueError(f"VM with ID {vm_id} not found")
        
        vm_info = metadata[vm_id]
        
        # Check if VM is already stopped
        if vm_info["status"] == VMStatus.STOPPED:
            return self.get_vm(vm_id)
        
        # Try to terminate the process
        pid = vm_info["pid"]
        if pid and vm_id in self.running_vms:
            try:
                if platform.system() == "Windows":
                    run_command(["taskkill", "/F", "/PID", str(pid)])
                else:
                    os.kill(pid, signal.SIGTERM)
                    # Give it some time to terminate gracefully
                    time.sleep(2)
                    # If still running, force kill
                    if self._check_process_running(pid):
                        os.kill(pid, signal.SIGKILL)
            except (ProcessLookupError, OSError):
                # Process already gone
                pass
            
            # Remove from tracking
            self.running_vms.pop(vm_id, None)
        
        # Update metadata
        vm_info["status"] = VMStatus.STOPPED
        vm_info["pid"] = None
        vm_info["ip_address"] = None
        vm_info["updated_at"] = datetime.now().isoformat()
        self._save_metadata(metadata)
        
        return self.get_vm(vm_id)
    
    def delete_vm(self, vm_id: str) -> bool:
        """
        Delete a virtual machine
        
        Args:
            vm_id: ID of the VM to delete
            
        Returns:
            Boolean indicating success
        """
        metadata = self._load_metadata()
        if vm_id not in metadata:
            return False
        
        vm_info = metadata[vm_id]
        
        # Stop VM if running
        if vm_info["status"] == VMStatus.RUNNING:
            self.stop_vm(vm_id)
        
        # Release disk
        disk_id = vm_info["disk_id"]
        self.disk_service.mark_disk_in_use(disk_id, False)
        
        # Remove from metadata
        del metadata[vm_id]
        self._save_metadata(metadata)
        
        return True