import os
import json
import logging
import subprocess
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import uuid4

from app.config import DOCKER_DATA_FOLDER
from app.models.docker import DockerImage, DockerContainer, Dockerfile
from app.utils.subprocess_utils import run_command, check_command_exists
from app.templates.dockerfile_templates import DOCKERFILE_TEMPLATES

logger = logging.getLogger(__name__)


class DockerService:
    def __init__(self):
        """Initialize the Docker service and ensure Docker is available"""
        if not check_command_exists("docker"):
            raise RuntimeError("docker command not found - please install Docker")

        # Create Docker metadata file if it doesn't exist
        self.metadata_file = os.path.join(DOCKER_DATA_FOLDER, "metadata.json")
        if not os.path.exists(self.metadata_file):
            with open(self.metadata_file, "w") as f:
                json.dump({}, f)

        # Create Dockerfiles directory if it doesn't exist
        self.dockerfiles_dir = os.path.join(DOCKER_DATA_FOLDER, "dockerfiles")
        os.makedirs(self.dockerfiles_dir, exist_ok=True)

    def _load_metadata(self) -> Dict:
        """Load Docker metadata from JSON file"""
        try:
            with open(self.metadata_file, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}

    def _save_metadata(self, metadata: Dict) -> None:
        """Save Docker metadata to JSON file"""
        with open(self.metadata_file, "w") as f:
            json.dump(metadata, f, default=str)

    def create_dockerfile(
        self, name: str, content: str, custom_path: Optional[str] = None
    ) -> Dockerfile:
        """
        Create a new Dockerfile

        Args:
            name: Name for the Dockerfile
            content: Content of the Dockerfile
            custom_path: Optional custom path where the Dockerfile should be saved.
                        If not provided, it will be saved in the default dockerfiles directory.

        Returns:
            Dockerfile object with the created Dockerfile details
        """
        # Create unique filename
        dockerfile_id = str(uuid4())
        filename = f"{name.replace(' ', '_')}_{dockerfile_id}.dockerfile"

        # Use custom path if provided, otherwise use default dockerfiles directory
        if custom_path:
            path = os.path.join(custom_path, filename)
            # Ensure the directory exists
            os.makedirs(os.path.dirname(path), exist_ok=True)
        else:
            path = os.path.join(self.dockerfiles_dir, filename)

        # Write Dockerfile content
        with open(path, "w") as f:
            f.write(content)

        # Create and save metadata
        dockerfile_info = {
            "id": dockerfile_id,
            "name": name,
            "path": path,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        }

        metadata = self._load_metadata()
        if "dockerfiles" not in metadata:
            metadata["dockerfiles"] = {}
        metadata["dockerfiles"][dockerfile_id] = dockerfile_info
        self._save_metadata(metadata)

        return Dockerfile(
            id=dockerfile_id,
            name=name,
            path=path,
            created_at=datetime.fromisoformat(dockerfile_info["created_at"]),
            updated_at=datetime.fromisoformat(dockerfile_info["updated_at"]),
        )

    def build_image(self, dockerfile_id: str, tag: str) -> DockerImage:
        """
        Build a Docker image from a Dockerfile

        Args:
            dockerfile_id: ID of the Dockerfile to use
            tag: Tag for the Docker image

        Returns:
            DockerImage object with the built image details
        """
        metadata = self._load_metadata()
        if (
            "dockerfiles" not in metadata
            or dockerfile_id not in metadata["dockerfiles"]
        ):
            raise ValueError(f"Dockerfile with ID {dockerfile_id} not found")

        dockerfile_info = metadata["dockerfiles"][dockerfile_id]
        dockerfile_path = dockerfile_info["path"]

        # Create a temporary build context directory
        build_context_dir = os.path.join(
            os.path.dirname(dockerfile_path), f"build_context_{dockerfile_id}"
        )
        os.makedirs(build_context_dir, exist_ok=True)

        try:
            # Copy Dockerfile to build context with standard name
            with open(dockerfile_path, "r") as src, open(
                os.path.join(build_context_dir, "Dockerfile"), "w"
            ) as dst:
                dst.write(src.read())

            # Build the Docker image from the build context
            command = ["docker", "build", "-t", tag, build_context_dir]

            stdout, stderr, return_code = run_command(command)

            if return_code != 0:
                raise RuntimeError(f"Failed to build Docker image: {stderr}")

            # Get image ID from docker images
            image_id_command = ["docker", "images", "-q", tag]
            image_id, _, _ = run_command(image_id_command)
            image_id = image_id.strip()

            # Create and save metadata
            image_info = {
                "id": image_id,
                "tag": tag,
                "dockerfile_id": dockerfile_id,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }

            if "images" not in metadata:
                metadata["images"] = {}
            metadata["images"][image_id] = image_info
            self._save_metadata(metadata)

            return DockerImage(
                id=image_id,
                tag=tag,
                dockerfile_id=dockerfile_id,
                created_at=datetime.fromisoformat(image_info["created_at"]),
                updated_at=datetime.fromisoformat(image_info["updated_at"]),
            )

        finally:
            # Clean up build context directory
            import shutil

            shutil.rmtree(build_context_dir, ignore_errors=True)

    def list_images(self) -> List[DockerImage]:
        """
        List all Docker images

        Returns:
            List of DockerImage objects
        """
        command = ["docker", "images", "--format", "{{.ID}}\t{{.Repository}}\t{{.Tag}}"]
        stdout, _, _ = run_command(command)

        images = []
        for line in stdout.strip().split("\n"):
            if not line:
                continue
            image_id, repository, tag = line.split("\t")
            full_tag = f"{repository}:{tag}" if tag != "<none>" else repository

            images.append(
                DockerImage(
                    id=image_id,
                    tag=full_tag,
                    dockerfile_id=None,  # We don't track this for pulled images
                    created_at=datetime.now(),  # Docker doesn't provide this easily
                    updated_at=datetime.now(),
                )
            )

        return images

    def list_containers(self, all_containers: bool = False) -> List[DockerContainer]:
        """
        List all Docker containers

        Args:
            all_containers: Whether to include stopped containers

        Returns:
            List of DockerContainer objects
        """
        command = ["docker", "ps"]
        if all_containers:
            command.append("-a")
        command.extend(["--format", "{{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}"])

        stdout, _, _ = run_command(command)

        containers = []
        for line in stdout.strip().split("\n"):
            if not line:
                continue
            container_id, image, status, name = line.split("\t")

            containers.append(
                DockerContainer(
                    id=container_id,
                    name=name,
                    image=image,
                    status=status,
                    created_at=datetime.now(),  # Docker doesn't provide this easily
                    updated_at=datetime.now(),
                )
            )

        return containers

    def list_dockerfiles(self) -> List[Dockerfile]:
        """
        List all Dockerfiles

        Returns:
            List of Dockerfile objects
        """
        metadata = self._load_metadata()
        dockerfiles = []

        if "dockerfiles" in metadata:
            for dockerfile_id, info in metadata["dockerfiles"].items():
                dockerfiles.append(
                    Dockerfile(
                        id=dockerfile_id,
                        name=info["name"],
                        path=info["path"],
                        created_at=datetime.fromisoformat(info["created_at"]),
                        updated_at=datetime.fromisoformat(info["updated_at"]),
                    )
                )

        return dockerfiles

    def delete_container(self, container_id: str) -> bool:
        """
        Delete a Docker container

        Args:
            container_id: ID of the container to delete

        Returns:
            Boolean indicating success
        """
        # First try to stop the container if it's running
        try:
            command = ["docker", "stop", container_id]
            run_command(command)
        except:
            pass  # Ignore errors from stop command

        # Then remove the container
        command = ["docker", "rm", "-f", container_id]
        _, stderr, return_code = run_command(command)

        if return_code != 0:
            raise RuntimeError(f"Failed to delete container: {stderr}")

        # Try to clean up metadata if it exists
        try:
            metadata = self._load_metadata()
            if "containers" in metadata and container_id in metadata["containers"]:
                del metadata["containers"][container_id]
                self._save_metadata(metadata)
        except Exception:
            pass  # Ignore metadata errors - container deletion was successful

        return True

    def delete_dockerfile(self, dockerfile_id: str) -> bool:
        """
        Delete a Dockerfile

        Args:
            dockerfile_id: ID of the Dockerfile to delete

        Returns:
            Boolean indicating success
        """
        metadata = self._load_metadata()

        if (
            "dockerfiles" not in metadata
            or dockerfile_id not in metadata["dockerfiles"]
        ):
            raise ValueError(f"Dockerfile with ID {dockerfile_id} not found")

        # Get the actual file path from metadata
        dockerfile_info = metadata["dockerfiles"][dockerfile_id]
        dockerfile_path = dockerfile_info["path"]

        try:
            # Delete the file
            os.remove(dockerfile_path)

            # Remove the entry from metadata
            del metadata["dockerfiles"][dockerfile_id]
            self._save_metadata(metadata)

            return True
        except FileNotFoundError:
            # If file is already gone, just clean up metadata
            del metadata["dockerfiles"][dockerfile_id]
            self._save_metadata(metadata)
            return True
        except Exception as e:
            raise RuntimeError(f"Failed to delete Dockerfile: {str(e)}")

    def start_container(self, container_id: str) -> bool:
        """
        Start a Docker container and update metadata
        """
        command = ["docker", "start", container_id]
        _, stderr, return_code = run_command(command)

        if return_code != 0:
            raise RuntimeError(f"Failed to start container: {stderr}")

        # Update metadata to reflect the container's running status
        metadata = self._load_metadata()
        if "containers" in metadata and container_id in metadata["containers"]:
            metadata["containers"][container_id]["status"] = "running"
            metadata["containers"][container_id]["updated_at"] = datetime.now()
            self._save_metadata(metadata)

        return True

    def stop_container(self, container_id: str) -> bool:
        """
        Stop a Docker container

        Args:
            container_id: ID of the container to stop

        Returns:
            Boolean indicating success
        """
        command = ["docker", "stop", container_id]
        _, stderr, return_code = run_command(command)

        if return_code != 0:
            raise RuntimeError(f"Failed to stop container: {stderr}")

        return True

    def search_image(self, query: str) -> List[Dict[str, str]]:
        """
        Search for Docker images on Docker Hub

        Args:
            query: Search query

        Returns:
            List of image information dictionaries
        """
        command = ["docker", "search", query]
        stdout, _, _ = run_command(command)

        results = []
        for line in stdout.strip().split("\n")[1:]:  # Skip header line
            if not line:
                continue
            parts = line.split()
            if len(parts) >= 5:
                # The format is: NAME DESCRIPTION STARS OFFICIAL AUTOMATED
                name = parts[0]
                # Find the last three fields (stars, official, automated)
                stars = parts[-3]
                official = parts[-2]
                automated = parts[-1]
                # Everything in between is the description
                description = " ".join(parts[1:-3])

                try:
                    stars_int = int(stars)
                except ValueError:
                    stars_int = 0

                results.append(
                    {
                        "name": name,
                        "description": description,
                        "stars": stars_int,
                        "official": official == "[OK]",
                        "automated": automated == "[OK]",
                    }
                )

        return results

    def pull_image(self, image_name: str, tag: str = "latest") -> DockerImage:
        """
        Pull a Docker image from Docker Hub

        Args:
            image_name: Name of the image to pull
            tag: Tag of the image to pull

        Returns:
            DockerImage object with the pulled image details
        """
        full_tag = f"{image_name}:{tag}"
        command = ["docker", "pull", full_tag]
        stdout, stderr, return_code = run_command(command)

        if return_code != 0:
            raise RuntimeError(f"Failed to pull image: {stderr}")

        # Get image ID
        command = ["docker", "images", full_tag, "--format", "{{.ID}}"]
        stdout, _, _ = run_command(command)
        image_id = stdout.strip()

        # Create and save metadata
        metadata = self._load_metadata()
        if "images" not in metadata:
            metadata["images"] = {}

        image_info = {
            "id": image_id,
            "tag": full_tag,
            "dockerfile_id": None,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        }

        metadata["images"][image_id] = image_info
        self._save_metadata(metadata)

        return DockerImage(
            id=image_id,
            tag=full_tag,
            dockerfile_id=None,
            created_at=datetime.fromisoformat(image_info["created_at"]),
            updated_at=datetime.fromisoformat(image_info["updated_at"]),
        )

    def delete_image(self, image_id: str) -> bool:
        """
        Delete a Docker image and remove its metadata
        """
        # Delete the image from the system
        command = ["docker", "rmi", "-f", image_id]
        _, stderr, return_code = run_command(command)

        if return_code != 0:
            raise RuntimeError(f"Failed to delete image: {stderr}")

        # Remove the image from metadata
        metadata = self._load_metadata()
        if "images" in metadata and image_id in metadata["images"]:
            del metadata["images"][image_id]
            self._save_metadata(metadata)

        return True

    def run_container(
        self,
        image_id: str,
        name: Optional[str] = None,
        ports: Optional[Dict[str, str]] = None,
        environment: Optional[Dict[str, str]] = None,
    ) -> DockerContainer:
        """
        Run a Docker container. If a stopped container exists for the same image and name,
        it will be restarted instead of creating a new one.

        Args:
            image_id: ID of the image to run
            name: Optional name for the container
            ports: Optional port mappings (host_port:container_port)
            environment: Optional environment variables

        Returns:
            DockerContainer object with the running container details
        """
        # Generate a name if none provided
        if not name:
            name = f"container_{image_id[:12]}"  # Simplified name for better reuse

        # Check if container with this name already exists
        existing_container_cmd = [
            "docker",
            "ps",
            "-a",
            "--filter",
            f"name=^{name}$",
            "--format",
            "{{.ID}}",
        ]
        existing_id, _, _ = run_command(existing_container_cmd)

        if existing_id.strip():
            # Container exists, start it if it's stopped
            container_id = existing_id.strip()
            status_cmd = [
                "docker",
                "inspect",
                "--format={{.State.Running}}",
                container_id,
            ]
            is_running, _, _ = run_command(status_cmd)

            if is_running.strip() == "false":
                start_cmd = ["docker", "start", container_id]
                _, stderr, return_code = run_command(start_cmd)
                if return_code != 0:
                    raise RuntimeError(f"Failed to start existing container: {stderr}")
        else:
            # No existing container, create new one
            command = ["docker", "run", "-d", "--restart=unless-stopped"]
            command.extend(["--name", name])

            # Add default environment variables based on image
            if not environment:
                environment = {}

            # Check if it's a known image type and add appropriate settings
            image_info_cmd = ["docker", "inspect", "--format={{.Config.Cmd}}", image_id]
            image_info, _, _ = run_command(image_info_cmd)

            if "python" in image_info.lower():
                # For Python/Flask apps
                environment["PYTHONUNBUFFERED"] = "1"
                environment["FLASK_ENV"] = "development"
            elif "node" in image_info.lower():
                # For Node.js apps
                environment["NODE_ENV"] = "development"
            elif "postgres" in image_info.lower():
                # For PostgreSQL
                if "POSTGRES_PASSWORD" not in environment:
                    environment["POSTGRES_PASSWORD"] = "postgres"
                if "POSTGRES_USER" not in environment:
                    environment["POSTGRES_USER"] = "postgres"

            # Add environment variables
            for key, value in environment.items():
                command.extend(["-e", f"{key}={value}"])

            # Add port mappings
            if ports:
                for host_port, container_port in ports.items():
                    command.extend(["-p", f"{host_port}:{container_port}"])

            command.append(image_id)

            stdout, stderr, return_code = run_command(command)

            if return_code != 0:
                raise RuntimeError(f"Failed to run container: {stderr}")

            container_id = stdout.strip()

            # Wait briefly for container to start
            import time

            time.sleep(2)

        # Get container details
        command = [
            "docker",
            "ps",
            "--filter",
            f"id={container_id}",
            "--format",
            "{{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}",
        ]
        stdout, _, _ = run_command(command)

        if not stdout:
            # If container not found in running containers, check all containers
            command = [
                "docker",
                "ps",
                "-a",
                "--filter",
                f"id={container_id}",
                "--format",
                "{{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}",
            ]
            stdout, _, _ = run_command(command)
            if not stdout:
                raise RuntimeError("Failed to get container details")

        container_id, image, status, name = stdout.strip().split("\t")

        # If container stopped immediately, check logs for error
        if "Exited" in status:
            logs_cmd = ["docker", "logs", container_id]
            logs, _, _ = run_command(logs_cmd)
            raise RuntimeError(f"Container stopped after starting. Logs:\n{logs}")

        return DockerContainer(
            id=container_id,
            name=name,
            image=image,
            status=status,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

    def get_available_templates(self) -> Dict[str, Dict[str, str]]:
        """
        Get all available Dockerfile templates

        Returns:
            Dictionary of template information
        """
        return {
            template_id: {
                "name": template["name"],
                "description": template["description"],
            }
            for template_id, template in DOCKERFILE_TEMPLATES.items()
        }

    def create_dockerfile_from_template(
        self,
        name: str,
        template_id: str,
        customizations: Optional[Dict[str, str]] = None,
    ) -> Dockerfile:
        """
        Create a new Dockerfile from a template

        Args:
            name: Name for the Dockerfile
            template_id: ID of the template to use
            customizations: Optional dictionary of customizations to apply to the template

        Returns:
            Dockerfile object with the created Dockerfile details
        """
        if template_id not in DOCKERFILE_TEMPLATES:
            raise ValueError(f"Template {template_id} not found")

        template = DOCKERFILE_TEMPLATES[template_id]["template"]
        content = template

        if customizations:
            for key, value in customizations.items():
                content = content.replace(f"{{{key}}}", value)

        return self.create_dockerfile(name, content)

    def get_dockerfile_content(self, dockerfile_id: str) -> str:
        """
        Get the content of a Dockerfile

        Args:
            dockerfile_id: ID of the Dockerfile to get

        Returns:
            String with the content of the Dockerfile
        """
        metadata = self._load_metadata()
        dockerfile_info = metadata.get("dockerfiles", {}).get(dockerfile_id)

        if not dockerfile_info:
            raise ValueError(f"Dockerfile with ID {dockerfile_id} not found")

        dockerfile_path = dockerfile_info["path"]

        try:
            with open(dockerfile_path, "r") as f:
                return f.read()
        except FileNotFoundError:
            raise ValueError(f"Dockerfile file not found at {dockerfile_path}")
