import CreateDiskDialog from "@/components/disk/create-disk";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDisks from "@/hooks/use-disk";
import { HardDrive, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useState } from "react";

const DiskTable = () => {
  const { disks, isDisksLoading, isDisksError, deleteDisk } = useDisks();
  const [isCreateDiskOpen, setIsCreateDiskOpen] = useState(false);

  if (isDisksLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Disks</CardTitle>
            <CardDescription>Manage your storage disks</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 text-center">
          <HardDrive className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Loading disks...</h3>
        </CardContent>
      </Card>
    );
  }

  if (isDisksError) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Disks</CardTitle>
            <CardDescription>Manage your storage disks</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 text-center">
          <HardDrive className="h-12 w-12 text-red-600" />
          <h3 className="mt-4 text-lg font-semibold">Error loading disks</h3>
        </CardContent>
      </Card>
    );
  }

  if (!disks) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Disks</CardTitle>
            <CardDescription>Manage your storage disks</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 text-center">
          <HardDrive className="h-12 w-12 text-red-600" />
          <h3 className="mt-4 text-lg font-semibold">No disks found</h3>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Disks</CardTitle>
            <CardDescription>Manage your storage disks</CardDescription>
          </div>
          <div>
            <Button variant="outline" onClick={() => setIsCreateDiskOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Disk
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {disks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disks.map((disk) => (
                  <TableRow key={disk.id}>
                    <TableCell className="font-medium">{disk.name}</TableCell>
                    <TableCell>{disk.size}</TableCell>
                    <TableCell>{disk.format}</TableCell>
                    <TableCell>
                      {disk.in_use ? (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          In Use
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Available
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            disabled={disk.in_use}
                            className="text-red-600"
                            onClick={() => {
                              deleteDisk(disk.id);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <HardDrive className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No disks found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You haven't created any disks yet. Create one to get started.
              </p>
              <Button onClick={() => setIsCreateDiskOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Disk
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <CreateDiskDialog
        open={isCreateDiskOpen}
        onOpenChange={setIsCreateDiskOpen}
      />
    </>
  );
};

export default DiskTable;
