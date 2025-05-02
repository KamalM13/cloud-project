import DiskTable from "@/components/disk/disk-table";
import VmTable from "@/components/vms/vm-table";

const mockVMs = [
  {
    id: "0e0d6143-d0ba-4de8-ae5b-94f8020862e8",
    created_at: "2025-05-02T20:45:39.690429",
    updated_at: "2025-05-02T20:45:39.690429",
    name: "test vm",
    cpu_cores: 1,
    memory_size: 1024,
    disk_id: "4de66036-a774-4bd7-a053-36071f255c71",
    status: "stopped",
    ip_address: null,
  },
  {
    id: "1f1e7254-e1cb-5ef9-bf6c-05f9131973f9",
    created_at: "2025-05-01T18:22:15.789012",
    updated_at: "2025-05-02T09:15:33.456789",
    name: "web server",
    cpu_cores: 2,
    memory_size: 2048,
    disk_id: "5fe77147-b885-5ce8-b164-47082f366c82",
    status: "running",
    ip_address: "192.168.1.100",
  },
];

const HomePage = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <div>
        <DiskTable />
      </div>
      <div>
        <VmTable />
      </div>
    </div>
  );
};

export default HomePage;
