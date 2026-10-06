import { readdir, stat, statfs } from "node:fs/promises";
import path from "node:path";
import { isImage, isVideo } from "./storage";
import type { StorageEntity, StorageInfo } from "./types";

const MAX_CONCURRENT_STATS = 5;

function toStoragePath(filePath: string) {
  return path.sep === "\\" ? filePath.replaceAll("\\", "/") : filePath;
}

export async function getPathEntries(
  directoryPath: string,
): Promise<StorageEntity[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const result: StorageEntity[] = new Array(entries.length);
  let nextIndex = 0;

  async function collectEntries() {
    while (nextIndex < entries.length) {
      const index = nextIndex++;
      const entry = entries[index];
      if (!entry.isDirectory() && !entry.isFile() && !entry.isSymbolicLink()) {
        continue;
      }

      const entryPath = path.join(directoryPath, entry.name);
      const details = await stat(entryPath);

      if (!details.isDirectory() && !details.isFile()) {
        continue;
      }

      const entity: StorageEntity = {
        id: toStoragePath(entryPath),
        type: details.isDirectory()
          ? "folder"
          : isImage({ id: entry.name, type: "file" })
            ? "image"
            : isVideo({ id: entry.name, type: "file" })
              ? "video"
              : "file",
        modified: details.mtime.toISOString(),
      };

      if (details.isFile()) {
        entity.size = details.size;
      }

      result[index] = entity;
    }
  }

  const workerCount = Math.min(entries.length, MAX_CONCURRENT_STATS);
  await Promise.all(
    Array.from({ length: workerCount }, () => collectEntries()),
  );

  return result.filter((entry) => entry !== undefined);
}

export async function getStorageInfo(
  directoryPath: string,
): Promise<StorageInfo> {
  const stats = await statfs(directoryPath);
  const total = stats.blocks * stats.bsize;
  const used = (stats.blocks - stats.bfree) * stats.bsize;

  return {
    free: stats.bavail * stats.bsize,
    used,
    total,
  };
}
