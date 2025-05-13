from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn
import os
import sys

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Now import from the local modules
from config import LOG_LEVEL, LOG_FORMAT

# Import routers
from routers import disk_router, vm_router, docker_router

# Configure logging
logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Cloud Management System",
    description="API for managing virtual machines, disks, and Docker containers",
    version="1.0.0",
)

# Setup CORS with specific allowed origins
allowed_origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Allows only specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(disk_router, prefix="/api")
app.include_router(vm_router, prefix="/api")
app.include_router(docker_router, prefix="/api")


@app.get("/")
def read_root():
    """
    Root endpoint returning basic system information
    """
    return {
        "message": "Cloud Management System is running.",
        "version": "1.0.0",
        "endpoints": {
            "disks": "/api/disks",
            "vms": "/api/vms",
            "docker": "/api/docker",
        },
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}


if __name__ == "__main__":
    # Run the application with uvicorn when script is executed directly
    logger.info("Starting Cloud Management System...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
