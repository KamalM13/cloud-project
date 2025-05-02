export interface VM {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  cpu_cores: number;
  memory_size: number;
  disk_id: string;
  status: string;
  ip_address: string | null;
}
