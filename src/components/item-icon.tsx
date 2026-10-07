import FolderIcon from "../assets/folder.svg?react";
import FileIcon from "../assets/file.svg?react";
import ImageIcon from "../assets/image.svg?react";
import VideoIcon from "../assets/video.svg?react";
import type { StorageEntity } from "../lib/types";
import { isFolder, isImage, isVideo } from "../lib/util";

export function ItemIcon({
  item,
  width,
  height,
  className,
}: {
  item: StorageEntity;
  width?: number;
  height?: number;
  className?: string;
}) {
  if (isFolder(item)) {
    return <FolderIcon width={width} height={height} className={className} />;
  } else if (isImage(item)) {
    return <ImageIcon width={width} height={height} className={className} />;
  } else if (isVideo(item)) {
    return <VideoIcon width={width} height={height} className={className} />;
  } else {
    return <FileIcon width={width} height={height} className={className} />;
  }
}
