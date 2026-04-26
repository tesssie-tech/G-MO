export function Loader() {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <p>Loading live market data...</p>
    </div>
  );
}
