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
import { ImageSearch } from "./image-search";
import { Skeleton } from "@/components/ui/skeleton";

interface PullImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PullImageDialog = ({ open, onOpenChange }: PullImageDialogProps) => {
  const [imageName, setImageName] = useState("");
  const [tag, setTag] = useState("latest");
  const { pullImage, pullImageMutation } = useDocker();

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
            <ImageSearch value={imageName} onSelect={setImageName} />
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
              disabled={pullImageMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pullImageMutation.isPending}>
              {pullImageMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <span>Pulling...</span>
                </div>
              ) : (
                "Pull Image"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PullImageDialog;
