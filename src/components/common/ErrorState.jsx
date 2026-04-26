export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-box" role="alert">
      <p>{message}</p>
      <button className="primary-btn" onClick={onRetry} type="button">
        Retry
      </button>
    </div>
  );
}
