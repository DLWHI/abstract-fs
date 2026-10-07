import { Spinner } from "./spinner";
import type { ChangeEvent } from "react";
import { useRef, useState, useTransition, type SubmitEvent } from "react";
import "./upload.css";
import { Loading } from "./loading";

export type UploadEventHandler = (
  file: File,
  path: string,
  setProgress?: (value: number) => void,
) => Promise<void> | void;
export type FolderCreateEventHandler = (
  name: string,
  path: string,
) => Promise<void> | void;

export function StorageUpload({
  path,
  onUpload,
  onFolderCreate,
}: {
  path: string;
  onUpload?: UploadEventHandler;
  onFolderCreate?: FolderCreateEventHandler;
}) {
  return (
    <>
      <div className="afs-upload-bar">
        {onFolderCreate && (
          <StorageFolderDialog path={path} onCreate={onFolderCreate} />
        )}
        {onUpload && <UploadButton path={path} onUpload={onUpload} />}
      </div>
    </>
  );
}

export function StorageFolderDialog({
  path,
  onCreate,
}: {
  path: string;
  onCreate: FolderCreateEventHandler;
}) {
  const [loading, startTransition] = useTransition();
  const [name, setName] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    let folderName = name.trim();
    if (!folderName) folderName = "New folder";
    startTransition(async () => {
      try {
        await onCreate(path, folderName);
        if (popoverRef.current) {
          popoverRef.current.hidePopover();
        }
      } catch {
        return;
      }
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <button
        type="button"
        className="afs-upload-button afs-animated"
        popoverTarget="afs-folder-form"
        id="afs-create-folder-button"
      >
        Create folder
      </button>
      <div
        ref={popoverRef}
        popover="auto"
        id="afs-folder-form"
        className="afs-create-folder-popover"
      >
        <form onSubmit={submit} className="afs-create-folder-form">
          <h2 className="afs-create-folder-form-header">add_folder</h2>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New folder"
            className="afs-create-folder-input"
          />
          <div className="afs-create-folder-confirm">
            <button
              type="button"
              className="afs-upload-button afs-animated"
              onClick={() => {
                if (popoverRef.current) {
                  popoverRef.current.hidePopover();
                }
              }}
            >
              cancel
            </button>
            <button type="submit" className="afs-upload-button afs-animated">
              add_folder
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export function UploadButton({
  path,
  onUpload,
}: {
  path: string;
  onUpload: UploadEventHandler;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, startTransition] = useTransition();

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    let next: File | null = null;
    if (event.target.files && event.target.files[0]) {
      next = event.target.files[0];
    }

    if (!next) {
      event.target.value = "";
      return;
    }
    startTransition(async () => {
      try {
        await onUpload(next, path);
      } finally {
        event.target.value = "";
      }
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <button
      type="button"
      className="afs-upload-button afs-animated"
      disabled={loading}
      onClick={() => {
        if (inputRef.current) {
          inputRef.current.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={upload}
        style={{ display: "none" }}
      />
      <span className="w-min">upload</span>
    </button>
  );
}
