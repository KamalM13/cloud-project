import os
import logging
from pathlib import Path

# Base directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")

# Create directories if they don't exist
os.makedirs(DATA_DIR, exist_ok=True)

# VM and Disk configuration
VIRTUAL_DISK_FOLDER = os.path.join(DATA_DIR, "disks")
os.makedirs(VIRTUAL_DISK_FOLDER, exist_ok=True)

VM_DATA_FOLDER = os.path.join(DATA_DIR, "vms")
os.makedirs(VM_DATA_FOLDER, exist_ok=True)

# ISO path for VM installation
ISO_PATH = os.path.join(DATA_DIR, "iso", "alpine-standard.iso")
os.makedirs(os.path.dirname(ISO_PATH), exist_ok=True)

# Docker related paths
DOCKER_DATA_FOLDER = os.path.join(DATA_DIR, "docker")
os.makedirs(DOCKER_DATA_FOLDER, exist_ok=True)

# Logging configuration
LOG_LEVEL = logging.INFO
LOG_FORMAT = "%(asctime)s - %(levelname)s - %(message)s"

# Default VM settings
DEFAULT_VM_MEMORY = 1024  # MB
DEFAULT_VM_CPU_CORES = 1
DEFAULT_DISK_FORMAT = "qcow2"
DEFAULT_DISK_SIZE = "10G"
