import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
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
import { isFolder, sortStorageEntities } from "../lib/util";
import { Loading } from "./loading";

import "../index.css";
import "./browser.css";
import { getLabel, type LabelProvider, type Labels } from "../i18n/types";

export interface Content {
  files: StorageEntity[];
  info?: StorageInfo;
}

export type ContentProvider = (path: string) => Promise<Content> | Content;

export interface FileSelectorHandle {
  getSelected: () => StorageEntity | null;
}

export interface ExplorerProps {
  initialItems?: StorageEntity[];
  initialPath?: string;
  storageInfo?: StorageInfo;
  selectedRef?: Ref<FileSelectorHandle>;
  provider: ContentProvider;
  previews?: PreviewURLProvider;
  sources?: SourceURLProvider;
  onDoubleClick?: ItemOpenEventHandler;
  onDelete?: DeleteEventHandler;
  onUpload?: UploadEventHandler;
  onFolderCreate?: FolderCreateEventHandler;
  labels?: Partial<Labels>;
  t?: LabelProvider;
}

export function FSExplorer({
  initialItems = [],
  initialPath = "/",
  storageInfo,
  selectedRef,
  sources,
  previews,
  onDelete,
  onFolderCreate,
  onDoubleClick,
  onUpload,
  provider,
  labels,
  t,
}: ExplorerProps) {
  const [items, setItems] = useState<StorageEntity[]>(
    initialItems.length ? sortStorageEntities(initialItems) : initialItems,
  );
  const [info, setInfo] = useState<StorageInfo | undefined>(storageInfo);
  const [path, setPath] = useState(initialPath ? initialPath : "/");
  const [selected, setSelected] = useState<StorageEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  useImperativeHandle(
    selectedRef,
    () => ({
      getSelected: () => selected,
    }),
    [selected],
  );

  const load = useCallback(
    async (nextPath: string, keepSelection = false) => {
      const id = ++requestId.current;
      setLoading(true);
      try {
        const data = await provider(nextPath);
        if (id !== requestId.current) return;
        setItems(sortStorageEntities(data.files));
        setInfo(data.info);
        if (!keepSelection) setSelected(null);
      } finally {
        if (id === requestId.current) {
          setLoading(false);
        }
      }
    },
    [provider],
  );

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
    <div className="rfe-browser" onClick={() => setSelected(null)}>
      <div className="rfe-browser-header-bar">
        <StorageNavigation path={path} loading={loading} navigate={navigate} />
        <StorageUpload
          path={path}
          onFolderCreate={createFolder}
          onUpload={upload}
          labels={labels}
          t={t}
        />
      </div>
      <div className="rfe-browser-content">
        <div className="rfe-browser-list-container">
          {loading ? (
            <Loading label={getLabel("loading", labels, t)} />
          ) : (
            <FileList
              items={items}
              selected={selected}
              onSelect={selectItem}
              onFolderOpen={openFolder}
              onFileOpen={onDoubleClick}
              labels={labels}
              t={t}
            />
          )}
        </div>
        <div className="rfe-browser-preview-container">
          <Preview
            source={sources}
            preview={previews}
            item={selected}
            onDelete={erase}
            labels={labels}
            t={t}
          />
        </div>
        {info != undefined && (
          <StorageInfoDisplay labels={labels} t={t} info={info} />
        )}
      </div>
    </div>
  );
}
