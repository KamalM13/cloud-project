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
import { Loader2, Plus, Trash2 } from "lucide-react";

interface CreateContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EnvVar {
  key: string;
  value: string;
}

interface PortMapping {
  hostPort: string;
  containerPort: string;
}

const CreateContainerDialog = ({
  open,
  onOpenChange,
}: CreateContainerDialogProps) => {
  const { createContainer, createContainerMutation, images } = useDocker();
  const [selectedImage, setSelectedImage] = useState("");
  const [containerName, setContainerName] = useState("");
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [portMappings, setPortMappings] = useState<PortMapping[]>([]);

  const handleCreateContainer = async () => {
    try {
      // Convert envVars array to object
      const environment = envVars.reduce((acc, { key, value }) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      // Convert port mappings array to object
      const ports = portMappings.reduce((acc, { hostPort, containerPort }) => {
        if (hostPort && containerPort) {
          acc[hostPort] = containerPort;
        }
        return acc;
      }, {} as Record<string, string>);

      await createContainer({
        image_id: selectedImage,
        name: containerName || undefined,
        environment:
          Object.keys(environment).length > 0 ? environment : undefined,
        ports: Object.keys(ports).length > 0 ? ports : undefined,
      });
      onOpenChange(false);
      setSelectedImage("");
      setContainerName("");
      setEnvVars([]);
      setPortMappings([]);
    } catch (error) {
      console.error("Failed to create container:", error);
    }
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const updateEnvVar = (index: number, field: keyof EnvVar, value: string) => {
    const newEnvVars = [...envVars];
    newEnvVars[index] = { ...newEnvVars[index], [field]: value };
    setEnvVars(newEnvVars);
  };

  const addPortMapping = () => {
    setPortMappings([...portMappings, { hostPort: "", containerPort: "" }]);
  };

  const removePortMapping = (index: number) => {
    setPortMappings(portMappings.filter((_, i) => i !== index));
  };

  const updatePortMapping = (
    index: number,
    field: keyof PortMapping,
    value: string
  ) => {
    const newPortMappings = [...portMappings];
    newPortMappings[index] = { ...newPortMappings[index], [field]: value };
    setPortMappings(newPortMappings);
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
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Port Mappings</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPortMapping}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Port
              </Button>
            </div>
            <div className="space-y-2">
              {portMappings.map((port, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Host Port"
                      value={port.hostPort}
                      onChange={(e) =>
                        updatePortMapping(index, "hostPort", e.target.value)
                      }
                      type="number"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Container Port"
                      value={port.containerPort}
                      onChange={(e) =>
                        updatePortMapping(
                          index,
                          "containerPort",
                          e.target.value
                        )
                      }
                      type="number"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePortMapping(index)}
                    className="h-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Environment Variables</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEnvVar}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Variable
              </Button>
            </div>
            <div className="space-y-2">
              {envVars.map((envVar, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Key"
                      value={envVar.key}
                      onChange={(e) =>
                        updateEnvVar(index, "key", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Value"
                      value={envVar.value}
                      onChange={(e) =>
                        updateEnvVar(index, "value", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEnvVar(index)}
                    className="h-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateContainer}
            disabled={!selectedImage || createContainerMutation.isPending}
          >
            {createContainerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Container"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContainerDialog;
