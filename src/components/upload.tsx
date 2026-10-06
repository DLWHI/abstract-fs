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

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const folderName = name.trim();
    if (!folderName) return;
    startTransition(async () => {
      try {
        await onCreate(path, folderName);
        overlay.current?.close();
      } catch {
        return;
      }
    });
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-2 w-full max-w-md rounded-3xl bg-foreground p-6 text-on-background"
    >
      <h2 className="text-xl font-semibold">{t("add_folder")}</h2>
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
          onClick={overlay.current?.close}
        >
          {t("cancel")}
        </button>
        <button type="submit" className="button rounded-3xl px-4 py-2">
          {t("add_folder")}
        </button>
      </div>
    </form>
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
    const next = event.target.files?.[0] ?? null;

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
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={uploadDirect}
        className="hidden"
      />
      <span className="w-min">{t("upload")}</span>
    </button>
  );
}
