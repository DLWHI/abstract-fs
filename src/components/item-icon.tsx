import FolderIcon from "../assets/folder.svg?react";
import FileIcon from "../assets/file.svg?react";
import ImageIcon from "../assets/image.svg?react";
import VideoIcon from "../assets/video.svg?react";
import type { StorageEntity } from "../lib/types";
import { isFolder, isImage, isVideo } from "../lib/storage";

export function ItemIcon({
  item,
  className,
}: {
  item: StorageEntity;
  className?: string;
}) {
  if (isFolder(item)) {
    return <FolderIcon className={className} />;
  } else if (isImage(item)) {
    return <ImageIcon className={className} />;
  } else if (isVideo(item)) {
    return <VideoIcon className={className} />;
  } else {
    return <FileIcon className={className} />;
  }
}
