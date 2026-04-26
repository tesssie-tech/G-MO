import { useEffect, useRef, useState } from "react";
import { formatCompactCurrency, formatCurrency, formatPercent } from "../../utils/formatters";

export function CoinRow({ coin, isFavorite, onToggleWatchlist }) {
  const prevPriceRef = useRef(coin.current_price);
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    const previous = prevPriceRef.current;
    if (typeof previous === "number" && typeof coin.current_price === "number") {
      if (coin.current_price > previous) {
        setFlashClass("price-up");
      } else if (coin.current_price < previous) {
        setFlashClass("price-down");
      }
    }

    prevPriceRef.current = coin.current_price;

    const timeoutId = setTimeout(() => setFlashClass(""), 550);
    return () => clearTimeout(timeoutId);
  }, [coin.current_price]);

  return (
    <>
      <tr className={`coin-row ${flashClass}`}>
        <td>{coin.market_cap_rank}</td>
        <td>
          <div className="coin-meta">
            <img src={coin.image} alt={coin.name} width="24" height="24" />
            <div>
              <p>{coin.name}</p>
              <small>{coin.symbol.toUpperCase()}</small>
            </div>
          </div>
        </td>
        <td>{formatCurrency(coin.current_price)}</td>
        <td className={coin.price_change_percentage_24h >= 0 ? "pos pulse" : "neg pulse"}>
          {formatPercent(coin.price_change_percentage_24h)}
        </td>
        <td className={coin.price_change_percentage_7d_in_currency >= 0 ? "pos" : "neg"}>
          {formatPercent(coin.price_change_percentage_7d_in_currency)}
        </td>
        <td>{formatCompactCurrency(coin.market_cap)}</td>
        <td>
          <button
            type="button"
            className={`star-btn ${isFavorite ? "active" : ""}`}
            onClick={() => onToggleWatchlist(coin.id)}
            aria-label={`Toggle ${coin.name} in watchlist`}
          >
            {isFavorite ? "*" : "+"}
          </button>
        </td>
      </tr>
      <tr className="coin-card-row">
        <td colSpan="7">
          <article className={`coin-card ${flashClass}`}>
            <div className="coin-card-head">
              <div className="coin-meta">
                <img src={coin.image} alt={coin.name} width="24" height="24" />
                <div>
                  <p>{coin.name}</p>
                  <small>
                    #{coin.market_cap_rank} {coin.symbol.toUpperCase()}
                  </small>
                </div>
              </div>
              <button
                type="button"
                className={`star-btn ${isFavorite ? "active" : ""}`}
                onClick={() => onToggleWatchlist(coin.id)}
                aria-label={`Toggle ${coin.name} in watchlist`}
              >
                {isFavorite ? "*" : "+"}
              </button>
            </div>
            <div className="coin-card-grid">
              <div>
                <span>Price</span>
                <strong>{formatCurrency(coin.current_price)}</strong>
              </div>
              <div>
                <span>24h</span>
                <strong className={coin.price_change_percentage_24h >= 0 ? "pos pulse" : "neg pulse"}>
                  {formatPercent(coin.price_change_percentage_24h)}
                </strong>
              </div>
              <div>
                <span>7d</span>
                <strong className={coin.price_change_percentage_7d_in_currency >= 0 ? "pos" : "neg"}>
                  {formatPercent(coin.price_change_percentage_7d_in_currency)}
                </strong>
              </div>
              <div>
                <span>Market Cap</span>
                <strong>{formatCompactCurrency(coin.market_cap)}</strong>
              </div>
            </div>
          </article>
        </td>
      </tr>
    </>
  );
}
