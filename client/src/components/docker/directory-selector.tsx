import React, { useRef } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FolderOpen } from "lucide-react";

interface DirectorySelectorProps {
  value: string;
  onChange: (path: string) => void;
  label?: string;
  placeholder?: string;
}

export function DirectorySelector({
  value,
  onChange,
  label,
  placeholder,
}: DirectorySelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Get the path of the selected directory
      // Note: Web security prevents getting the full file path,
      // so we're using the directory name as a fallback
      const directory = files[0].webkitRelativePath.split("/")[0];
      onChange(directory);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="flex items-center gap-2"
        >
          <FolderOpen className="h-4 w-4" />
          Browse
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          {...({
            webkitdirectory: "true",
            directory: "",
          } as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      </div>
    </div>
  );
}
