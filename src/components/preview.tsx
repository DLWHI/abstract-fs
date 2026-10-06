import TrashBin from "../assets/trash-bin.svg?react";
import { useTransition } from "react";
import type { StorageEntity } from "../lib/types";
import { itemName, formatSize, typeOf } from "../lib/storage";
import { Spinner } from "./spinner";
import "./preview.css";

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
  const [loading, startTransition] = useTransition();

  if (loading) {
    return (
      <aside className="afs-preview-container">
        <div className="afs-preview-placeholder">
          <div className="afs-preview-loading-container">
            <Spinner />
          </div>
          <span className="afs-preview-placeholder-text">loading</span>
        </div>
      </aside>
    );
  }
  if (!item) {
    return (
      <aside className="afs-preview-container">
        <div className="afs-preview-placeholder-card">
          <span className="afs-preview-placeholder-text">preview</span>
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
    <aside className="afs-preview-container">
      <div className="afs-flex-bar">
        <h2 className="afs-preview-title">{itemName(item)}</h2>
        {onDelete && (
          <button
            className="afs-preview-delete"
            onClick={() => startTransition(async () => await onDelete(item))}
          >
            <TrashBin width={24} height={24} />
          </button>
        )}
      </div>

      <div className="afs-preview-content">
        {preview && type == "image" && (
          <img
            src={preview(item)}
            alt={itemName(item)}
            className="afs-preview"
          />
        )}

        {preview && type == "video" && (
          <video src={preview(item)} controls className="afs-preview" />
        )}

        {url && type != "folder" && (
          <div className="afs-preview-toolbar">
            <a
              className="afs-preview-button"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              open
            </a>
            <button
              type="button"
              className="afs-preview-button"
              onClick={download}
            >
              download
            </button>
          </div>
        )}

        <dl className="afs-preview-info">
          <div>
            <dt className="afs-preview-text-heading">path</dt>
            <dd className="afs-preview-text-break">{item.id}</dd>
          </div>
          <div>
            <dt className="afs-preview-text-heading">type</dt>
            <dd>type</dd>
          </div>
          <div>
            <dt className="afs-preview-text-heading">size</dt>
            <dd>{formatSize(item.size)}</dd>
          </div>
          {item.modified && (
            <div>
              <dt className="afs-preview-text-heading">modified</dt>
              <dd>{new Date(item.modified).toLocaleString()}</dd>
            </div>
          )}
        </dl>
      </div>
    </aside>
  );
}
