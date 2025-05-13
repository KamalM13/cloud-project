import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2 } from "react-feather";
import useDocker from "@/hooks/use-docker";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import CreateDockerfileDialog from "./create-dockerfile-dialog";
import TemplateDialog from "./template-dialog";

const DockerfileTable = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const { dockerfiles, isDockerfilesLoading } = useDocker();

  if (isDockerfilesLoading) {
    return <div>Loading Dockerfiles...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2 pr-4">
        <h2 className="text-lg font-semibold">Dockerfiles</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setIsTemplateDialogOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            From Template
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Dockerfile
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dockerfiles?.map((dockerfile) => (
            <TableRow key={dockerfile.id}>
              <TableCell className="text-sm max-w-[100px] truncate">
                {dockerfile.name}
              </TableCell>
              <TableCell className="text-sm max-w-[100px] truncate">
                {dockerfile.path}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(dockerfile.created_at), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(dockerfile.updated_at), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement Dockerfile deletion
                      toast.info("Dockerfile deletion coming soon!");
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateDockerfileDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
      />
    </div>
  );
};

export default DockerfileTable;
