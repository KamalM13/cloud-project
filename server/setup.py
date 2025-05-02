from setuptools import setup, find_packages

setup(
    name="cloud-management",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.95.0",
        "uvicorn>=0.21.0",
        "pydantic>=2.0.0",
        "psutil>=5.9.0",
        "python-multipart>=0.0.6",
    ],
    python_requires=">=3.8",
)