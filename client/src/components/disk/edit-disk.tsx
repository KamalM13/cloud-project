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
import useDisks from "@/hooks/use-disk";
import { Disk } from "@/types/disk";
import { useForm } from "react-hook-form";

interface EditDiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disk: Disk;
}

interface EditDiskFormValues {
  name: string;
  size: string;
}

const EditDiskDialog = ({ open, onOpenChange, disk }: EditDiskDialogProps) => {
  const { editDisk } = useDisks();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditDiskFormValues>({
    defaultValues: {
      name: disk.name,
      // Remove 'G' from size for the input field
      size: disk.size.replace("G", ""),
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    // Append 'G' to the size value
    const formattedData = {
      ...data,
      size: `${data.size}G`,
    };
    console.log("Updating Disk:", formattedData);
    await editDisk(disk.id, formattedData);
    onOpenChange(false);
  });

  return (
    <form id="edit-disk-form" onSubmit={onSubmit} className="space-y-4">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Disk</DialogTitle>
            <DialogDescription>
              Modify the disk properties below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Disk Name</Label>
              <Input
                id="name"
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
              <Label htmlFor="size">Disk Size</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="size"
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
              <Label>Format</Label>
              <Input
                type="text"
                value={disk.format.toUpperCase()}
                disabled
                className="w-full bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label>Dynamic Disk</Label>
              <Input
                type="text"
                value={disk.dynamic ? "Yes" : "No"}
                disabled
                className="w-full bg-gray-100"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" form="edit-disk-form">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default EditDiskDialog;
