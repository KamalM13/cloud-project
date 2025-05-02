import api from "@/lib/api";
import { Disk } from "@/types/disk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddDisk {
  name: string;
  size: string;
  format: string;
}

export default function useDisks() {
  const queryClient = useQueryClient();
  const {
    data: disks,
    isLoading: isDisksLoading,
    isError: isDisksError,
  } = useQuery<Disk[]>({
    queryKey: ["disks"],
    queryFn: async () => {
      const response = await api.get("/api/disks");
      return response.data.disks;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (diskId: string) => {
      const response = await api.delete(`/api/disks/${diskId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["disks"] });
      toast.success("Disk deleted successfully");
    },
  });

  const addDiskMutation = useMutation({
    mutationFn: async (disk: AddDisk) => {
      const response = await api.post("/api/disks", disk);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["disks"] });
      toast.success("Disk created successfully");
    },
    onError: (error) => {
      console.error("Error creating disk:", error);
      toast.error(
        "Failed to create disk. Please try again.",
        error.response.data
      );
    },
  });

  const addDisk = (disk: AddDisk) => {
    addDiskMutation.mutate(disk);
  };

  const deleteDisk = (diskId: string) => {
    deleteMutation.mutate(diskId);
  };

  if (isDisksError) {
    console.error("Error fetching disks:", isDisksError);
  }

  if (isDisksLoading) {
    console.log("Loading disks...");
  }
  console.log("Disks loaded:", disks);

  return {
    disks,
    isDisksLoading,
    isDisksError,
    deleteDisk,
    addDisk,
  };
}
