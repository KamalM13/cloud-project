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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDocker from "@/hooks/use-docker";

interface BuildImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BuildImageDialog = ({ open, onOpenChange }: BuildImageDialogProps) => {
  const [dockerfileId, setDockerfileId] = useState("");
  const [tag, setTag] = useState("");
  const { dockerfiles, buildImage } = useDocker();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await buildImage({ dockerfile_id: dockerfileId, tag });
      onOpenChange(false);
      setDockerfileId("");
      setTag("");
    } catch (error) {
      console.error("Failed to build image:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Build Docker Image</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dockerfile">Dockerfile</Label>
            <Select
              value={dockerfileId}
              onValueChange={setDockerfileId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Dockerfile" />
              </SelectTrigger>
              <SelectContent>
                {dockerfiles?.map((dockerfile) => (
                  <SelectItem key={dockerfile.id} value={dockerfile.id}>
                    {dockerfile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button type="submit">Build Image</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BuildImageDialog;
