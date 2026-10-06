import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AbstractFileBrowser } from "./components";

async function getDirectoryFiles(path: string) {
  const res = await fetch(`/api/dev-readdir/${path}`);
  const data = await res.json();
  return data.files;
}

async function getDirectoryInfo() {
  const res = await fetch("/api/dev-storageinfo");
  const data = await res.json();
  return data.info;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AbstractFileBrowser
      initialPath="/"
      provider={async (path: string) => ({
        files: await getDirectoryFiles(path),
        info: await getDirectoryInfo(),
      })}
    />
  </StrictMode>,
);
