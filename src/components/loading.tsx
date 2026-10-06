import { Spinner } from "./spinner";
import "./loading.css";

export function Loading() {
  return (
    <div className="afs-loading">
      <Spinner />
      <span>loading</span>
    </div>
  );
}
