import os

# Base folder paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VIRTUAL_DISK_FOLDER = os.getenv("VIRTUAL_DISK_FOLDER", os.path.join(BASE_DIR, "virtual_disks"))
ISO_PATH = os.getenv("ISO_PATH", os.path.join(BASE_DIR, "isos", "alpine-standard.iso"))

# Ensure folders exist
os.makedirs(VIRTUAL_DISK_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(ISO_PATH), exist_ok=True)
