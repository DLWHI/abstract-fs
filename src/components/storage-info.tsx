import type { StorageInfo as Info } from "../lib/types";
import "./storage-info.css";

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
  const units = ["b", "kb", "mb", "gb", "tb", "pb"];
  const fract = Math.round(((info.used / info.total) * 1000) / 10);
  return (
    <section className="afs-info-container">
      <div className="afs-flex-bar">
        <p className="afs-info-heading">free</p>
        <span className="afs-info-text">fract</span>
      </div>
      <div
        className="afs-rate-container"
        role="progressbar"
        aria-label="Storage used"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={fract}
      >
        <div className="afs-rate-bar" style={{ width: `${fract}%` }} />
      </div>
      <p className="afs-info-text">used</p>
    </section>
  );
}
