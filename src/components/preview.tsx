"use client";

import TrashBin from "@/components/svg/trash-bin.svg";
import { useTransition } from "react";
import { StorageEntity } from "@/lib/model";
import { itemName, formatSize, typeOf } from "@/lib/storage";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Spinner } from "@/components/ui";

export type SourceURLProvider = (item: StorageEntity) => string;
export type PreviewURLProvider = (item: StorageEntity) => string;

export type DeleteEventHandler = (item: StorageEntity) => Promise<void> | void;

export function Preview({
  item,
  source,
  preview,
  onDelete,
}: {
  item: StorageEntity | null;
  source?: SourceURLProvider;
  preview?: PreviewURLProvider;
  onDelete?: DeleteEventHandler;
}) {
  const t = useTranslations("storage");
  const [loading, startTransition] = useTransition();

  if (loading) {
    return (
      <aside className="h-full min-h-0 overflow-hidden p-4">
        <div className="flex flex-col size-full items-center justify-center gap-4">
          <div className="h-1/5">
            <Spinner />
          </div>
          <span className="text-center text-on-foreground">{t("loading")}</span>
        </div>
      </aside>
    );
  }
  if (!item) {
    return (
      <aside className="h-full min-h-0 overflow-hidden p-4">
        <div className="flex size-full items-center justify-center rounded-lg border border-dashed border-secondary ">
          <span className="text-center text-sm text-secondary">
            {t("preview")}
          </span>
        </div>
      </aside>
    );
  }

  const type = typeOf(item);
  const url = source ? source(item) : null;

  const download = () => {
    startTransition(async () => {
      if (!url) return;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = itemName(item);
      link.click();
      URL.revokeObjectURL(link.href);
    });
  };

  return (
    <aside className="flex min-h-0 min-w-0 h-full flex-col overflow-hidden rounded border border-secondary bg-foreground gap-2 p-4">
      <div className="flex items-center justify-between">
        <h2 className="break-words text-lg font-semibold truncate">
          {itemName(item)}
        </h2>
        {onDelete && (
          <button
            className="button rounded p-2"
            onClick={() => startTransition(async () => await onDelete(item))}
          >
            <TrashBin className="text-on-foreground size-6" />
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {preview && type == "image" && (
          <div className="relative h-3/5 min-h-0 min-w-0 overflow-hidden rounded">
            <img
              src={preview(item)}
              alt={itemName(item)}
              className="absolute inset-0 size-full object-contain"
            />
          </div>
        )}

        {preview && type == "video" && (
          <video
            src={preview(item)}
            controls
            className="h-3/5 min-h-0 min-w-0 overflow-hidden rounded"
          />
        )}

        {url && type != "folder" && (
          <div className="flex flex-wrap gap-2">
            <Link
              className="button rounded px-4 py-2 text-sm"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              {t("open")}
            </Link>
            <button
              type="button"
              className="button rounded px-4 py-2 text-sm"
              onClick={download}
            >
              {t("download")}
            </button>
          </div>
        )}

        <dl className="min-h-0 grid grid-cols-2 grid-rows-2 gap-2 text-sm">
          <div>
            <dt className="text-secondary line-clamp-2">{t("path")}</dt>
            <dd className="break-all">{item.id}</dd>
          </div>
          <div>
            <dt className="text-secondary">{t("type")}</dt>
            <dd>{t(type)}</dd>
          </div>
          <div>
            <dt className="text-secondary">{t("size")}</dt>
            <dd>{formatSize(item.size)}</dd>
          </div>
          {item.modified && (
            <div>
              <dt className="text-secondary">{t("modified")}</dt>
              <dd>{new Date(item.modified).toLocaleString()}</dd>
            </div>
          )}
        </dl>
      </div>
    </aside>
  );
}
