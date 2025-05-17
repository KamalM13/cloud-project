# Cloud Management System - User Manual

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Docker Management](#docker-management)
4. [Virtual Machine Management](#virtual-machine-management)
5. [Disk Management](#disk-management)
6. [Troubleshooting](#troubleshooting)

## Introduction

Welcome to the Cloud Management System. This application provides a user-friendly interface for managing Docker containers, virtual machines, and disk resources in your cloud environment.

## Getting Started

### Prerequisites

- Docker installed on your system
- Virtualization software (for VM management)
- Modern web browser (Chrome, Firefox, or Edge recommended)

### Accessing the System

1. Start the backend server:
   ```bash
   cd server
   python run.py
   ```
2. Start the frontend application:
   ```bash
   cd client
   npm run dev
   ```
3. Open your web browser and navigate to `http://localhost:5173`

## Docker Management

### Viewing Containers

1. Navigate to the Docker section in the main menu
2. The system displays a list of all running containers
3. Each container entry shows:
   - Container ID
   - Name
   - Status
   - Image
   - Created date
   - Port mappings

### Creating a New Container

1. Click the "Create Container" button
2. Fill in the required information:
   - Image name
   - Container name
   - Port mappings
   - Environment variables
3. Click "Create" to start the container

### Managing Container Lifecycle

- **Start**: Click the play button next to a stopped container
- **Stop**: Click the stop button next to a running container
- **Restart**: Click the restart button to restart a container
- **Delete**: Click the delete button to remove a container

## Virtual Machine Management

### Viewing VMs

1. Navigate to the VM section in the main menu
2. View all virtual machines in your environment
3. Each VM entry displays:
   - VM ID
   - Name
   - Status
   - CPU usage
   - Memory usage
   - IP address

### Creating a New VM

1. Click "Create VM" button
2. Configure the VM:
   - Select OS image
   - Allocate CPU cores
   - Allocate memory
   - Configure network settings
3. Click "Create" to deploy the VM

### VM Operations

- **Start**: Power on a stopped VM
- **Stop**: Gracefully shut down a running VM
- **Restart**: Reboot the VM
- **Delete**: Remove the VM and its resources

## Disk Management

### Viewing Disk Resources

1. Navigate to the Disk section
2. View disk usage statistics:
   - Total capacity
   - Used space
   - Free space
   - Mount points

### Monitoring Disk Performance

- View real-time I/O statistics
- Monitor read/write speeds
- Check disk health status

## Troubleshooting

### Common Issues and Solutions

#### Docker Issues

1. **Container won't start**

   - Check port conflicts
   - Verify image exists
   - Check resource limits

2. **Container networking issues**
   - Verify network configuration
   - Check firewall settings
   - Ensure correct port mappings

#### VM Issues

1. **VM fails to start**

   - Check resource availability
   - Verify image integrity
   - Check virtualization settings

2. **Performance issues**
   - Monitor resource usage
   - Check for resource contention
   - Verify VM configuration

#### Disk Issues

1. **High disk usage**

   - Check for large files
   - Monitor growth trends
   - Consider cleanup or expansion

2. **Performance degradation**
   - Check I/O patterns
   - Monitor disk health
   - Consider disk optimization

### Getting Help

- Check the system logs in the Logs section
- Contact system administrator for persistent issues
- Refer to the API documentation for technical details
