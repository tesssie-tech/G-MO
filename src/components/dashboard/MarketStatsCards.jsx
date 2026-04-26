import { formatCompactCurrency } from "../../utils/formatters";

export function MarketStatsCards({ coins = [] }) {
  const marketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  const volume24h = coins.reduce(
    (sum, coin) => sum + (coin.total_volume || 0),
    0
  );
  const avgChange24h =
    coins.length > 0
      ? coins.reduce(
          (sum, coin) => sum + (coin.price_change_percentage_24h || 0),
          0
        ) / coins.length
      : 0;

  return (
    <section className="stats-grid" aria-label="Market overview">
      <article className="stat-card">
        <p className="stat-label">Total Market Cap (Top 50)</p>
        <h3>{formatCompactCurrency(marketCap)}</h3>
      </article>
      <article className="stat-card">
        <p className="stat-label">24h Volume (Top 50)</p>
        <h3>{formatCompactCurrency(volume24h)}</h3>
      </article>
      <article className="stat-card">
        <p className="stat-label">Average 24h Move</p>
        <h3 className={avgChange24h >= 0 ? "pos" : "neg"}>
          {avgChange24h >= 0 ? "+" : ""}
          {avgChange24h.toFixed(2)}%
        </h3>
      </article>
    </section>
  );
}
