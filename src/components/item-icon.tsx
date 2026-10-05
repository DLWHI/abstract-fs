import FolderIcon from "@/components/svg/folder.svg";
import FileIcon from "@/components/svg/file.svg";
import ImageIcon from "@/components/svg/image.svg";
import VideoIcon from "@/components/svg/video.svg";
import { StorageEntity } from "@/lib/model";
import { isFolder, isImage, isVideo } from "@/lib/storage";

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
