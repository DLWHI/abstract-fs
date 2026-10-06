import "./spinner.css";

export function Spinner() {
  return (
    <div className="afs-spinner-container">
      <div className="afs-spinner" role="status" aria-label="loading" />
    </div>
  );
}
