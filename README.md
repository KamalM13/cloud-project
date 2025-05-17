# Cloud Project Documentation

## Project Overview

This is a full-stack cloud management application that provides functionality for managing Docker containers, virtual machines, and disk resources. The project consists of a FastAPI backend and a React/TypeScript frontend.

## Project Structure

### Backend (server/)

The backend is built using FastAPI and follows a modular architecture:

```
server/
├── app/
│   ├── routers/     # API route handlers
│   ├── services/    # Business logic
│   ├── models/      # Data models
│   ├── utils/       # Utility functions
│   ├── templates/   # Template files
│   └── data/        # Data storage
├── tests/           # Test suite
└── run.py          # Application entry point
```

### Frontend (client/)

The frontend is built using React with TypeScript and Vite:

```
client/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page components
│   ├── hooks/       # Custom React hooks
│   ├── types/       # TypeScript type definitions
│   ├── lib/         # Utility functions and configurations
│   └── assets/      # Static assets
└── public/          # Public static files
```

## Features

### Docker Management

- Container creation and management
- Container status monitoring
- Container configuration
- Docker network management

### Virtual Machine Management

- VM creation and deployment
- VM status monitoring
- Resource allocation
- VM configuration management

### Disk Management

- Disk resource monitoring
- Storage allocation
- Disk performance metrics

## API Endpoints

### Docker Endpoints

- `GET /api/docker/containers` - List all containers
- `POST /api/docker/containers` - Create a new container
- `GET /api/docker/containers/{container_id}` - Get container details
- `DELETE /api/docker/containers/{container_id}` - Remove a container

### VM Endpoints

- `GET /api/vm/instances` - List all VMs
- `POST /api/vm/instances` - Create a new VM
- `GET /api/vm/instances/{vm_id}` - Get VM details
- `DELETE /api/vm/instances/{vm_id}` - Remove a VM

### Disk Endpoints

- `GET /api/disk/resources` - List disk resources
- `GET /api/disk/usage` - Get disk usage statistics

## Test Coverage

The project includes comprehensive test coverage for all major components:

### Backend Tests

- Docker Router Tests (`test_docker_router.py`)
- VM Router Tests (`test_vm_router.py`)
- Disk Router Tests (`test_disk_router.py`)
- Main Application Tests (`test_main.py`)

All tests have been successfully executed and passed, ensuring the reliability of the application.

## Setup and Installation

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   python run.py
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### Running Tests

To run the backend tests:

```bash
cd server
pytest
```

### Code Style

- Backend follows PEP 8 guidelines
- Frontend uses ESLint and Prettier for code formatting
- TypeScript strict mode is enabled

## Dependencies

### Backend Dependencies

- FastAPI
- Pydantic
- SQLAlchemy
- Docker SDK
- Pytest

### Frontend Dependencies

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
