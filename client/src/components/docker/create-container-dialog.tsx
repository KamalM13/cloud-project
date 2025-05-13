import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDocker from "@/hooks/use-docker";

interface CreateContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateContainerDialog = ({
  open,
  onOpenChange,
}: CreateContainerDialogProps) => {
  const { runContainer, images } = useDocker();
  const [selectedImage, setSelectedImage] = useState("");
  const [containerName, setContainerName] = useState("");

  const handleCreateContainer = async () => {
    try {
      await runContainer({
        image_id: selectedImage,
        name: containerName || undefined,
      });
      onOpenChange(false);
      setSelectedImage("");
      setContainerName("");
    } catch (error) {
      console.error("Failed to create container:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Container</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image">Image</Label>
            <Select value={selectedImage} onValueChange={setSelectedImage}>
              <SelectTrigger>
                <SelectValue placeholder="Select an image" />
              </SelectTrigger>
              <SelectContent>
                {images?.map((image) => (
                  <SelectItem key={image.id} value={image.id}>
                    {image.tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Container Name (Optional)</Label>
            <Input
              id="name"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
              placeholder="Enter container name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateContainer} disabled={!selectedImage}>
            Create Container
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContainerDialog;
