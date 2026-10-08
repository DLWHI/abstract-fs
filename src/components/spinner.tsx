import "./spinner.css";

export function Spinner() {
  return (
    <div className="rfe-spinner-container">
      <div className="rfe-spinner" role="status" aria-label="loading" />
    </div>
  );
}
