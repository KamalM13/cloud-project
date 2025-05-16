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
import { FileText, Plus, Trash2, Folder } from "react-feather";
import useDocker from "@/hooks/use-docker";
import { formatDistanceToNow } from "date-fns";
import CreateDockerfileDialog from "./create-dockerfile-dialog";
import TemplateDialog from "./template-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import DockerfileDetailsDialog from "./dockerfile-details-dialog";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center p-2 pr-4">
      <Skeleton className="h-8 w-32" />
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {[...Array(5)].map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(5)].map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

interface EmptyStateProps {
  onTemplateClick: () => void;
  onCreateClick: () => void;
}

const EmptyState = ({ onTemplateClick, onCreateClick }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <Folder className="w-12 h-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold mb-2">No Dockerfiles Found</h3>
    <p className="text-muted-foreground mb-6">
      Get started by creating a new Dockerfile or using a template
    </p>
    <div className="flex space-x-4">
      <Button
        onClick={() => {
          onTemplateClick();
        }}
      >
        <FileText className="w-4 h-4 mr-2" />
        From Template
      </Button>
      <Button
        onClick={() => {
          onCreateClick();
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        New Dockerfile
      </Button>
    </div>
  </div>
);

const DockerfileTable = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedDockerfileId, setSelectedDockerfileId] = useState<
    string | null
  >(null);
  const { dockerfiles, isDockerfilesLoading, deleteDockerfile } = useDocker();

  const handleNameClick = (dockerfileId: string) => {
    setSelectedDockerfileId(dockerfileId);
    setIsDetailsDialogOpen(true);
  };

  if (isDockerfilesLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {dockerfiles?.length === 0 ? (
        <EmptyState
          onTemplateClick={() => setIsTemplateDialogOpen(true)}
          onCreateClick={() => setIsCreateDialogOpen(true)}
        />
      ) : (
        <div>
          <div className="flex justify-between items-center p-2 pr-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Dockerfiles
            </h2>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsTemplateDialogOpen(true)}
                variant="outline"
                className="hover:bg-accent"
              >
                <FileText className="w-4 h-4 mr-2" />
                From Template
              </Button>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Dockerfile
              </Button>
            </div>
          </div>

          <div className="rounded-md bg-card p-2">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Path</TableHead>
                  <TableHead className="font-medium">Created</TableHead>
                  <TableHead className="font-medium">Updated</TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dockerfiles?.map((dockerfile) => (
                  <TableRow
                    key={dockerfile.id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <TableCell className="text-sm max-w-[100px] truncate font-medium">
                      <button
                        onClick={() => {
                          handleNameClick(dockerfile.id);
                          console.log(dockerfile.id);
                        }}
                        className="hover:underline text-left"
                      >
                        {dockerfile.name}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm max-w-[100px] truncate text-muted-foreground">
                      {dockerfile.path}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(dockerfile.created_at), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(dockerfile.updated_at), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            deleteDockerfile(dockerfile.id);
                          }}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <CreateDockerfileDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
      />
      <DockerfileDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        dockerfileId={selectedDockerfileId}
      />
    </div>
  );
};

export default DockerfileTable;
