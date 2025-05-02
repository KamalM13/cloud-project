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
import useDisks from "@/hooks/use-disk";
import { useForm } from "react-hook-form";

interface DiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DiskFormValues {
  name: string;
  size: string;
  format: string;
}

const CreateDiskDialog = ({ open, onOpenChange }: DiskDialogProps) => {
  const { addDisk } = useDisks();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiskFormValues>({
    defaultValues: {
      name: "",
      size: "1",
      format: "",
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
                type="text"
                placeholder="Disk Size (e.g., 20G)"
                className="w-full"
                {...register("size", { required: "Size is required" })}
              />
              {errors.size && (
                <span className="text-red-500">{errors.size.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Disk Format (e.g., qcow2)"
                className="w-full"
                {...register("format", { required: "Format is required" })}
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
              onClick={() => onOpenChange(false)}
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
