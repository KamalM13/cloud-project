import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Play, Square, Plus, Download, Trash } from "react-feather";
import useDocker from "@/hooks/use-docker";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import CreateContainerDialog from "./create-container-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TableSkeleton = () => {
  return (
    <div className="space-y-6 p-6 rounded-lg bg-card border dark:border-gray-800">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 rounded-lg bg-card ">
      <div className="p-4 rounded-full bg-muted">
        <Download className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">No Docker Containers</h3>
        <p className="text-sm text-muted-foreground">
          Start by creating or running a container to get started.
        </p>
      </div>
    </div>
  );
};

const DockerContainerTable = () => {
  const {
    containers,
    isContainersLoading,
    startContainer,
    stopContainer,
    deleteContainer,
  } = useDocker();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleStopContainer = async (containerId: string) => {
    try {
      await stopContainer(containerId);
    } catch (error) {
      console.error("Failed to stop container:", error);
    }
  };

  if (isContainersLoading) {
    return <TableSkeleton />;
  }

  return (
    <Card className="border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Docker Containers
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your Docker containers
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Container
        </Button>
      </CardHeader>

      {containers?.length === 0 ? (
        <EmptyState />
      ) : (
        <CardContent>
          <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Image</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers?.map((container) => (
                  <TableRow
                    key={container.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {container.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {container.image}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          container.status.startsWith("Exited")
                            ? "bg-destructive/10 text-destructive dark:bg-destructive/20"
                            : "bg-success/10 text-success dark:bg-success/20"
                        }`}
                      >
                        {container.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(container.created_at), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {container.status.startsWith("Exited") ? (
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startContainer(container.id)}
                              className="hover:bg-success/10 hover:text-success hover:border-success/20 dark:hover:bg-success/20"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteContainer(container.id)}
                              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 dark:hover:bg-destructive/20"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStopContainer(container.id)}
                            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 dark:hover:bg-destructive/20"
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
          </div>
        </CardContent>
      )}

      <CreateContainerDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </Card>
  );
};

export default DockerContainerTable;
