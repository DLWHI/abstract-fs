import type { StorageEntity } from "../lib/types";
import { isFolder, itemName, formatSize, typeOf } from "../lib/util";
import { ItemIcon } from "./item-icon";
import { getLabel, type LabelProvider, type Labels } from "../i18n/types";
import "./file-list.css";

export type ItemSelectEventHandler = (item: StorageEntity) => void;
export type ItemOpenEventHandler = (item: StorageEntity) => void;

export function FileList({
  items,
  selected,
  onSelect,
  onFileOpen,
  onFolderOpen,
  labels,
  t,
}: {
  items: StorageEntity[];
  selected: StorageEntity | null;
  onSelect: ItemSelectEventHandler;
  onFileOpen?: ItemOpenEventHandler;
  onFolderOpen: ItemOpenEventHandler;
  labels?: Partial<Labels>;
  t?: LabelProvider;
}) {
  return (
    <div className="rfe-file-list-container">
      <div className="rfe-file-list-content">
        <FileListHeader labels={labels} t={t} />
        <div className="rfe-file-table-body">
          {items.map((item) => (
            <FileListRow
              key={item.id}
              item={item}
              onSelect={onSelect}
              onFileOpen={onFileOpen}
              onFolderOpen={onFolderOpen}
              selected={selected ? item.id == selected.id : false}
            />
          ))}
          {!items.length && (
            <div className="rfe-file-table-placeholder">
              <span className="rfe-file-table-placeholder-text">
                {getLabel("empty", labels, t)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FileListHeader({
  labels,
  t,
}: {
  labels?: Partial<Labels>;
  t?: LabelProvider;
}) {
  return (
    <div className="rfe-file-table-list rfe-file-table-header">
      <div />
      <span>{getLabel("name", labels, t)}</span>
      <span>{getLabel("type", labels, t)}</span>
      <span>{getLabel("modified", labels, t)}</span>
    </div>
  );
}

function FileListRow({
  item,
  selected,
  onSelect,
  onFileOpen,
  onFolderOpen,
  labels,
  t,
}: {
  item: StorageEntity;
  selected: boolean;
  onSelect: (item: StorageEntity) => void;
  onFileOpen?: ItemOpenEventHandler;
  onFolderOpen: ItemOpenEventHandler;
  labels?: Partial<Labels>;
  t?: LabelProvider;
}) {
  const folder = isFolder(item);
  return (
    <button
      key={item.id}
      type="button"
      onClick={(e) => {
        onSelect(item);
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (folder) {
            onFolderOpen(item);
          } else if (onFileOpen) {
            onFileOpen(item);
          }
        }
      }}
      onDoubleClick={() => {
        if (folder) {
          onFolderOpen(item);
        } else if (onFileOpen) {
          onFileOpen(item);
        }
      }}
      className={`rfe-file-table-list rfe-animated rfe-file-table-element ${selected ? "rfe-file-table-selected" : "rfe-file-table-element-selectable"}`}
    >
      <ItemIcon item={item} width={32} height={32} aria-hidden="true" />
      <span className="rfe-file-table-filename">{itemName(item)}</span>
      <span className="rfe-file-table-text">
        {getLabel(typeOf(item), labels, t)}
      </span>
      <span className="rfe-file-table-text">
        {item.modified
          ? new Date(item.modified).toLocaleString()
          : formatSize(item.size)}
      </span>
    </button>
  );
}
