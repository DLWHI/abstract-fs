# Styling and theme overrides

`react-fs-explorer` uses CSS custom properties (CSS variables) for most visual tokens. Override them after importing the library stylesheet to customize the browser colors and typeface without patching the component code.

## Import order

```css
@import "react-fs-explorer/style.css";

:root {
  --rfe-font: "Inter", "Segoe UI", sans-serif;
  --rfe-background: #f4f6fb;
  --rfe-foreground: #ffffff;
  --rfe-toolbar: #eef2ff;
  --rfe-on-background: #111827;
  --rfe-on-foreground: #1f2937;
  --rfe-secondary: #64748b;
  --rfe-special: #2563eb;
}
```

Because the library CSS defines these variables on `:root`, your overrides should be loaded after the package stylesheet or in a more specific selector. If you want a theme scoped to one container, you can assign the same variables on a wrapper class instead:

```css
@import "react-fs-explorer/style.css";

.app-shell {
  --rfe-font: "IBM Plex Sans", "Segoe UI", sans-serif;
  --rfe-background: #0f172a;
  --rfe-foreground: #111827;
  --rfe-toolbar: #1f2937;
  --rfe-on-background: #e5e7eb;
  --rfe-on-foreground: #ffffff;
  --rfe-secondary: #94a3b8;
  --rfe-special: #7dd3fc;
}
```

## Available variables

The library exposes the following variables:

```css
:root {
  --rfe-font: system-ui, "Segoe UI", sans-serif;
  --rfe-background: #d3d4ec;
  --rfe-foreground: #c8c9e0;
  --rfe-toolbar: #caccd1;
  --rfe-on-background: #0e0e0e;
  --rfe-on-foreground: #222222;
  --rfe-secondary: #8f8f8f;
  --rfe-special: #006492;
}
```

The browser also supports a few extra dark-theme tokens when you set a `data-theme="dark"` attribute or apply a `.dark` class:

```css
:root[data-theme="dark"],
.dark {
  --rfe-background: #181818;
  --rfe-foreground: #181818;
  --rfe-inner: #2e303a;
  --rfe-inner-hover: #4e5269;
  --rfe-on-background: #bfbfbf;
  --rfe-on-foreground: #ffffff;
  --rfe-secondary: #8f8f8f;
  --rfe-special: #2596be;
  --rfe-on-special: #181818;
  --rfe-foreground-focus: #283b2f;
}
```

## Font override

The library sets `font-family` from `--rfe-font`, so changing it globally is enough for the whole explorer UI:

```css
:root {
  --rfe-font: "JetBrains Mono", monospace;
}
```

This affects things like the file list, metadata, preview labels, and controls. If you prefer a different font just for one explorer instance, scope the override to a parent component or wrapper class.

## Example: themed browser instance

```css
@import "react-fs-explorer/style.css";

.storage-panel {
  --rfe-font: "Segoe UI", sans-serif;
  --rfe-background: #f8fafc;
  --rfe-foreground: #e2e8f0;
  --rfe-toolbar: #dbeafe;
  --rfe-on-background: #0f172a;
  --rfe-on-foreground: #1e293b;
  --rfe-secondary: #475569;
  --rfe-special: #0ea5e9;
}
```

```tsx
export default function App() {
  return (
    <div className="storage-panel">
      <FSExplorer provider={provider} />
    </div>
  );
}
```
