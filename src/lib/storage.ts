import { StorageEntity } from "./model";

export function isFolder(item: StorageEntity) {
  return item.type == "folder";
}

export function itemName(item: StorageEntity) {
  return item.id.replace(/\/$/, "").split("/").pop() || item.id;
}

export function parentPath(path: string) {
  return path.split("/").filter(Boolean).slice(0, -1).join("/");
}

export function formatSize(size?: number) {
  if (size == null) return "Size unavailable";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function isImage(item: StorageEntity) {
  return item.type == "image" || /\.(png|jpe?g|gif|webp|avif)$/i.test(item.id);
}

export function isVideo(item: StorageEntity) {
  return item.type == "video" || /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(item.id);
}

export function typeOf(item: StorageEntity) {
  if (item.type == "folder") {
    return "folder";
  } else if (isImage(item)) {
    return "image";
  } else if (isVideo(item)) {
    return "video";
  } else {
    return "file";
  }
}

export function storageFileUrl(id: string) {
  if (id.startsWith("http://") || id.startsWith("https://")) {
    return id
  }
  return `${process.env.NEXT_PUBLIC_ADMIN_BASE_PATH}/api/storage/${id.split("/").map(encodeURIComponent).join("/")}`;
}


export function storagePreviewUrl(id: string) {
  if (id.startsWith("http://") || id.startsWith("https://")) {
    return id
  }
  return `${process.env.NEXT_PUBLIC_ADMIN_BASE_PATH}/api/preview/${id.split("/").map(encodeURIComponent).join("/")}`;
}

export function isFileMedia(candidate: File) {
  return (
    candidate.type.startsWith("image/") || candidate.type.startsWith("video/")
  );
}
