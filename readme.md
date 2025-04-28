# 🛠️ Cloud Management System — FastAPI + QEMU

This project is a **cloud virtualization manager** built with **Python FastAPI** and **QEMU**.  
It allows users to **create virtual disks** and **launch virtual machines (VMs)** dynamically via API.

---

# 📋 Features

- Create Virtual Disks (`qcow2`, `raw`, etc.)
- List existing Virtual Disks
- Launch Virtual Machines (specify CPU, memory, disk)
- Boot VMs using an ISO file (e.g., Ubuntu Server)

---

# 🚀 Quickstart Guide

## 1. Install Requirements

- **Python 3.10+** (FastAPI, uvicorn)
- **QEMU for Windows**  
   Download and install QEMU:  
   👉 [Download QEMU](https://qemu.weilnetz.de/w64/2025/)
  - After installation, **add QEMU to your system PATH**:
  - Add the QEMU install folder (e.g., `C:\Program Files\qemu\`) to Environment Variables → `Path`
  - Restart your terminal or IDE.
    ✅ Verify installation:

```bash
qemu-img --version
qemu-system-x86_64 --version
```

- **Alpine ISO**
  👉 [Download Alpine ISO](hhttps://dl-cdn.alpinelinux.org/alpine/v3.21/releases/x86_64/alpine-standard-3.21.3-x86_64.iso)
  Place your ISO inside /app/isos/
  This ISO will be used to boot new VMs for OS installation.
