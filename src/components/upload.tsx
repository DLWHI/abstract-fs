"use client";

import { isFileMedia } from "@/lib/storage";
import { Overlay, OverlayRef, Spinner } from "@/components/ui";
import { Cropper, type CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import type { ChangeEvent } from "react";
import { useRef, useState, useTransition, SubmitEvent, useEffect } from "react";
import { useTranslations } from "next-intl";

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
        {onUpload && (
          <>
            <UploadButton path={path} onUpload={onUpload} />
            <CropUploadButton path={path} onUpload={onUpload} />
          </>
        )}
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
  const t = useTranslations("storage");
  const [loading, startTransition] = useTransition();
  const overlay = useRef<OverlayRef>(null);
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
    <Overlay
      ref={overlay}
      className="button rounded-3xl px-4 py-2 w-min"
      label={t("add_folder")}
    >
      <form
        onSubmit={submit}
        className="flex flex-col gap-2 w-full max-w-md rounded-3xl bg-foreground p-6 text-on-background"
      >
        <h2 className="text-xl font-semibold">{t("add_folder")}</h2>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("name_folder")}
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
    </Overlay>
  );
}

export function UploadButton({
  path,
  onUpload,
}: {
  path: string;
  onUpload: UploadEventHandler;
}) {
  const t = useTranslations("storage");
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

export function CropUploadButton({
  path,
  onUpload,
}: {
  path: string;
  onUpload: UploadEventHandler;
}) {
  const t = useTranslations("storage");
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);
  const [loading, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const overlay = useRef<OverlayRef>(null);

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0] ?? null;
    if (!next || !next.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }
    overlay.current?.open();
    setFile(next);
    setCropSource(URL.createObjectURL(next));
  };

  const close = () => {
    setCropSource(null);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadCrop = () => {
    const canvas = cropperRef.current?.getCanvas();
    if (!canvas || !file) return;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        startTransition(async () => {
          try {
            await onUpload(
              new File([blob], file.name, { type: file.type || "image/jpeg" }),
              path,
            );
          } catch {
            return;
          }
          overlay.current?.close();
        });
      },
      file.type || "image/jpeg",
      0.7,
    );
  };

  return (
    <>
      <button
        type="button"
        className="button rounded rounded-3xl px-4 py-2"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={selectFile}
          className="hidden"
        />
        <span className="w-min">{t("crop_upload")}</span>
      </button>
      <Overlay ref={overlay} onClose={close}>
        {cropSource && (
          <div className="flex flex-col w-2/3 h-9/10 bg-foreground gap-4 p-4 rounded-xl">
            <h2 className="text-xl">{t("crop")}</h2>
            <Cropper
              className="flex-1 min-h-0"
              ref={cropperRef}
              src={cropSource}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="button rounded px-4 py-2"
                disabled={loading}
                onClick={overlay.current?.close}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="button rounded px-4 py-2"
                disabled={loading}
                onClick={uploadCrop}
              >
                {t("crop_upload")}
              </button>
            </div>
          </div>
        )}
      </Overlay>
    </>
  );
}
