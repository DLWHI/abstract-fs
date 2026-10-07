import { Spinner } from "./spinner";
import "./loading.css";

export function Loading({ label }: { label: string }) {
  return (
    <div className="afs-loading">
      <div className="afs-loading-spinner-container">
        <Spinner />
      </div>
      <span>{label}</span>
    </div>
  );
}
