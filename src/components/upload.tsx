import { isFileMedia } from "../lib/storage";
import { Spinner } from "./spinner";
import type { ChangeEvent } from "react";
import { useRef, useState, useTransition, type SubmitEvent } from "react";

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
      <div className="flex h-full w-1/3">
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
  const [name, setName] = useState("New folder");
  const popoverRef = useRef<HTMLDivElement>(null);

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const folderName = name.trim();
    if (!folderName) return;
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

  return (
    <>
      {loading ? (
        <button
          type="button"
          className="afs-upload-button"
          onClick={() => {
            if (popoverRef.current) {
              popoverRef.current.hidePopover();
            }
          }}
        >
          Create folder
        </button>
      ) : (
        <Spinner />
      )}
      <div
        ref={popoverRef}
        popover="manual"
        className="afs-upload-folder-container"
      >
        <form
          onSubmit={submit}
          className="flex flex-col gap-2 w-full max-w-md rounded-3xl bg-foreground p-6 text-on-background"
        >
          <h2 className="text-xl font-semibold">add_folder</h2>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={"name_folder"}
            className="w-full px-4 h-10 rounded bg-foreground focus:outline-focus outline-1 outline-inner"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="button rounded-3xl px-4 py-2"
              onClick={() => {
                if (popoverRef.current) {
                  popoverRef.current.hidePopover();
                }
              }}
            >
              cancel
            </button>
            <button type="submit" className="button rounded-3xl px-4 py-2">
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

  const uploadDirect = (event: ChangeEvent<HTMLInputElement>) => {
    let next: File | null = null;
    if (event.target.files && event.target.files[0]) {
      next = event.target.files[0];
    }

    if (!next || !isFileMedia(next)) {
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

  return (
    <button
      type="button"
      className="button rounded-3xl px-4 py-2"
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
        accept="image/*,video/*"
        onChange={uploadDirect}
        className="hidden"
      />
      <span className="w-min">upload</span>
    </button>
  );
}
