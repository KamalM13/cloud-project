import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Define error response type for better typing
interface ErrorResponse {
  message: string;
}

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
  dockerfile_id: string | null;
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

interface DockerfileTemplate {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
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

interface SearchResult {
  name: string;
  description: string;
  stars: number;
  official: boolean;
  automated: boolean;
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
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Failed to create Dockerfile: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const deleteDockerfileMutation = useMutation({
    mutationFn: async (dockerfileId: string) => {
      const response = await api.delete(
        `/api/docker/dockerfiles/${dockerfileId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dockerfiles"] });
      toast.success("Dockerfile deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(`Failed to delete Dockerfile: ${error.message}`);
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
    onError: (error: AxiosError<ErrorResponse>) => {
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
      const response = await api.post(
        `/api/docker/images/pull?image_name=${encodeURIComponent(image_name)}${
          tag ? `&tag=${encodeURIComponent(tag)}` : ""
        }`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      toast.success("Image pulled successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Failed to pull image: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const searchImageMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await api.get<SearchResult[]>(
        `/api/docker/search?query=${encodeURIComponent(query)}`
      );
      return response.data;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Failed to search images: ${
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

  const createContainerMutation = useMutation({
    mutationFn: async (container: ContainerRun) => {
      const response = await api.post("/api/docker/containers/run", container);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
      toast.success("Container started successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Failed to start container: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const startContainerMutation = useMutation({
    mutationFn: async (containerId: string) => {
      const response = await api.post(
        `/api/docker/containers/${containerId}/start`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
      toast.success("Container started successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
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
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Failed to stop container: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const deleteContainerMutation = useMutation({
    mutationFn: async (containerId: string) => {
      const response = await api.delete(
        `/api/docker/containers/${containerId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
      toast.success("Container deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Failed to delete container: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const response = await api.delete(`/api/docker/images/${imageId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      toast.success("Image deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Failed to delete image: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const { data: templates } = useQuery<DockerfileTemplate[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await api.get("/api/docker/templates");
      return response.data;
    },
  });

  const createDockerfileFromTemplateMutation = useMutation({
    mutationFn: async (template: DockerfileTemplateCreate) => {
      const response = await api.post(
        "/api/docker/dockerfiles/template",
        template
      );
      return response.data;
    },
  });

  return {
    // Dockerfiles
    dockerfiles,
    isDockerfilesLoading,
    isDockerfilesError,
    createDockerfile: createDockerfileMutation.mutateAsync,
    deleteDockerfile: deleteDockerfileMutation.mutateAsync,

    // Images
    images,
    isImagesLoading,
    isImagesError,
    buildImage: buildImageMutation.mutateAsync,
    pullImage: pullImageMutation.mutateAsync,
    pullImageMutation,
    deleteImage: deleteImageMutation.mutateAsync,
    searchImage: searchImageMutation.mutateAsync,

    // Containers
    containers,
    isContainersLoading,
    isContainersError,
    createContainer: createContainerMutation.mutateAsync,
    createContainerMutation,
    startContainer: startContainerMutation.mutateAsync,
    stopContainer: stopContainerMutation.mutateAsync,
    deleteContainer: deleteContainerMutation.mutateAsync,

    // Templates
    templates,
    createDockerfileFromTemplate:
      createDockerfileFromTemplateMutation.mutateAsync,
  };
}
