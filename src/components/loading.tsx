import { Spinner } from "./spinner";
import "./loading.css";

export function Loading({ label }: { label: string }) {
  return (
    <div className="rfe-loading">
      <div className="rfe-loading-spinner-container">
        <Spinner />
      </div>
      <span>{label}</span>
    </div>
  );
}
