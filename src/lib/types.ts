export interface StorageEntity {
  id: string; // path
  type: "folder" | "file" | "image" | "video";
  size?: number;
  modified?: string; // date
}

export interface StorageInfo {
  free: number;
  used: number;
  total: number;
}
