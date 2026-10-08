import { getLabel, type LabelProvider, type Labels } from "../i18n/types";
import type { StorageEntity } from "./types";

const UNITS = ["b", "kb", "mb", "gb", "tb", "pb"] as const;

export function isFolder(item: StorageEntity) {
  return item.type == "folder";
}

export function itemName(item: StorageEntity) {
  return item.id.replace(/\/$/, "").split("/").pop() || item.id;
}

export function parentPath(path: string) {
  return path.split("/").filter(Boolean).slice(0, -1).join("/");
}

export function formatSize(
  bytes: number,
  decimals: number = 2,
  labels?: Partial<Labels>,
  t?: LabelProvider,
): string {
  if (bytes === 0) return "0 B";
  if (bytes < 0) return `-${formatSize(Math.abs(bytes), decimals)}`;

  const k = 1024; // Use 1000 for decimal units (e.g. standard macOS / network speed)
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const unitIndex = Math.min(i, UNITS.length - 1);
  const value = bytes / Math.pow(k, unitIndex);

  return `${parseFloat(value.toFixed(decimals))} ${getLabel(UNITS[unitIndex], labels, t)}`;
}

export function isImage(item: StorageEntity) {
  return (
    item.type == "image" || /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(item.id)
  );
}

export function isVideo(item: StorageEntity) {
  return item.type == "video" || /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(item.id);
}

export function typeOf(item: StorageEntity) {
  if (isImage(item)) {
    return "image";
  } else if (isVideo(item)) {
    return "video";
  } else if (item.type == "folder") {
    return "folder";
  } else {
    return "file";
  }
}

export function isFileMedia(candidate: File) {
  return (
    candidate.type.startsWith("image/") || candidate.type.startsWith("video/")
  );
}

export function sortStorageEntities(list: StorageEntity[]) {
  return [...list].sort(
    (a, b) =>
      Number(isFolder(b)) - Number(isFolder(a)) ||
      itemName(a).localeCompare(itemName(b)),
  );
}
