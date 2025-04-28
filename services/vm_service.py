import os
from config import VIRTUAL_DISK_FOLDER, ISO_PATH
from utils.subprocess_utils import run_command_background

def create_virtual_machine(disk_name: str, memory: int, cpu: int):
    disk_path = os.path.join(VIRTUAL_DISK_FOLDER, disk_name)
    if not os.path.exists(disk_path):
        raise ValueError(f"Disk {disk_path} does not exist.")

    command = [
        "qemu-system-x86_64",
        "-m", str(memory),
        "-smp", str(cpu),
        "-hda", disk_path,
        "-boot", "d",
        "-cdrom", ISO_PATH,
        # "-enable-kvm"  # Omit this on Windows
    ]
    run_command_background(command)
