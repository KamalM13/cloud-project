import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface DockerfileDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dockerfileId: string | null;
}

const DockerfileDetailsDialog = ({
  open,
  onOpenChange,
  dockerfileId,
}: DockerfileDetailsDialogProps) => {
  const { data: dockerfileData, isLoading } = useQuery({
    queryKey: ["dockerfile-details", dockerfileId],
    queryFn: async () => {
      if (!dockerfileId) return null;
      const [contentResponse, detailsResponse] = await Promise.all([
        api.get(`/api/docker/dockerfiles/${dockerfileId}/content`),
        api.get(`/api/docker/dockerfiles/${dockerfileId}`),
      ]);
      return {
        content: contentResponse.data.content,
        details: detailsResponse.data,
      };
    },
    enabled: !!dockerfileId && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Dockerfile Details</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-2/3" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          ) : dockerfileData ? (
            <>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Name
                    </h3>
                    <p className="text-sm">{dockerfileData.details.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      ID
                    </h3>
                    <p className="text-sm font-mono">
                      {dockerfileData.details.id}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Path
                    </h3>
                    <p className="text-sm font-mono break-all">
                      {dockerfileData.details.path}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Created
                    </h3>
                    <p className="text-sm">
                      {formatDistanceToNow(
                        new Date(dockerfileData.details.created_at),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </h3>
                    <p className="text-sm">
                      {formatDistanceToNow(
                        new Date(dockerfileData.details.updated_at),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Content
                </h3>
                <pre className="bg-muted p-4 rounded-md whitespace-pre-wrap overflow-x-auto font-mono text-sm">
                  {dockerfileData.content}
                </pre>
              </div>
            </>
          ) : null}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DockerfileDetailsDialog;
