"use client";

import { StorageEntity } from "@/lib/model";
import { isFolder, itemName, formatSize, typeOf } from "@/lib/storage";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/util";
import { ItemIcon } from "./item-icon";

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
  const t = useTranslations("storage");
  const sorted = [...items].sort(
    (a, b) =>
      Number(isFolder(b)) - Number(isFolder(a)) ||
      itemName(a).localeCompare(itemName(b)),
  );

  return (
    <div className="relative size-full">
      <div className="absolute inset-0 flex flex-col border border-secondary">
        <FileListHeader />
        <div className="flex-1 flex flex-col overflow-y-auto bg-foreground">
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
            <div className="h-full flex items-center justify-center">
              <span className="text-center text-inner">{t("empty")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FileListHeader() {
  const t = useTranslations("storage");
  return (
    <div className="table-list text-xs uppercase text-secondary bg-foreground">
      <span>{t("name")}</span>
      <span>{t("type")}</span>
      <span>{t("modified")}</span>
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
  const t = useTranslations("storage");
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
      className={cn(
        "animated-200 w-full items-center table-list text-left last:border-0 bg-background",
        selected ? "bg-focus" : "hover:bg-inner",
      )}
    >
      <ItemIcon item={item} className="size-9" aria-hidden="true" />
      <span className="truncate min-w-0">{itemName(item)}</span>
      <span className="text-sm text-secondary">{t(typeOf(item))}</span>
      <span className="text-sm text-secondary">
        {item.modified
          ? new Date(item.modified).toLocaleString()
          : formatSize(item.size)}
      </span>
    </button>
  );
}
