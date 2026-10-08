import { Spinner } from "./spinner";
import type { ChangeEvent } from "react";
import { useRef, useState, useTransition, type SubmitEvent } from "react";
import { type Labels, type LabelProvider, getLabel } from "../i18n/types";
import "./upload.css";

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
  labels,
  t,
}: {
  path: string;
  onUpload?: UploadEventHandler;
  onFolderCreate?: FolderCreateEventHandler;
  labels?: Partial<Labels>;
  t?: LabelProvider;
}) {
  return (
    <>
      <div className="rfe-upload-bar">
        {onFolderCreate && (
          <StorageFolderDialog
            path={path}
            onCreate={onFolderCreate}
            labels={labels}
            t={t}
          />
        )}
        {onUpload && (
          <UploadButton path={path} onUpload={onUpload} labels={labels} t={t} />
        )}
      </div>
    </>
  );
}

function StorageFolderDialog({
  path,
  onCreate,
  labels,
  t,
}: {
  path: string;
  onCreate: FolderCreateEventHandler;
  labels?: Partial<Labels>;
  t?: LabelProvider;
}) {
  const [loading, startTransition] = useTransition();
  const [name, setName] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    let folderName = name.trim();
    if (!folderName) folderName = "New folder";
    startTransition(async () => {
      await onCreate(folderName, path);
      if (popoverRef.current) {
        popoverRef.current.hidePopover();
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
        className="rfe-upload-button rfe-animated"
        popoverTarget="rfe-folder-form"
        id="rfe-create-folder-button"
      >
        {getLabel("create_folder", labels, t)}
      </button>
      <div
        ref={popoverRef}
        popover="auto"
        id="rfe-folder-form"
        className="rfe-create-folder-popover"
      >
        <form onSubmit={submit} className="rfe-create-folder-form">
          <h2 className="rfe-create-folder-form-header">add_folder</h2>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New folder"
            className="rfe-create-folder-input"
          />
          <div className="rfe-create-folder-confirm">
            <button
              type="button"
              className="rfe-upload-button rfe-animated"
              onClick={() => {
                if (popoverRef.current) {
                  popoverRef.current.hidePopover();
                }
              }}
            >
              {getLabel("cancel", labels, t)}
            </button>
            <button type="submit" className="rfe-upload-button rfe-animated">
              {getLabel("confirm", labels, t)}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function UploadButton({
  path,
  onUpload,
  labels,
  t,
}: {
  path: string;
  onUpload: UploadEventHandler;
  labels?: Partial<Labels>;
  t?: LabelProvider;
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
      className="rfe-upload-button rfe-animated"
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
      <span className="w-min">{getLabel("upload", labels, t)}</span>
    </button>
  );
}
