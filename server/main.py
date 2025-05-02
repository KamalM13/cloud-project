from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn
import os
import sys

# Configure logging with default values
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Add the current directory to path if needed
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Try to import config, but use defaults if not available
try:
    from app.config import LOG_LEVEL, LOG_FORMAT
    logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)
except ImportError:
    logger.warning("Using default logging configuration. Config module not found.")

# Import routers - with fallbacks
try:
    from app.routers import disk_router, vm_router
except ImportError:
    try:
        from routers import disk_router, vm_router
    except ImportError:
        logger.error("Could not import routers. Please check your project structure.")
        disk_router = None
        vm_router = None

# Create FastAPI app
app = FastAPI(
    title="Cloud Management System",
    description="API for managing virtual machines and disks",
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

# Include routers if available
if disk_router and vm_router:
    app.include_router(disk_router, prefix="/api")
    app.include_router(vm_router, prefix="/api")
else:
    logger.warning("Routers not loaded. API endpoints may not be available.")

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
            "vms": "/api/vms"
        }
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
    uvicorn.run(app, host="0.0.0.0", port=8000)