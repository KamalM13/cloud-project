import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDisks from "@/hooks/use-disk";
import useVms from "@/hooks/use-vms";

import { Controller, useForm } from "react-hook-form";

interface CreateVmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormValues = {
  disk_id: string;
  cpu: number;
  memory: number;
  name: string;
};

const CreateVmDialog = ({
  open: isCreateVMOpen,
  onOpenChange: setIsCreateVMOpen,
}: CreateVmDialogProps) => {
  const { disks } = useDisks();
  const { createVm } = useVms();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      disk_id: "",
      cpu: 1,
      memory: 1024,
      name: "",
    },
  });

  if (!disks) {
    return null;
  }
  const onSubmit = handleSubmit((data) => {
    console.log("Form data:", data);
    createVm(data);
  });
  return (
    <form onSubmit={onSubmit} className="space-y-4" id="create-vm-form">
      <Dialog open={isCreateVMOpen} onOpenChange={setIsCreateVMOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Virtual Machine</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new virtual machine.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vm-name">Name</Label>
              <Input
                placeholder="Enter VM name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vm-cpu">CPU Cores</Label>
              <Controller
                name="cpu"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) =>
                      field.onChange(Number.parseInt(value))
                    }
                  >
                    <SelectTrigger id="vm-cpu">
                      <SelectValue placeholder="Select CPU cores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Core</SelectItem>
                      <SelectItem value="2">2 Cores</SelectItem>
                      <SelectItem value="4">4 Cores</SelectItem>
                      <SelectItem value="8">8 Cores</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.cpu && (
                <p className="text-red-500 text-sm">{errors.cpu.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vm-memory">Memory Size (MB)</Label>
              <Controller
                name="memory"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) =>
                      field.onChange(Number.parseInt(value))
                    }
                  >
                    <SelectTrigger id="vm-memory">
                      <SelectValue placeholder="Select memory size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024">1024 MB (1 GB)</SelectItem>
                      <SelectItem value="2048">2048 MB (2 GB)</SelectItem>
                      <SelectItem value="4096">4096 MB (4 GB)</SelectItem>
                      <SelectItem value="8192">8192 MB (8 GB)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.memory && (
                <p className="text-red-500 text-sm">{errors.memory.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vm-disk">Disk</Label>
              <Controller
                name="disk_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger id="vm-disk">
                      <SelectValue placeholder="Select disk" />
                    </SelectTrigger>
                    <SelectContent>
                      {disks
                        .filter((disk) => !disk.in_use)
                        .map((disk) => (
                          <SelectItem key={disk.id} value={disk.id}>
                            {disk.name} ({disk.size})
                          </SelectItem>
                        ))}
                      {disks.filter((disk) => !disk.in_use).length === 0 && (
                        <SelectItem value="none" disabled>
                          No available disks
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.disk_id && (
                <p className="text-red-500 text-sm">{errors.disk_id.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (
                  errors.name?.message ||
                  errors.disk_id?.message ||
                  errors.cpu?.message ||
                  errors.memory?.message
                ) {
                  return;
                }
                setIsCreateVMOpen(false);
              }}
              form="create-vm-form"
              type="submit"
            >
              Create VM
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default CreateVmDialog;
