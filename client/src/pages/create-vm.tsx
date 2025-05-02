"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "react-feather";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CreateVM = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    cpu: 1,
    memory: 1,
    disk: 10,
    image: "ubuntu-20.04",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cpu" || name === "memory" || name === "disk"
          ? Number.parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Uncomment when API is ready
      // await api.post('/vms', formData);

      // Mock success for now
      console.log("Creating VM with data:", formData);
      setTimeout(() => {
        setLoading(false);
        navigate("/vms");
      }, 1000);
    } catch (err) {
      console.error("Failed to create VM:", err);
      setError("Failed to create virtual machine. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/vms")}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Create Virtual Machine</h1>
      </div>

      <Card>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                VM Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., web-server-01"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Operating System
              </label>
              <select
                id="image"
                name="image"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.image}
                onChange={handleChange}
              >
                <option value="ubuntu-20.04">Ubuntu 20.04</option>
                <option value="ubuntu-22.04">Ubuntu 22.04</option>
                <option value="debian-11">Debian 11</option>
                <option value="centos-7">CentOS 7</option>
                <option value="windows-server-2019">Windows Server 2019</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="cpu"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CPU Cores
              </label>
              <select
                id="cpu"
                name="cpu"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.cpu}
                onChange={handleChange}
              >
                <option value="1">1 vCPU</option>
                <option value="2">2 vCPUs</option>
                <option value="4">4 vCPUs</option>
                <option value="8">8 vCPUs</option>
                <option value="16">16 vCPUs</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="memory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Memory (GB)
              </label>
              <select
                id="memory"
                name="memory"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.memory}
                onChange={handleChange}
              >
                <option value="1">1 GB</option>
                <option value="2">2 GB</option>
                <option value="4">4 GB</option>
                <option value="8">8 GB</option>
                <option value="16">16 GB</option>
                <option value="32">32 GB</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="disk"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Disk Size (GB)
              </label>
              <select
                id="disk"
                name="disk"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.disk}
                onChange={handleChange}
              >
                <option value="10">10 GB</option>
                <option value="20">20 GB</option>
                <option value="50">50 GB</option>
                <option value="100">100 GB</option>
                <option value="200">200 GB</option>
                <option value="500">500 GB</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/vms")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create VM"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateVM;
