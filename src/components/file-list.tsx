import type { StorageEntity } from "../lib/types";
import { isFolder, itemName, formatSize, typeOf } from "../lib/storage";
import { ItemIcon } from "./item-icon";
import "./file-list.css";

export type ItemSelectEventHandler = (item: StorageEntity) => void;
export type ItemOpenEventHandler = (item: StorageEntity) => void;

export function FileList({
  items,
  selected,
  onSelect,
  onFileOpen,
  onFolderOpen,
}: {
  items: StorageEntity[];
  selected: StorageEntity | null;
  onSelect: ItemSelectEventHandler;
  onFileOpen?: ItemOpenEventHandler;
  onFolderOpen: ItemOpenEventHandler;
}) {
  const sorted = [...items].sort(
    (a, b) =>
      Number(isFolder(b)) - Number(isFolder(a)) ||
      itemName(a).localeCompare(itemName(b)),
  );

  return (
    <div className="afs-file-list-container">
      <div className="afs-file-list-content">
        <FileListHeader />
        <div className="afs-file-table-body">
          {sorted.map((item) => (
            <FileListRow
              key={item.id}
              item={item}
              onSelect={onSelect}
              onFileOpen={onFileOpen}
              onFolderOpen={onFolderOpen}
              selected={item.id == selected?.id}
            />
          ))}
          {!sorted.length && (
            <div className="afs-file-table-body-placeholder">
              <span className="afs-file-table-placeholder-text">empty</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FileListHeader() {
  return (
    <div className="afs-file-table-list afs-file-table-header">
      <span>name</span>
      <span>type</span>
      <span>modified</span>
    </div>
  );
}

export function FileListRow({
  item,
  selected,
  onSelect,
  onFileOpen,
  onFolderOpen,
}: {
  item: StorageEntity;
  selected: boolean;
  onSelect: (item: StorageEntity) => void;
  onFileOpen?: ItemOpenEventHandler;
  onFolderOpen: ItemOpenEventHandler;
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
      onDoubleClick={() => (folder ? onFolderOpen(item) : onFileOpen?.(item))}
      className={`afs-file-table-list afs-file-table-element ${selected ? "afs-file-table-selected" : "afs-file-table-element-selectable"}`}
    >
      <ItemIcon item={item} width={32} height={32} aria-hidden="true" />
      <span className="afs-file-table-filename">{itemName(item)}</span>
      <span className="afs-file-table-text">{typeOf(item)}</span>
      <span className="afs-file-table-text">
        {item.modified
          ? new Date(item.modified).toLocaleString()
          : formatSize(item.size)}
      </span>
    </button>
  );
}
