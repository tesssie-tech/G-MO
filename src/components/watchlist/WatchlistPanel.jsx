export function WatchlistPanel({ watchlistCoins, onClear }) {
  return (
    <section className="watchlist-card">
      <div className="watchlist-head">
        <h2>Starred Vault</h2>
        <button className="ghost-btn" onClick={onClear} type="button">
          Reset
        </button>
      </div>
      {watchlistCoins.length === 0 ? (
        <p className="watchlist-empty">Your vault is empty. Star a coin to keep it close.</p>
      ) : (
        <ul className="watchlist-list">
          {watchlistCoins.map((coin) => (
            <li key={coin.id} className="watch-item">
              <span>{coin.symbol.toUpperCase()}</span>
              <strong>{coin.current_price?.toLocaleString("en-US")}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
