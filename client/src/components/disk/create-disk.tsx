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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  dynamic: boolean;
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
      size: "10",
      format: "qcow2",
      dynamic: true,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    // Append 'G' to the size value
    const formattedData = {
      ...data,
      size: `${data.size}G`,
    };
    console.log("Creating Disk:", formattedData);
    await addDisk(formattedData);
    onOpenChange(false);
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

          <div className="flex flex-col gap-4">
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
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Disk Size"
                  className="w-full"
                  min={1}
                  max={1000}
                  {...register("size", {
                    required: "Size is required",
                    min: { value: 1, message: "Size must be at least 1GB" },
                    max: { value: 1000, message: "Size cannot exceed 1000GB" },
                  })}
                />
                <span className="text-sm text-gray-500">GB</span>
              </div>
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

            <div className="flex items-center space-x-2">
              <Controller
                name="dynamic"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="dynamic"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="dynamic">Dynamic Disk</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" form="create-disk-form">
              Create Disk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default CreateDiskDialog;
