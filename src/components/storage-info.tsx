import { type Labels, type LabelProvider, getLabel } from "../i18n/types";
import type { StorageInfo as Info } from "../lib/types";
import { formatSize } from "../lib/util";
import "./storage-info.css";

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
            value: formatSize(info.free, 2, labels, t),
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
          used: formatSize(info.used, 2, labels, t),
          total: formatSize(info.total, 2, labels, t),
        })}
      </p>
    </section>
  );
}
