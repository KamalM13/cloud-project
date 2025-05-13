from datetime import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel


class Dockerfile(BaseModel):
    id: str
    name: str
    path: str
    created_at: datetime
    updated_at: datetime


class DockerImage(BaseModel):
    id: str
    tag: str
    dockerfile_id: Optional[str]
    created_at: datetime
    updated_at: datetime


class DockerContainer(BaseModel):
    id: str
    name: str
    image: str
    status: str
    created_at: datetime
    updated_at: datetime


class DockerfileCreate(BaseModel):
    name: str
    content: str
    custom_path: Optional[str] = None


class DockerfileTemplateCreate(BaseModel):
    name: str
    template_id: str
    customizations: Optional[Dict[str, str]] = None


class TemplateInfo(BaseModel):
    name: str
    description: str


class ImageBuild(BaseModel):
    dockerfile_id: str
    tag: str


class ContainerRun(BaseModel):
    image_id: str
    name: Optional[str] = None
    ports: Optional[Dict[str, str]] = None
    environment: Optional[Dict[str, str]] = None
