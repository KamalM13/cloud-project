export interface Disk {
  id: string;
  name: string;
  size: string;
  format: string;
  path: string;
  in_use?: boolean; // Optional with a default value handled elsewhere
  created_at?: string; // Optional with a default value handled elsewhere
  updated_at?: string; // Optional with a default value handled elsewhere
  dynamic?: boolean;
}
