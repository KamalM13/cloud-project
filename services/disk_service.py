import os
from config import VIRTUAL_DISK_FOLDER
from utils.subprocess_utils import run_command

def create_virtual_disk(name: str, size: str, fmt: str):
    print(VIRTUAL_DISK_FOLDER)
    path = os.path.join(VIRTUAL_DISK_FOLDER, f"{name}.{fmt}")
    command = ["qemu-img", "create", "-f", fmt, path, size]
    run_command(command)
    return path

def list_virtual_disks():
    return [f for f in os.listdir(VIRTUAL_DISK_FOLDER) if f.endswith(('.qcow2', '.img', '.raw'))]
