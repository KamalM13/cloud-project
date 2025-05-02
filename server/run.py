import uvicorn
import os
import sys

# Add the project root to the Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

if __name__ == "__main__":
    # Run with direct module path
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)