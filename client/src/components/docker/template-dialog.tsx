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

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TemplateDialog = ({ open, onOpenChange }: TemplateDialogProps) => {
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [customizations, setCustomizations] = useState<Record<string, string>>(
    {}
  );
  const { templates, createDockerfileFromTemplate } = useDocker();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDockerfileFromTemplate({
        name,
        template_id: templateId,
        customizations:
          Object.keys(customizations).length > 0 ? customizations : undefined,
      });
      onOpenChange(false);
      setName("");
      setTemplateId("");
      setCustomizations({});
    } catch (error) {
      console.error("Failed to create Dockerfile from template:", error);
    }
  };

  const handleCustomizationChange = (key: string, value: string) => {
    setCustomizations((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Dockerfile from Template</DialogTitle>
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
            <Label htmlFor="template">Template</Label>
            <Select value={templateId} onValueChange={setTemplateId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates &&
                  Object.entries(templates).map(([id, info]) => (
                    <SelectItem key={id} value={id}>
                      {info.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {templateId && templates?.[templateId]?.description && (
            <div className="text-sm text-gray-500">
              {templates[templateId].description}
            </div>
          )}
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

export default TemplateDialog;
