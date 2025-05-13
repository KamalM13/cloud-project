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
import { Textarea } from "@/components/ui/textarea";
import useDocker from "@/hooks/use-docker";

interface CreateDockerfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateDockerfileDialog = ({
  open,
  onOpenChange,
}: CreateDockerfileDialogProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [customPath, setCustomPath] = useState("");
  const { createDockerfile } = useDocker();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDockerfile({
        name,
        content,
        custom_path: customPath || undefined,
      });
      onOpenChange(false);
      setName("");
      setContent("");
      setCustomPath("");
    } catch (error) {
      console.error("Failed to create Dockerfile:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Dockerfile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., my-app-dockerfile"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Dockerfile Content</Label>
            <Textarea
              id="content"
              placeholder="FROM node:18\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ['npm', 'start']"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-48 font-mono"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customPath">Custom Path (Optional)</Label>
            <Input
              id="customPath"
              placeholder="e.g., /custom/path/to/dockerfile"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
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
            <Button type="submit">Create Dockerfile</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDockerfileDialog;
