import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDocker from "@/hooks/use-docker";

interface PullImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PullImageDialog = ({ open, onOpenChange }: PullImageDialogProps) => {
  const [imageName, setImageName] = useState("");
  const [tag, setTag] = useState("latest");
  const { pullImage } = useDocker();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pullImage({ image_name: imageName, tag });
      onOpenChange(false);
      setImageName("");
      setTag("latest");
    } catch (error) {
      console.error("Failed to pull image:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pull Docker Image</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageName">Image Name</Label>
            <Input
              id="imageName"
              placeholder="e.g., nginx, node, python"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag">Tag</Label>
            <Input
              id="tag"
              placeholder="e.g., latest, 1.0.0"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Pull Image</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PullImageDialog;
