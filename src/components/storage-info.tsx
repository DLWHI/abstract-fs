import { type Labels, type LabelProvider, getLabel } from "../i18n/types";
import type { StorageInfo as Info } from "../lib/types";
import "./storage-info.css";

const UNITS = ["b", "kb", "mb", "gb", "tb", "pb"] as const;

function formatStorage(
  bytes: number,
  decimals: number = 2,
  labels?: Partial<Labels>,
  t?: LabelProvider,
): string {
  if (bytes === 0) return "0 B";
  if (bytes < 0) return `-${formatStorage(Math.abs(bytes), decimals)}`;

  const k = 1024; // Use 1000 for decimal units (e.g. standard macOS / network speed)
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const unitIndex = Math.min(i, UNITS.length - 1);
  const value = bytes / Math.pow(k, unitIndex);

  return `${parseFloat(value.toFixed(decimals))} ${getLabel(UNITS[unitIndex], labels, t)}`;
}

export function StorageInfo({
  info,
  labels,
  t,
}: {
  info: Info;
  labels?: Partial<Labels>;
  t?: LabelProvider;
}) {
  const fract = Math.round(((info.used / info.total) * 1000) / 10);
  return (
    <section className="rfe-info-container">
      <div className="rfe-flex-bar">
        <p className="rfe-info-heading">
          {getLabel("free", labels, t, {
            value: formatStorage(info.free, 2, labels, t),
          })}
        </p>
        <span className="rfe-info-text">
          {getLabel("fract", labels, t, { value: fract })}
        </span>
      </div>
      <div
        className="rfe-rate-container"
        role="progressbar"
        aria-label="Storage used"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={fract}
      >
        <div className="rfe-rate-bar" style={{ width: `${fract}%` }} />
      </div>
      <p className="rfe-info-text">
        {getLabel("used", labels, t, {
          used: formatStorage(info.used, 2, labels, t),
          total: formatStorage(info.total, 2, labels, t),
        })}
      </p>
    </section>
  );
}
