# Localization and labels

`react-fs-explorer` supports both static label overrides and a translation callback. The library resolves labels in this order:

1. `t(key, params)` if a translator callback is provided
2. `labels[key]` if a partial label map is supplied
3. The built-in default label

This makes it easy to localize the UI either by providing a translated map or by wiring the component into your own i18n layer.

## Using `labels`

```tsx
import { FSExplorer } from "react-fs-explorer";

const labels = {
  empty: "No files here",
  upload: "Upload files",
  create_folder: "New folder",
  folder_name: "Folder name",
  confirm: "OK",
  cancel: "Cancel",
};

export function ExplorerWithCustomLabels() {
  return <FSExplorer provider={provider} labels={labels} />;
}
```

Only the keys you supply are overridden; missing keys automatically fall back to the defaults.

## Using `t` for dynamic translation

```tsx
import { FSExplorer } from "react-fs-explorer";
import type { LabelProvider } from "react-fs-explorer";

const translate: LabelProvider = (key, params) => {
  const map = {
    name: "Nombre",
    type: "Tipo",
    size: "Tamaño",
    free: "Libre {value}",
    used: "Usado {used} de {total}",
    empty: "Esta carpeta está vacía",
    loading: "Cargando...",
  } as const;

  const text = map[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, token) => String(params?.[token] ?? ""));
};

export function ExplorerLocalized() {
  return <FSExplorer provider={provider} t={translate} />;
}
```

## Parameter interpolation

Some labels include template variables, such as `free`, `fract`, `used`, and `used`/`total` values. The same formatting is applied to both the object-based and callback-based approaches.

```tsx
const labels = {
  free: "Free {value}",
  used: "{used} used of {total}",
};

const translate: LabelProvider = (key, params) => {
  if (key === "free") return `Libre ${params?.value ?? ""}`;
  if (key === "used") return `${params?.used ?? ""} de ${params?.total ?? ""}`;
  return key;
};
```

## Example: per-locale objects

```tsx
const locale = {
  en: {
    empty: "This folder is empty",
    upload: "Upload",
  },
  es: {
    empty: "Esta carpeta está vacía",
    upload: "Subir",
  },
};

export function ExplorerByLanguage({ lang }: { lang: "en" | "es" }) {
  return <FSExplorer provider={provider} labels={locale[lang]} />;
}
```

## Notes

- `t` takes precedence over `labels`.
- `labels` can be partial, so you can override only what you need.
- `LabelProvider` receives the current label key and optional interpolation params.
- If a provided label string contains `{value}` or similar placeholders, those are replaced using the `params` object when the component asks for a translated string.

For a ready-to-copy TypeScript example, see [localization.ts](./localization.ts).

## Complete list of label keys

```tsx
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
```
