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
import { Download, Trash2, Plus } from "react-feather";
import useDocker from "@/hooks/use-docker";
import { formatDistanceToNow } from "date-fns";

import PullImageDialog from "./pull-image-dialog";
import BuildImageDialog from "./build-image-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = () => {
  return (
    <div className="space-y-6 p-6 rounded-lg bg-card">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="w-[30%]">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="w-[25%]">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="w-[15%] text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  onPullClick: () => void;
  onBuildClick: () => void;
}

const EmptyState = ({ onPullClick, onBuildClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 rounded-lg bg-card">
      <div className="p-4 rounded-full bg-muted">
        <Download className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">No Docker Images</h3>
        <p className="text-sm text-muted-foreground">
          Pull or build your first Docker image to get started
        </p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          onClick={onPullClick}
          className="bg-primary hover:bg-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Pull Image
        </Button>
        <Button
          onClick={onBuildClick}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Build Image
        </Button>
      </div>
    </div>
  );
};

const DockerImageTable = () => {
  const [isPullDialogOpen, setIsPullDialogOpen] = useState(false);
  const [isBuildDialogOpen, setIsBuildDialogOpen] = useState(false);
  const { images, isImagesLoading, deleteImage } = useDocker();

  if (isImagesLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6 p-6 rounded-lg bg-card">
      {images?.length === 0 ? (
        <EmptyState
          onPullClick={() => setIsPullDialogOpen(true)}
          onBuildClick={() => setIsBuildDialogOpen(true)}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Docker Images
              </h2>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsPullDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Pull Image
              </Button>
              <Button
                onClick={() => setIsBuildDialogOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Build Image
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="w-[30%]">Tag</TableHead>
                  <TableHead className="w-[30%]">Dockerfile</TableHead>
                  <TableHead className="w-[25%]">Created</TableHead>
                  <TableHead className="w-[15%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images?.map((image) => (
                  <TableRow
                    key={image.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{image.tag}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {image.dockerfile_id || "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(image.created_at), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteImage(image.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <PullImageDialog
        open={isPullDialogOpen}
        onOpenChange={setIsPullDialogOpen}
      />
      <BuildImageDialog
        open={isBuildDialogOpen}
        onOpenChange={setIsBuildDialogOpen}
      />
    </div>
  );
};

export default DockerImageTable;
