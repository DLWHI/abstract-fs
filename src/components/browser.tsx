import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  useTransition,
} from "react";
import { StorageNavigation } from "./navigation";
import { StorageInfo as StorageInfoDisplay } from "./storage-info";
import { FileList, type ItemOpenEventHandler } from "./file-list";
import {
  type DeleteEventHandler,
  Preview,
  type PreviewURLProvider,
  type SourceURLProvider,
} from "./preview";
import {
  type FolderCreateEventHandler,
  StorageUpload,
  type UploadEventHandler,
} from "./upload";
import type { StorageEntity, StorageInfo } from "../lib/types";
import { isFolder } from "../lib/storage";
import { Loading } from "./loading";

export interface Content {
  files: StorageEntity[];
  info: StorageInfo;
}

export type ContentProvider = (path: string) => Promise<Content> | Content;

export interface StorageBrowserProps {
  initialItems?: StorageEntity[];
  initialPath?: string;
  storageInfo?: StorageInfo;
  selectedRef?: Ref<FileSelectorHandle>;
  provider: ContentProvider;
  previews?: PreviewURLProvider;
  sources?: SourceURLProvider;
  onFileOpen?: ItemOpenEventHandler;
  onDelete?: DeleteEventHandler;
  onUpload?: UploadEventHandler;
  onFolderCreate?: FolderCreateEventHandler;
}

export interface FileSelectorHandle {
  getSelected: () => StorageEntity | null;
}

export function AbstractFileBrowser({
  initialItems = [],
  initialPath = "",
  storageInfo,
  selectedRef,
  sources,
  previews,
  onDelete,
  onFolderCreate,
  onFileOpen,
  onUpload,
  provider,
}: StorageBrowserProps) {
  const [items, setItems] = useState<StorageEntity[]>(initialItems);
  const [info, setInfo] = useState<StorageInfo | undefined>(storageInfo);
  const [path, setPath] = useState(initialPath);
  const [selected, setSelected] = useState<StorageEntity | null>(null);
  const [loading, startTransition] = useTransition();

  useImperativeHandle(
    selectedRef,
    () => ({
      getSelected: () => selected,
    }),
    [selected],
  );

  const load = useCallback((nextPath: string, keepSelection = false) => {
    startTransition(async () => {
      const data = await provider(nextPath);
      setItems(data.files);
      setInfo(data.info);
      if (!keepSelection) setSelected(null);
    });
  }, []);

  const navigate = (nextPath: string) => {
    setPath(nextPath);
    load(nextPath);
  };

  const openFolder = (item: StorageEntity) => {
    if (isFolder(item)) {
      navigate(item.id.replace(/\/$/, ""));
      setSelected(null);
    }
  };

  const selectItem = (item: StorageEntity) => {
    setSelected(item);
  };
  const refresh = () => load(path, true);

  const erase = onDelete
    ? async (item: StorageEntity) => {
        await onDelete(item);
        setSelected(null);
        refresh();
      }
    : undefined;

  const createFolder = onFolderCreate
    ? async (name: string, path: string) => {
        await onFolderCreate(name, path);
        refresh();
      }
    : undefined;

  const upload = onUpload
    ? async (file: File, path: string) => {
        await onUpload(file, path);
        refresh();
      }
    : undefined;

  useEffect(() => {
    if (!initialItems.length) load(initialPath);
  }, [initialItems.length, initialPath, load]);

  return (
    <div
      className="flex min-h-0 h-full flex-col text-on-background"
      onClick={() => setSelected(null)}
    >
      <div className="flex items-center bg-inner/50 justify-between gap-4 border-b border-secondary px-4 py-2">
        <StorageNavigation path={path} loading={loading} navigate={navigate} />
        <StorageUpload
          path={path}
          onFolderCreate={createFolder}
          onUpload={upload}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden grid xl:grid-rows-[minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="row-span-2 min-h-0">
          {loading ? (
            <Loading />
          ) : (
            <FileList
              items={items}
              selected={selected}
              onSelect={selectItem}
              onFolderOpen={openFolder}
              onFileOpen={onFileOpen}
            />
          )}
        </div>
        <div className="min-h-0 min-w-0 overflow-hidden">
          <Preview
            source={sources}
            preview={previews}
            item={selected}
            onDelete={erase}
          />
        </div>
        {info != undefined && <StorageInfoDisplay info={info} />}
      </div>
    </div>
  );
}
