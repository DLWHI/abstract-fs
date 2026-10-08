# Components

This reference describes the public React components and helper types exported by `react-fs-explorer`.

## Component reference

### FSExplorer

Main file explorer widget. It requires a `provider` callback and can be composed with optional preview/download handlers and custom labels.

#### Props

- `provider: ContentProvider`  
  Produces the contents for a given path. Required.  
  Signature: `(path: string) => Promise<Content> | Content`
- `initialItems?: StorageEntity[]`  
  Preload a list of items before the provider is called. If non-empty, the initial fetch is skipped.
- `initialPath?: string`  
  Path used for the first load when `initialItems` is empty.
- `storageInfo?: StorageInfo`  
  Optional disk usage metadata. If omitted, the storage summary bar is not rendered.
- `selectedRef?: Ref<FileSelectorHandle>`  
  Exposes the currently selected item through a ref handle.
- `previews?: PreviewURLProvider`  
  Returns a URL for image/video previewing. If omitted, preview rendering is disabled.
- `sources?: SourceURLProvider`  
  Returns the downloadable/openable URL for an item. If omitted, the "Open" and "Download" actions are hidden.
- `onDoubleClick?: ItemOpenEventHandler`  
  Fires when a file is double-clicked or pressed with Enter. Useful for confirming a selection or opening an item.
- `onDelete?: DeleteEventHandler`  
  Called when the delete action is triggered. If omitted, the delete button is hidden.
- `onUpload?: UploadEventHandler`  
  Called when a user selects a file to upload. If omitted, the upload button is hidden.
- `onFolderCreate?: FolderCreateEventHandler`  
  Called when a folder should be created. If omitted, the folder-creation button is hidden.
- `labels?: Partial<Labels>`  
  Partial override for built-in strings. See [localization.md](./localization.md).
- `t?: LabelProvider`  
  Translation callback with `key` and interpolation params. See [localization.md](./localization.md).

### FSNavigation

Navigation bar for the current path.

#### Props

- `path: string`  
  Current folder path.
- `loading?: boolean`  
  When `true`, navigation interactions are disabled while the parent is loading.
- `navigate: NavigationEventHandler`  
  Called when a user clicks a breadcrumb or path segment.  
  Signature: `(path: string) => void`

### FSFilePreview

Preview panel for the currently selected item.

#### Props

- `item: StorageEntity | null`  
  Item to display; if null, a placeholder is shown.
- `preview?: PreviewURLProvider`  
  Returns previewable URL for media items. If omitted, media previews are not rendered.
- `source?: SourceURLProvider`  
  Returns open/download URL. If omitted, open/download buttons are hidden.
- `onDelete?: DeleteEventHandler`  
  Called when the delete button is pressed. If omitted, the delete button is not shown.
- `labels?: Partial<Labels>`  
  Text overrides for labels in the preview area.
- `t?: LabelProvider`  
  Translation callback for preview labels.

### FSFileList

File table component for displaying a `StorageEntity[]` list.

#### Props

- `items: StorageEntity[]`  
  Items to render. When empty, the empty-state label is shown.
- `selected: StorageEntity | null`  
  Current selection. Required.
- `onSelect: ItemSelectEventHandler`  
  Called when a row is clicked. Signature: `(item: StorageEntity) => void`
- `onFileOpen?: ItemOpenEventHandler`  
  Fired when a file is opened via double-click or Enter.
- `onFolderOpen: ItemOpenEventHandler`  
  Fired when a folder is opened via double-click or Enter.
- `labels?: Partial<Labels>`  
  Localization overrides for list UI.
- `t?: LabelProvider`  
  Translation callback for list UI.

### FSStorageInfo

Displays storage statistics from a `StorageInfo` object.

#### Props

- `info: StorageInfo`  
  Storage summary to render.
- `labels?: Partial<Labels>`  
  Localization overrides for storage labels.
- `t?: LabelProvider`  
  Translation callback for storage labels.

## Shared types

### `StorageEntity`

```ts
interface StorageEntity {
  id: string;        // path or unique item identifier
  type: "folder" | "file" | "image" | "video";
  size?: number;    // optional size in bytes
  modified?: string; // ISO-like date string
}
```

Represents one filesystem item. `id` and `type` are required.

### `StorageInfo`

```ts
interface StorageInfo {
  free: number;
  used: number;
  total: number;
}
```

Represents the underlying storage state. The values are not guaranteed to match exact arithmetic relationships such as `free + used === total`.

### `Content`

```ts
interface Content {
  files: StorageEntity[];
  info?: StorageInfo;
}
```

Returned by a content provider and used by the explorer to render the current directory.

### `ContentProvider`

```ts
type ContentProvider = (path: string) => Promise<Content> | Content;
```

### `FileSelectorHandle`

```ts
interface FileSelectorHandle {
  getSelected: () => StorageEntity | null;
}
```

Ref handle exposing the currently selected item.

## Callback and event types

### `NavigationEventHandler`

```ts
(type: (path: string) => void)
```

Invoked when navigation changes.

### `SourceURLProvider`

```ts
(type: (item: StorageEntity) => string)
```

Returns a URL that can be used to open or download the resource.

### `PreviewURLProvider`

```ts
(type: (item: StorageEntity) => string)
```

Returns a URL used for image or video preview rendering.

### `DeleteEventHandler`

```ts
(type: (item: StorageEntity) => Promise<void> | void)
```

Called when a file or folder is deleted.

### `UploadEventHandler`

```ts
(type: (file: File, path: string) => Promise<void> | void)
```

Called when a file is selected for upload.

### `FolderCreateEventHandler`

```ts
(type: (name: string, path: string) => Promise<void> | void)
```

Called when a folder name is submitted.

### `ItemOpenEventHandler`

```ts
(type: (item: StorageEntity) => void)
```

Called when an item is opened.

### `ItemSelectEventHandler`

```ts
(type: (item: StorageEntity) => void)
```

Called when an item is selected.

### `Labels`

```ts
type Labels = typeof DEFAULT_LABELS;
```

The full set of built-in UI strings. You can override subset values with `Partial<Labels>`.

### `LabelProvider`

```ts
(type: (key: keyof Labels, params?: Record<string, any>) => string)
```

Translator callback used when a consumer wants to supply locale-specific strings.

## Utility functions

- `isFileMedia(candidate: File)`  
  Returns `true` when the file is an image or video based on MIME type.
- `isVideo(item: StorageEntity)`  
  Returns `true` when the storage item is a video or a filename with a video extension.
- `isImage(item: StorageEntity)`  
  Returns `true` when the storage item is an image or a filename with an image extension.
- `isFolder(item: StorageEntity)`  
  Returns `true` when the item type is `folder`.
- `typeOf(item: StorageEntity)`  
  Normalizes an item to `image`, `video`, `folder`, or `file` for display logic.
- `itemName(item: StorageEntity)`  
  Returns the final segment of the path, effectively the display name.
- `parentPath(path: string)`  
  Returns the parent directory path for a given path.
- `sortStorageEntities(list: StorageEntity[])`  
  Sorts items alphabetically with folders first.
- `formatSize(bytes: number, decimals = 2, labels?, t?)`  
  Formats a byte count using the built-in size labels and optional localization.

## Behavior and caveats

This library is intentionally lightweight, but there are a few behaviors worth knowing before integrating it:

- `provider(path)` errors are not swallowed. If the async load rejects, the error propagates; no toast or retry UI is built in.
- Optional callbacks are exactly that: optional. If `onUpload`, `onFolderCreate`, or `onDelete` are not provided, their actions are hidden rather than failing.
- `previews` and `sources` are also optional. Without them, the preview pane can still show metadata, but no media content or open/download actions are available.
- `selectedRef` only gives access to the current selection; it does not emit events or expose selection history.
- `FileList` shows the empty-state label when `items` is empty, but it still renders `formatSize(item.size)` when `modified` is missing. Ensure `size` is present for folders/files if you want predictable formatting.
- The browser uses `fetch()` for file downloads when `source()` resolves to a URL. If the response is not OK, the code throws an error; callers are responsible for handling or surfacing failures.
- `StorageFolderDialog` uses a fallback name of `New folder` when the input is empty, but it still relies on the caller to decide what happens when folder creation fails.

These contract details are useful for integrations that need to surface operational errors to the user in a higher-level application layer.

```tsx
(item: StorageEntity) => void
```

`StorageEntity` open event handler.

- `ItemSelectEventHandler`

```tsx
(item: StorageEntity) => void
```

Select event handler. Selects item. Required  

- `Labels`
Text labels for ui. See [localization.md](localization.md)

- `LabelProvider`

```tsx
(key: keyof Labels,  params?: Record<string, any>) => string;
```

Text labels provider function for ui. See [localization.md](localization.md)

## Functions

- `isFileMedia(candidate: File)`
Tells, wheter `canditate` is media file.

- `isVideo(item: StorageEntity)`
Tells, wheter `canditate` is video storage entity. Relies on `item.type` field and file extension: if extension or type corresponds to video returns `true`

- `isImage(item: StorageEntity)`
Tells, wheter `canditate` is image storage entity. Relies on `item.type` field and file extension: if extension or type corresponds to image returns `true`

- `isFolder(item: StorageEntity)`
Tells, wheter `canditate` is folder storage entity. Relies on `item.type` field

- `typeOf(item: StorageEntity)`
Returns type of `item` based on subsequent calls to `isImage(item)`, `isVideo(item)` and inspection `item.type` field.

- `itemName(item: StorageEntity)`
Returns name of `item`. Name is last path element of `item.type` id
- `parentPath(path: string)`
Returns parent path of given string

- `sortStorageEntities(list: StorageEntity[])`
Sorts array of `StorageEntity` alphabetically, folders first. Locale aware

- `formatSize(bytes: number, decimals: number = 2, labels?: Partial<Labels>, t?: LabelProvider)`
Returns `bytes` as formatted string up to `decimals` digits after point. `labels` and `t` provide localized scale units.
