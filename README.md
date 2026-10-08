# react-fs-explorer

Simple, backend agnostic, minimal dependency react component for browsing file systems

## Requirements

Requires React 19 and React DOM 19 to be installed in your target project.

## Installation

```sh
npm install react-fs-explorer
```

Alternatively, you can download source code and run `npm run build` to build it in place. Then link `dist/` directory in source folder to your project and start using file browser.

## Usage

Define content and info source and import component into your app:

```tsx
import { FSExplorer } from "react-fs-explorer";
import "react-fs-explorer/style.css";  // import styles so everything looks pretty

const provider = async (path: string) => {
    const tree = await fetch(`${STORAGE_HOST}/tree/${path}`);
    const disk = await fetch(`${STORAGE_HOST}/info/`);

    if (tree.ok && disk.ok) {
      const files = await tree.json();
      const info = await disk.json();
      return { files, info };
    }

      return { files: [] };
  };

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FSExplorer provider={provider} />
  </StrictMode>,
);

```

By default `<FSExplorer />` takes all available parent space. You can wrap it in container if you want to constraint it (minimal height for browser is `500px`):

```tsx
export default function App() {
  return (
    <div style={{width: "75%", height: 1024}}>
      <FSExplorer
        provider={provider}
      />
    </div>
  );
}
```

## Documentation

There's github hosted wiki that covers all required aspect of this library. Also, there is offline  [Markdown styled docs](docs/index.md) available at source tree.  If you need server to provide you file or some example reference [there is repository](https://github.com/DLWHI/react-fs-server) that provides working example of this library and hostable server.

## Features

### Backend-agnostic by design

Connect the browser to your own storage service with a `provider` callback. The library renders the interface; your application remains in control of data access and file operations.

### Composable UI

Use the complete `<FSExplorer />` or build a custom layout from the exported file list, navigation, and preview components.

### Optional file actions and previews

Provide callbacks for upload, folder creation, and deletion to enable those actions. Supply URL callbacks to show image or video previews and offer open and download links. Omit the optional callbacks when those capabilities are not needed.

### Typed data and selection access

TypeScript types are included for file entries, storage information, provider results, and component props. An optional `selectedRef` exposes the currently selected entry to the host application.

### Localization support

Customize individual labels or provide a translation callback, so the interface can fit the terminology and language of your application.

### Lightweight integration

React and React DOM are the runtime peer dependencies. The library ships its CSS and SVG assets with the built package; Vite, TypeScript, and SVGR are used to build the library, not required as runtime dependencies by consuming applications.

## Need Help?

[Post an Issue](https://github.com/DLWHI/react-fs-explorer-server/issues) or feel free to email me.
