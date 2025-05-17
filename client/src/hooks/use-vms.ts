import api from "@/lib/api";
import { VM } from "@/types/vm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateVm = {
  name: string;
  cpu: number;
  memory: number;
  disk_id: string;
};

export default function useVms() {
  const queryClient = useQueryClient();
  const {
    data: vms,
    isLoading,
    error,
  } = useQuery<VM[]>({
    queryKey: ["vms"],
    queryFn: async () => {
      const response = await api.get("api/vms");
      return response.data.vms;
    },
  });

  const createVmMutation = useMutation({
    mutationFn: async (newVm: CreateVm) => {
      const response = await api.post("api/vms", {
        name: newVm.name,
        cpu_cores: newVm.cpu,
        memory_size: newVm.memory,
        disk_id: newVm.disk_id,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vms"] });
      queryClient.invalidateQueries({ queryKey: ["disks"] });
      toast.success("VM created successfully");
    },
    onError: (error) => {
      console.error("Error creating VM:", error);
      toast.error(
        "Failed to create VM. Please try again.",
        error.response.data
      );
    },
  });

  const deleteVmMutation = useMutation({
    mutationFn: async (vmId: string) => {
      const response = await api.delete(`api/vms/${vmId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vms"] });
      queryClient.invalidateQueries({ queryKey: ["disks"] });
      toast.success("VM deleted successfully");
    },
  });

  const startVmMutation = useMutation({
    mutationFn: async (vmId: string) => {
      const response = await api.post(`api/vms/${vmId}/start`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vms"] });
      queryClient.invalidateQueries({ queryKey: ["disks"] });
      toast.success("VM started successfully");
    },
  });

  const stopVmMutation = useMutation({
    mutationFn: async (vmId: string) => {
      const response = await api.post(`api/vms/${vmId}/stop`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vms"] });
      queryClient.invalidateQueries({ queryKey: ["disks"] });
      toast.success("VM stopped successfully");
    },
  });

  const editVmMutation = useMutation({
    mutationFn: async ({ vmId, newVm }: { vmId: string; newVm: CreateVm }) => {
      const response = await api.put(`api/vms/${vmId}`, {
        name: newVm.name,
        cpu_cores: newVm.cpu,
        memory_size: newVm.memory,
        disk_id: newVm.disk_id,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vms"] });
      queryClient.invalidateQueries({ queryKey: ["disks"] });
      toast.success("VM updated successfully");
    },
    onError: (error) => {
      console.error("Error updating VM:", error);
      toast.error(
        "Failed to update VM. Please try again.",
        error.response.data
      );
    },
  });

  const createVm = async (newVm: CreateVm) => {
    await createVmMutation.mutateAsync(newVm);
  };

  const deleteVm = async (vmId: string) => {
    await deleteVmMutation.mutateAsync(vmId);
  };

  const startVm = async (vmId: string) => {
    await startVmMutation.mutateAsync(vmId);
  };

  const stopVm = async (vmId: string) => {
    await stopVmMutation.mutateAsync(vmId);
  };

  const editVm = async (vmId: string, newVm: CreateVm) => {
    await editVmMutation.mutateAsync({ vmId, newVm });
  };

  return {
    vms,
    isLoadingVms: isLoading,
    error,
    createVm,
    deleteVm,
    startVm,
    stopVm,
    editVm,
  };
}
