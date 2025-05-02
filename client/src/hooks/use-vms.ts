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
      const response = await api.post("api/vms", newVm);
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

  const createVm = (newVm: CreateVm) => {
    createVmMutation.mutate(newVm);
  };

  const deleteVm = (vmId: string) => {
    deleteVmMutation.mutate(vmId);
  };

  const startVm = (vmId: string) => {
    startVmMutation.mutate(vmId);
  };

  const stopVm = (vmId: string) => {
    stopVmMutation.mutate(vmId);
  };
  return {
    vms,
    isLoadingVms: isLoading,
    error,
    createVm,
    deleteVm,
    startVm,
    stopVm,
  };
}
