"use client";

import { StorageInfo as Info } from "@/lib/model";
import { useTranslations } from "next-intl";

function formatStorage(
  bytes: number,
  units: string[],
  decimals: number = 2,
): string {
  if (bytes === 0) return "0 B";
  if (bytes < 0) return `-${formatStorage(Math.abs(bytes), units, decimals)}`;

  const k = 1024; // Use 1000 for decimal units (e.g. standard macOS / network speed)
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const unitIndex = Math.min(i, units.length - 1);
  const value = bytes / Math.pow(k, unitIndex);

  return `${parseFloat(value.toFixed(decimals))} ${units[unitIndex]}`;
}

export function StorageInfo({ info }: { info: Info }) {
  const t = useTranslations("storage");
  const units = [t("b"), t("kb"), t("mb"), t("gb"), t("tb")];
  const fract = Math.round((info.used / info.total) * 100);
  return (
    <section className="h-fit flex flex-col gap-1 rounded border border-secondary bg-foreground px-4 py-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            {t("free", { value: formatStorage(info.free, units) })}
          </h2>
        </div>
        <span className="text-sm opacity-70">
          {t("fract", { value: fract })}
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-background"
        role="progressbar"
        aria-label="Storage used"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={fract}
      >
        <div
          className="h-full rounded-full bg-focus"
          style={{ width: `${fract}%` }}
        />
      </div>
      <p className="text-xs opacity-60">
        {t("used", {
          used: formatStorage(info.used, units),
          total: formatStorage(info.total, units),
        })}
      </p>
    </section>
  );
}
