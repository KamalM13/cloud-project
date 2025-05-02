import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Server, HardDrive, Activity, AlertCircle } from "react-feather";

import api from "@/lib/api";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const [stats, setStats] = useState({
    vms: { total: 0, running: 0 },
    disks: { total: 0, available: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Uncomment when API is ready
        // const response = await api.get('/dashboard/stats');
        // setStats(response.data);

        // Mock data for now
        setStats({
          vms: { total: 12, running: 8 },
          disks: { total: 24, available: 15 },
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return <div className="animate-pulse">Loading dashboard data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Server className="w-12 h-12 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total VMs</p>
              <p className="text-2xl font-semibold">{stats.vms.total}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center">
            <Activity className="w-12 h-12 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Running VMs</p>
              <p className="text-2xl font-semibold">{stats.vms.running}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <div className="flex items-center">
            <HardDrive className="w-12 h-12 text-purple-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Disks</p>
              <p className="text-2xl font-semibold">{stats.disks.total}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Available Disks</p>
              <p className="text-2xl font-semibold">{stats.disks.available}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Virtual Machines">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-medium">Name</span>
              <span className="font-medium">Status</span>
            </div>

            {/* Mock data - replace with actual data from API */}
            {[
              { id: 1, name: "web-server-01", status: "running" },
              { id: 2, name: "db-server-01", status: "running" },
              { id: 3, name: "test-vm-01", status: "stopped" },
            ].map((vm) => (
              <div key={vm.id} className="flex justify-between items-center">
                <Link
                  to={`/vms/${vm.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {vm.name}
                </Link>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    vm.status === "running"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {vm.status}
                </span>
              </div>
            ))}

            <div className="pt-4 text-right">
              <Link to="/vms" className="text-blue-600 hover:underline text-sm">
                View all virtual machines →
              </Link>
            </div>
          </div>
        </Card>

        <Card title="Recent Disks">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-medium">Name</span>
              <span className="font-medium">Size</span>
            </div>

            {/* Mock data - replace with actual data from API */}
            {[
              { id: 1, name: "web-server-disk", size: "50 GB" },
              { id: 2, name: "db-server-disk", size: "100 GB" },
              { id: 3, name: "backup-disk", size: "200 GB" },
            ].map((disk) => (
              <div key={disk.id} className="flex justify-between items-center">
                <Link
                  to={`/disks/${disk.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {disk.name}
                </Link>
                <span>{disk.size}</span>
              </div>
            ))}

            <div className="pt-4 text-right">
              <Link
                to="/disks"
                className="text-blue-600 hover:underline text-sm"
              >
                View all disks →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
