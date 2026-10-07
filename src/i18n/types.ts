const DEFAULT_LABELS = {
  name: "Name",
  type: "Type",
  path: "Path",
  size: "Size",
  modified: "Modified",
  empty: "This folder is empty",
  preview: "Select folder or file",
  select: "Select",
  loading: "Loading...",
  create_folder: "Create folder",
  upload: "Upload",
  folder_name: "Folder name",
  folder_default_name: "New folder",
  confirm: "Confirm",
  cancel: "Cancel",
  open: "Open",
  download: "Download",
  free: "Free {value}",
  fract: "Used {value}%",
  used: "{used} used of {total}",
  file: "File",
  folder: "Folder",
  dir: "Folder",
  directory: "Folder",
  image: "Image",
  video: "Video",
  b: "B",
  kb: "KB",
  mb: "MB",
  gb: "GB",
  tb: "TB",
  pb: "PB",
};

export type Labels = typeof DEFAULT_LABELS;
export type LabelProvider = (
  key: keyof Labels,
  params?: Record<string, any>,
) => string;

export const getLabel = (
  key: keyof Labels,
  labels?: Partial<Labels>,
  t?: LabelProvider,
  params?: Record<string, any>,
): string => {
  if (t) {
    return t(key, params);
  }

  const customLabel = labels?.[key];
  if (typeof customLabel === "string") {
    return customLabel.replace(/\{(\w+)\}/g, (_, k) => params?.[k] ?? "");
  }

  const defaultLabel = DEFAULT_LABELS[key];
  if (!params || !defaultLabel.includes("{")) {
    return defaultLabel;
  }
  return defaultLabel.replace(/\{(\w+)\}/g, (_, k) => params?.[k] ?? "");
};
