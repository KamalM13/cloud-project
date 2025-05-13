import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Types
interface Dockerfile {
  id: string;
  name: string;
  path: string;
  created_at: string;
  updated_at: string;
}

interface DockerImage {
  id: string;
  tag: string;
  dockerfile_id?: string;
  created_at: string;
  updated_at: string;
}

interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface DockerfileCreate {
  name: string;
  content: string;
  custom_path?: string;
}

interface DockerfileTemplateCreate {
  name: string;
  template_id: string;
  customizations?: Record<string, string>;
}

interface ImageBuild {
  dockerfile_id: string;
  tag: string;
}

interface ContainerRun {
  image_id: string;
  name?: string;
  ports?: Record<string, string>;
  environment?: Record<string, string>;
}

export default function useDocker() {
  const queryClient = useQueryClient();

  // Dockerfiles
  const {
    data: dockerfiles,
    isLoading: isDockerfilesLoading,
    isError: isDockerfilesError,
  } = useQuery<Dockerfile[]>({
    queryKey: ["dockerfiles"],
    queryFn: async () => {
      const response = await api.get("/api/docker/dockerfiles");
      return response.data;
    },
  });

  const createDockerfileMutation = useMutation({
    mutationFn: async (dockerfile: DockerfileCreate) => {
      const response = await api.post("/api/docker/dockerfiles", dockerfile);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dockerfiles"] });
      toast.success("Dockerfile created successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Failed to create Dockerfile: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // Images
  const {
    data: images,
    isLoading: isImagesLoading,
    isError: isImagesError,
  } = useQuery<DockerImage[]>({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await api.get("/api/docker/images");
      return response.data;
    },
  });

  const buildImageMutation = useMutation({
    mutationFn: async (build: ImageBuild) => {
      const response = await api.post("/api/docker/images/build", build);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      toast.success("Image built successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Failed to build image: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const pullImageMutation = useMutation({
    mutationFn: async ({
      image_name,
      tag,
    }: {
      image_name: string;
      tag?: string;
    }) => {
      const response = await api.post("/api/docker/images/pull", {
        image_name,
        tag,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      toast.success("Image pulled successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Failed to pull image: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // Containers
  const {
    data: containers,
    isLoading: isContainersLoading,
    isError: isContainersError,
  } = useQuery<DockerContainer[]>({
    queryKey: ["containers"],
    queryFn: async () => {
      const response = await api.get(
        "/api/docker/containers?all_containers=true"
      );
      return response.data;
    },
  });

  const runContainerMutation = useMutation({
    mutationFn: async (container: ContainerRun) => {
      const response = await api.post("/api/docker/containers/run", container);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
      toast.success("Container started successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Failed to start container: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const stopContainerMutation = useMutation({
    mutationFn: async (containerId: string) => {
      const response = await api.post(
        `/api/docker/containers/${containerId}/stop`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
      toast.success("Container stopped successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Failed to stop container: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // Templates
  const {
    data: templates,
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await api.get("/api/docker/templates");
      return response.data;
    },
  });

  const createDockerfileFromTemplateMutation = useMutation({
    mutationFn: async (dockerfile: DockerfileTemplateCreate) => {
      const response = await api.post(
        "/api/docker/dockerfiles/template",
        dockerfile
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dockerfiles"] });
      toast.success("Dockerfile created from template successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Failed to create Dockerfile from template: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // Search
  const searchImageMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await api.get(`/api/docker/search?query=${query}`);
      return response.data;
    },
  });

  return {
    // Dockerfiles
    dockerfiles,
    isDockerfilesLoading,
    isDockerfilesError,
    createDockerfile: createDockerfileMutation.mutate,
    createDockerfileFromTemplate: createDockerfileFromTemplateMutation.mutate,

    // Images
    images,
    isImagesLoading,
    isImagesError,
    buildImage: buildImageMutation.mutate,
    pullImage: pullImageMutation.mutate,

    // Containers
    containers,
    isContainersLoading,
    isContainersError,
    runContainer: runContainerMutation.mutate,
    stopContainer: stopContainerMutation.mutate,

    // Templates
    templates,
    isTemplatesLoading,
    isTemplatesError,

    // Search
    searchImage: searchImageMutation.mutate,
  };
}
