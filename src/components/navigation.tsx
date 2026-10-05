"use client";

import BackArrow from "@/components/svg/back-arrow.svg";
import { Fragment } from "react";
import { parentPath } from "@/lib/storage";

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
    <nav
      className="flex items-center gap-4 text-on-foreground"
      aria-label="Storage path"
    >
      <button
        type="button"
        onClick={() => navigate(parentPath(path))}
        disabled={!path || loading}
      >
        <BackArrow className="w-8 h-8" />
      </button>
      <span className="flex gap-2">
        <button
          type="button"
          className="hover:text-focus cursor-pointer"
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
                className="hover:text-focus cursor-pointer"
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
