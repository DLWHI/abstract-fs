import { Spinner } from "./spinner";
import "./loading.css";

export function Loading() {
  return (
    <div className="afs-loading">
      <div className="afs-loading-spinner-container">
        <Spinner />
      </div>
      <span>loading</span>
    </div>
  );
}
