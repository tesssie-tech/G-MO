import { CoinRow } from "./CoinRow";

export function CoinTable({ coins, watchlistSet, onToggleWatchlist }) {
  return (
    <section className="table-wrap" aria-label="Coin market table">
      <table className="coin-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Coin</th>
            <th>Price</th>
            <th>24h</th>
            <th>7d</th>
            <th>Market Cap</th>
            <th>Watch</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <CoinRow
              key={coin.id}
              coin={coin}
              isFavorite={watchlistSet.has(coin.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}
