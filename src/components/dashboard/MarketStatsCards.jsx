import { formatCompactCurrency } from "../../utils/formatters";

export function MarketStatsCards({ coins = [], watchlistCoins = [] }) {
  const CHART_WIDTH = 220;
  const CHART_HEIGHT = 76;
  const CHART_PAD = 8;

  const marketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  const watchlistVolume24h = watchlistCoins.reduce(
    (sum, coin) => sum + (coin.total_volume || 0),
    0
  );
  const watchlistMoves = watchlistCoins.map((coin) => coin.price_change_percentage_24h || 0);
  const watchlistAvgMove =
    watchlistMoves.length > 0
      ? watchlistMoves.reduce((sum, move) => sum + move, 0) / watchlistMoves.length
      : 0;

  const chartMin = Math.min(...watchlistMoves, 0);
  const chartMax = Math.max(...watchlistMoves, 0);
  const chartRange = chartMax - chartMin || 1;
  const chartInnerWidth = CHART_WIDTH - CHART_PAD * 2;
  const chartInnerHeight = CHART_HEIGHT - CHART_PAD * 2;

  const chartPoints = watchlistMoves
    .map((move, index) => {
      const x =
        watchlistMoves.length > 1
          ? CHART_PAD + (index / (watchlistMoves.length - 1)) * chartInnerWidth
          : CHART_PAD + chartInnerWidth / 2;
      const y =
        CHART_HEIGHT -
        CHART_PAD -
        ((move - chartMin) / chartRange) * chartInnerHeight;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const zeroLineY =
    CHART_HEIGHT -
    CHART_PAD -
    ((0 - chartMin) / chartRange) * chartInnerHeight;

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
        <p className="stat-label">My Balance</p>
        <h3>{formatCompactCurrency(marketCap)}</h3>
      </article>
      <article className="stat-card">
        <p className="stat-label">Watchlist 24h Volume ({watchlistCoins.length})</p>
        <h3>{formatCompactCurrency(watchlistVolume24h)}</h3>
        <div className="watchlist-chart-wrap" aria-label="Watchlist momentum chart">
          {watchlistMoves.length === 0 ? (
            <p className="watchlist-chart-empty">Star coins to unlock your live chart.</p>
          ) : (
            <>
              <svg
                className="watchlist-chart"
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                role="img"
                aria-label="Watchlist 24 hour change trend"
              >
                <line
                  x1={CHART_PAD}
                  y1={zeroLineY}
                  x2={CHART_WIDTH - CHART_PAD}
                  y2={zeroLineY}
                  className="watchlist-chart-baseline"
                />
                <polyline points={chartPoints} className="watchlist-chart-line" />
              </svg>
              <p className={`watchlist-chart-caption ${watchlistAvgMove >= 0 ? "pos" : "neg"}`}>
                {watchlistAvgMove >= 0 ? "+" : ""}
                {watchlistAvgMove.toFixed(2)}% average watchlist move
              </p>
            </>
          )}
        </div>
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
