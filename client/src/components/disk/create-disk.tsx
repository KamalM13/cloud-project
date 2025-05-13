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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDisks from "@/hooks/use-disk";
import { Controller, useForm } from "react-hook-form";

interface DiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DiskFormValues {
  name: string;
  size: string;
  format: "qcow2" | "raw" | "vmdk" | "vhdx" | "vdi";
}

const CreateDiskDialog = ({ open, onOpenChange }: DiskDialogProps) => {
  const { addDisk } = useDisks();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DiskFormValues>({
    defaultValues: {
      name: "",
      size: "1",
      format: "qcow2",
    },
  });
  const onSubmit = handleSubmit((data) => {
    console.log("Creating Disk:", data);
    addDisk(data);
  });
  return (
    <form id="create-disk-form" onSubmit={onSubmit} className="space-y-4">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Disk</DialogTitle>
            <DialogDescription>
              Create a new disk by filling in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Disk Name"
                className="w-full"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Disk Size (e.g., 20G)"
                className="w-full"
                min={1}
                max={30}
                {...register("size", {
                  required: "Size is required",
                  min: { value: 1, message: "Size must be at least 1" },
                  max: { value: 30, message: "Size cannot exceed 30" },
                })}
              />
              {errors.size && (
                <span className="text-red-500">{errors.size.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Controller
                name="format"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) =>
                      field.onChange(value as DiskFormValues["format"])
                    }
                  >
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qcow2">QCOW2</SelectItem>
                      <SelectItem value="raw">RAW</SelectItem>
                      <SelectItem value="vmdk">VMDK</SelectItem>
                      <SelectItem value="vhdx">VHDX</SelectItem>
                      <SelectItem value="vdi">VDI</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.format && (
                <span className="text-red-500">{errors.format.message}</span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              form="create-disk-form"
              onClick={() => {
                if (
                  errors.name?.message ||
                  errors.size?.message ||
                  errors.format?.message
                ) {
                  return;
                }
                onOpenChange(false);
              }}
            >
              Create Disk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default CreateDiskDialog;
