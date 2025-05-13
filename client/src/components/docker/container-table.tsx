import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Play, Square, Plus } from "react-feather";
import useDocker from "@/hooks/use-docker";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import CreateContainerDialog from "./create-container-dialog";

const DockerContainerTable = () => {
  const { containers, isContainersLoading, runContainer, stopContainer } =
    useDocker();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleStopContainer = async (containerId: string) => {
    try {
      await stopContainer(containerId);
    } catch (error) {
      console.error("Failed to stop container:", error);
    }
  };

  if (isContainersLoading) {
    return <div>Loading containers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2">
        <h2 className="text-lg font-semibold">Docker Containers</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Container
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {containers?.map((container) => (
            <TableRow key={container.id}>
              <TableCell>{container.name}</TableCell>
              <TableCell>{container.image}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    container.status.startsWith("Exited")
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {container.status}
                </span>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(container.created_at), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {container.status.startsWith("Exited") ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        runContainer({ image_id: container.image })
                      }
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStopContainer(container.id)}
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateContainerDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default DockerContainerTable;
