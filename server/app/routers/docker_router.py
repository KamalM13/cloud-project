from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Optional

from app.models.docker import (
    Dockerfile,
    DockerImage,
    DockerContainer,
    DockerfileCreate,
    DockerfileTemplateCreate,
    TemplateInfo,
    ImageBuild,
    ContainerRun,
)
from app.services.docker_service import DockerService

router = APIRouter(
    prefix="/docker",
    tags=["docker"],
    responses={404: {"description": "Not found"}},
)


# Dependency
def get_docker_service():
    return DockerService()


@router.post("/dockerfiles", response_model=Dockerfile, status_code=201)
def create_dockerfile(
    dockerfile: DockerfileCreate, service: DockerService = Depends(get_docker_service)
):
    """
    Create a new Dockerfile with specified content.

    Args:
        dockerfile: Dockerfile creation request containing name, content, and optional custom path
    """
    try:
        return service.create_dockerfile(
            dockerfile.name, dockerfile.content, dockerfile.custom_path
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/images/build", response_model=DockerImage, status_code=201)
def build_image(
    build: ImageBuild, service: DockerService = Depends(get_docker_service)
):
    """
    Build a Docker image from a Dockerfile.
    """
    try:
        return service.build_image(build.dockerfile_id, build.tag)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/images", response_model=List[DockerImage])
def list_images(service: DockerService = Depends(get_docker_service)):
    """
    List all Docker images.
    """
    try:
        return service.list_images()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/containers", response_model=List[DockerContainer])
def list_containers(
    all_containers: bool = False, service: DockerService = Depends(get_docker_service)
):
    """
    List all Docker containers.
    """
    try:
        return service.list_containers(all_containers)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/containers/{container_id}/stop", status_code=204)
def stop_container(
    container_id: str, service: DockerService = Depends(get_docker_service)
):
    """
    Stop a running Docker container.
    """
    try:
        service.stop_container(container_id)
        return None
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/search")
def search_image(query: str, service: DockerService = Depends(get_docker_service)):
    """
    Search for Docker images on Docker Hub.
    """
    try:
        return service.search_image(query)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/dockerfiles", response_model=List[Dockerfile])
def list_dockerfiles(service: DockerService = Depends(get_docker_service)):
    """
    List all Dockerfiles.
    """
    try:
        return service.list_dockerfiles()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/images/pull", response_model=DockerImage, status_code=201)
def pull_image(
    image_name: str,
    tag: str = "latest",
    service: DockerService = Depends(get_docker_service),
):
    """
    Pull a Docker image from Docker Hub.
    """
    try:
        return service.pull_image(image_name, tag)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/containers/run", response_model=DockerContainer, status_code=201)
def run_container(
    container: ContainerRun, service: DockerService = Depends(get_docker_service)
):
    """
    Run a Docker container with specified configuration.
    """
    try:
        return service.run_container(
            container.image_id, container.name, container.ports, container.environment
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/templates", response_model=Dict[str, TemplateInfo])
def get_templates(service: DockerService = Depends(get_docker_service)):
    """
    Get all available Dockerfile templates.
    """
    try:
        return service.get_available_templates()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/dockerfiles/template", response_model=Dockerfile, status_code=201)
def create_dockerfile_from_template(
    dockerfile: DockerfileTemplateCreate,
    service: DockerService = Depends(get_docker_service),
):
    """
    Create a new Dockerfile from a template.
    """
    try:
        return service.create_dockerfile_from_template(
            dockerfile.name, dockerfile.template_id, dockerfile.customizations
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
