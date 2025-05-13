import DiskTable from "@/components/disk/disk-table";
import VmTable from "@/components/vms/vm-table";


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
