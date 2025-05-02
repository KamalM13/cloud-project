"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "react-feather";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CreateDisk = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    size: 50,
    type: "ssd",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "size" ? Number.parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Uncomment when API is ready
      // await api.post('/disks', formData);

      // Mock success for now
      console.log("Creating disk with data:", formData);
      setTimeout(() => {
        setLoading(false);
        navigate("/disks");
      }, 1000);
    } catch (err) {
      console.error("Failed to create disk:", err);
      setError("Failed to create disk. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/disks")}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Create Disk</h1>
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
                Disk Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., data-disk-01"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Disk Type
              </label>
              <select
                id="type"
                name="type"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="ssd">SSD (Faster, Premium)</option>
                <option value="hdd">HDD (Standard)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Disk Size (GB)
              </label>
              <select
                id="size"
                name="size"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.size}
                onChange={handleChange}
              >
                <option value="10">10 GB</option>
                <option value="20">20 GB</option>
                <option value="50">50 GB</option>
                <option value="100">100 GB</option>
                <option value="200">200 GB</option>
                <option value="500">500 GB</option>
                <option value="1000">1 TB</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/disks")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Disk"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateDisk;
