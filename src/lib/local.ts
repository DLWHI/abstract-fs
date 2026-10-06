import { readdir, stat, statfs } from "node:fs/promises";
import path from "node:path";
import { isImage, isVideo } from "./storage";
import type { StorageEntity, StorageInfo } from "./types";

export class LocalStorageProvider {
  maxStats = 5;
  readonly root: string;

  constructor(root: string, maxStats?: number) {
    this.root = path.resolve(root);
    if (maxStats) {
      this.maxStats = maxStats;
    }
  }

  private resolvePath(relativePath: string) {
    const normalizedPath = relativePath
      .replace(/^[\\/]+/, "")
      .replace(/[\\/]+/g, path.sep);
    const resolvedPath = path.resolve(this.root, normalizedPath);
    const fromRoot = path.relative(this.root, resolvedPath);

    if (
      fromRoot === ".." ||
      fromRoot.startsWith(`..${path.sep}`) ||
      path.isAbsolute(fromRoot)
    ) {
      throw new RangeError(`Path is outside the storage root: ${relativePath}`);
    }

    return resolvedPath;
  }

  private toStoragePath(filePath: string) {
    const relativePath = path.relative(this.root, filePath);
    const storagePath = relativePath.split(path.sep).join("/");
    return storagePath ? `/${storagePath}` : "/";
  }

  public async getPathEntries(
    directoryPath: string = "/",
  ): Promise<StorageEntity[]> {
    const absoluteDirectoryPath = this.resolvePath(directoryPath);
    const entries = await readdir(absoluteDirectoryPath, {
      withFileTypes: true,
    });
    const result: StorageEntity[] = new Array(entries.length);
    let nextIndex = 0;
    const provider = this;

    async function collectEntries() {
      while (nextIndex < entries.length) {
        const index = nextIndex++;
        const entry = entries[index];
        if (
          !entry.isDirectory() &&
          !entry.isFile() &&
          !entry.isSymbolicLink()
        ) {
          continue;
        }

        const entryPath = path.join(absoluteDirectoryPath, entry.name);
        const details = await stat(entryPath);

        if (!details.isDirectory() && !details.isFile()) {
          continue;
        }

        const entity: StorageEntity = {
          id: provider.toStoragePath(entryPath),
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

    const workerCount = Math.min(entries.length, provider.maxStats);
    await Promise.all(
      Array.from({ length: workerCount }, () => collectEntries()),
    );

    return result.filter((entry) => entry !== undefined);
  }

  public async getStorageInfo(): Promise<StorageInfo> {
    const stats = await statfs(this.root);
    const total = stats.blocks * stats.bsize;
    const used = (stats.blocks - stats.bfree) * stats.bsize;

    return {
      free: stats.bavail * stats.bsize,
      used,
      total,
    };
  }
}
