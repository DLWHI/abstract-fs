import TrashBin from "../assets/trash-bin.svg?react";
import { useTransition } from "react";
import type { StorageEntity } from "../lib/types";
import { itemName, formatSize, typeOf } from "../lib/util";
import { Loading } from "./loading";
import "./preview.css";
import { type Labels, type LabelProvider, getLabel } from "../i18n/types";

export type SourceURLProvider = (item: StorageEntity) => string;
export type PreviewURLProvider = (item: StorageEntity) => string;

export type DeleteEventHandler = (item: StorageEntity) => Promise<void> | void;

export function Preview({
  item,
  source,
  preview,
  onDelete,
  labels,
  t,
}: {
  item: StorageEntity | null;
  source?: SourceURLProvider;
  preview?: PreviewURLProvider;
  onDelete?: DeleteEventHandler;
  labels?: Partial<Labels>;
  t?: LabelProvider;
}) {
  const [loading, startTransition] = useTransition();

  if (loading) {
    return (
      <aside className="rfe-preview-container">
        <Loading label={getLabel("loading", labels, t)} />
      </aside>
    );
  }
  if (!item) {
    return (
      <aside className="rfe-preview-container">
        <div className="rfe-preview-placeholder-card">
          <span className="rfe-preview-placeholder-text">
            {getLabel("preview", labels, t)}
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
    <aside
      className="rfe-preview-container"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="rfe-flex-bar">
        <h2 className="rfe-preview-title">{itemName(item)}</h2>
        {onDelete && (
          <button
            className="rfe-preview-delete rfe-animated"
            onClick={() => startTransition(async () => await onDelete(item))}
          >
            <TrashBin width={24} height={24} />
          </button>
        )}
      </div>

      <div className="rfe-preview-content">
        {preview && type == "image" && (
          <img
            src={preview(item)}
            alt={itemName(item)}
            className="rfe-preview"
          />
        )}

        {preview && type == "video" && (
          <video src={preview(item)} controls className="rfe-preview" />
        )}

        {url && type != "folder" && (
          <div className="rfe-preview-toolbar">
            <a
              className="rfe-preview-button rfe-animated"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              {getLabel("open", labels, t)}
            </a>
            <button
              type="button"
              className="rfe-preview-button rfe-animated"
              onClick={download}
            >
              {getLabel("download", labels, t)}
            </button>
          </div>
        )}

        <dl className="rfe-preview-info">
          <div>
            <dt className="rfe-preview-text-heading">
              {getLabel("path", labels, t)}
            </dt>
            <dd className="rfe-preview-text-break rfe-preview-text">
              {item.id}
            </dd>
          </div>
          <div>
            <dt className="rfe-preview-text-heading">
              {getLabel("type", labels, t)}
            </dt>
            <dd className="rfe-preview-text">{getLabel(type, labels, t)}</dd>
          </div>
          {!(item.size == null) && (
            <div>
              <dt className="rfe-preview-text-heading">
                {getLabel("size", labels, t)}
              </dt>
              <dd className="rfe-preview-text">{formatSize(item.size)}</dd>
            </div>
          )}
          {item.modified && (
            <div>
              <dt className="rfe-preview-text-heading">
                {getLabel("modified", labels, t)}
              </dt>
              <dd className="rfe-preview-text">
                {new Date(item.modified).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </aside>
  );
}
