import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AbstractFileBrowser } from "./components";
import { getPathEntries, getStorageInfo } from "./lib/local";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AbstractFileBrowser
      provider={async () => ({
        files: await getPathEntries(
          "C:\\Users\\samim\\source\\abstract-fs\\src",
        ),
        info: await getStorageInfo(
          "C:\\Users\\samim\\source\\abstract-fs\\src",
        ),
      })}
    />
  </StrictMode>,
);
