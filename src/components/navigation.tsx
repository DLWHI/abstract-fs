import BackArrow from "../assets/back-arrow.svg?react";
import { Fragment } from "react";
import { parentPath } from "../lib/storage";
import "./navigation.css";

export function StorageNavigation({
  path,
  loading = false,
  navigate,
}: {
  path: string;
  loading?: boolean;
  navigate: (path: string) => void;
}) {
  const segments = path.split("/").filter(Boolean);
  let renderPath = "";
  return (
    <nav className="afs-navbar-container" aria-label="Storage path">
      <button
        type="button"
        className="afs-navbar-path-element"
        onClick={() => navigate(parentPath(path))}
        disabled={!path || loading}
      >
        <BackArrow width={32} height={32} />
      </button>
      <span className="flex gap-2">
        <button
          type="button"
          className="afs-navbar-path-element"
          onClick={() => navigate("")}
          disabled={!path || loading}
        >
          /
        </button>
        {segments.map((segment) => {
          renderPath += `/${segment}`;
          const path = renderPath;
          return (
            <Fragment key={segment}>
              <span>{">"}</span>
              <button
                type="button"
                key={path}
                className="afs-navbar-path-element"
                onClick={() => navigate(path)}
                disabled={loading}
              >
                {segment}
              </button>
            </Fragment>
          );
        })}
      </span>
    </nav>
  );
}
