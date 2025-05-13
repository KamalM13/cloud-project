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
import { toast } from "sonner";
import PullImageDialog from "./pull-image-dialog";
import BuildImageDialog from "./build-image-dialog";

const DockerImageTable = () => {
  const [isPullDialogOpen, setIsPullDialogOpen] = useState(false);
  const [isBuildDialogOpen, setIsBuildDialogOpen] = useState(false);
  const { images, isImagesLoading } = useDocker();

  if (isImagesLoading) {
    return <div>Loading images...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Docker Images</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setIsPullDialogOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Pull Image
          </Button>
          <Button onClick={() => setIsBuildDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Build Image
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tag</TableHead>
            <TableHead>Dockerfile</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {images?.map((image) => (
            <TableRow key={image.id}>
              <TableCell>{image.tag}</TableCell>
              <TableCell>{image.dockerfile_id || "N/A"}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(image.created_at), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement image deletion
                      toast.info("Image deletion coming soon!");
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
