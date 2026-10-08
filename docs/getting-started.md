# Getting started

## Install

Get `react-fs-explorer` from npm (or build it locally):

```sh
npm install react-fs-explorer
```

## Setup provider

Run files provider server and define interactions with it:

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

Alternatively, you can define static array of files and provide function that traverses them as tree:

```tsx
import { FSExplorer } from "react-fs-explorer";
import "react-fs-explorer/style.css";

const files = [
  {
    id: "/Code",
    size: 0,
    date: new Date(2023, 11, 2, 17, 25),
    type: "folder",
  },
  {
    id: "/Music",
    size: 0,
    date: new Date(2023, 11, 1, 14, 45),
    type: "folder",
  },

  {
    id: "/Info.txt",
    size: 1000,
    date: new Date(2023, 10, 30, 6, 13),
    type: "file",
  },
  {
    id: "/Code/Year.jsx",
    size: 1595,
    date: new Date(2023, 11, 7, 15, 23),
    type: "file",
  },
  {
    id: "/Pictures/162822515312968813.png",
    size: 510885,
    date: new Date(2023, 11, 1, 14, 45),
    type: "file",
  },
]

const provider = async (path: string) => {
  const normalized = path === "/" 
  ? "/" 
  : path.replace(/\/$/, "");

  return files.filter((item) => {
    const lastSlashIndex = item.id.lastIndexOf("/");
    const parent = lastSlashIndex === 0 
      ? "/" 
      : item.id.substring(0, lastSlashIndex);
    return parent === normalized ;
  });
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FSExplorer provider={provider} />
  </StrictMode>,
);

```

Strictly speaking, `<FSExplorer />` does not care where files come from as long as `provider()` supplies them in right format.  

## Events (Download, Upload, Create folder)

You can pass event handlers and additional providers to enable some of the features

```tsx
import { FSExplorer } from "react-fs-explorer";
import "react-fs-explorer/style.css";

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

const source = (item) => {
  if (typeof item.id === "string") {
    if (item.id.startsWith("/")) {
      return `${hostname}/storage/file${item.id.split("/").map(encodeURIComponent).join("/")}`;
    }
    return `${hostname}/storage/file/${item.id.split("/").map(encodeURIComponent).join("/")}`;
  }
  const message = `Error resolving item url: unkown item provided`;
  alert(message);
  console.log(message);
  return message;
};

export default function App() {
  // passing source enables file opening in new tab
  return (
      <FSExplorer
        provider={provider}
        sources={source}
        previews={source}
      />
  );
}
```

See [components.md](components.md#FSExplorer) for complete reference of props.

## Customization and localization

`<FSExplorer />` exposes `t` and `labels` property for user to provide localization. See [localization.md](localization.md)  
To customize apperance one can override inner class names or colors, for more information, see [styles.md](styles.md)  
`<FSExplorer />` is built using some static building components that can be used outside of it (ex. `<ReactFilePreview />`). See [components.md](components.md) for complete list.
