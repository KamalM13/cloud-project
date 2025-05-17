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
import CreateVmDialog from "@/components/vms/create-vm";
import EditVmDialog from "@/components/vms/edit-vm";
import useDisks from "@/hooks/use-disk";
import useVms from "@/hooks/use-vms";
import {
  MoreHorizontal,
  Play,
  Plus,
  Server,
  Square,
  Trash,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { VM } from "@/types/vm";

const TableSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Virtual Machines</CardTitle>
          <CardDescription>Manage your virtual machines</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>CPU</TableHead>
              <TableHead>Memory</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-hidden">
            {[...Array(3)].map((_, index) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const VmTable = () => {
  const { vms, isLoadingVms, deleteVm, startVm, stopVm } = useVms();
  const { disks } = useDisks();
  const [isCreateVMOpen, setIsCreateVMOpen] = useState(false);
  const [editingVm, setEditingVm] = useState<VM | null>(null);

  if (isLoadingVms) {
    return <TableSkeleton />;
  }

  if (!vms) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">
              Virtual Machines
            </CardTitle>
            <CardDescription>Manage your virtual machines</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 text-center">
          <h3 className="mt-4 text-lg font-semibold">No VMs found</h3>
        </CardContent>
      </Card>
    );
  }

  if (!disks) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">
              Virtual Machines
            </CardTitle>
            <CardDescription>Manage your virtual machines</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 text-center">
          <h3 className="mt-4 text-lg font-semibold">No disks found</h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <CreateVmDialog open={isCreateVMOpen} onOpenChange={setIsCreateVMOpen} />
      {editingVm && (
        <EditVmDialog
          open={!!editingVm}
          onOpenChange={(open) => !open && setEditingVm(null)}
          vm={editingVm}
        />
      )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="w-full">
            <CardTitle className="text-xl font-bold flex justify-between w-full">
              Virtual Machines
              <Button
                onClick={() => setIsCreateVMOpen(true)}
                variant={"outline"}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create VM
              </Button>
            </CardTitle>
            <CardDescription>Manage your virtual machines</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {vms.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>Memory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vms.map((vm) => (
                  <TableRow key={vm.id}>
                    <TableCell className="font-medium">{vm.name}</TableCell>
                    <TableCell>
                      {vm.cpu_cores} {vm.cpu_cores === 1 ? "core" : "cores"}
                    </TableCell>
                    <TableCell>{vm.memory_size} MB</TableCell>
                    <TableCell>
                      {vm.status === "running" ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Running
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          Stopped
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{vm.ip_address || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {vm.status === "stopped" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startVm(vm.id)}
                          >
                            <Play className="h-4 w-4" />
                            <span className="sr-only">Start</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => stopVm(vm.id)}
                          >
                            <Square className="h-4 w-4" />
                            <span className="sr-only">Stop</span>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditingVm(vm)}
                              disabled={vm.status === "running"}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteVm(vm.id)}
                              disabled={vm.status === "running"}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Server className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No virtual machines found
              </h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You haven't created any VMs yet. Create one to get started.
              </p>
              <Button onClick={() => setIsCreateVMOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create VM
              </Button>
              {disks.filter((disk) => !disk.in_use).length === 0 &&
                disks.length === 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    You need to create a disk first before creating a VM.
                  </p>
                )}
              {disks.filter((disk) => !disk.in_use).length === 0 &&
                disks.length > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    All disks are in use. Create a new disk to create a VM.
                  </p>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default VmTable;
