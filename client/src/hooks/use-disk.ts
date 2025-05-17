import api from "@/lib/api";
import { Disk } from "@/types/disk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddDisk {
  name: string;
  size: string;
  format: string;
  dynamic: boolean;
}

interface EditDisk {
  name?: string;
  size?: string;
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
      queryClient.invalidateQueries({ queryKey: ["disks"] });
      toast.success("Disk created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating disk:", error);
      toast.error(
        "Failed to create disk. Please try again.",
        error.response?.data
      );
    },
  });

  const editDiskMutation = useMutation({
    mutationFn: async ({
      diskId,
      data,
    }: {
      diskId: string;
      data: EditDisk;
    }) => {
      const response = await api.patch(`/api/disks/${diskId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disks"] });
      toast.success("Disk updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating disk:", error);
      toast.error(
        "Failed to update disk. Please try again.",
        error.response?.data
      );
    },
  });

  const addDisk = async (disk: AddDisk) => {
    await addDiskMutation.mutateAsync(disk);
  };

  const editDisk = async (diskId: string, data: EditDisk) => {
    await editDiskMutation.mutateAsync({ diskId, data });
  };

  const deleteDisk = async (diskId: string) => {
    await deleteMutation.mutateAsync(diskId);
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
    editDisk,
  };
}
