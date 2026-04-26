import { useMemo, useState } from "react";
import { ErrorState } from "./components/common/ErrorState";
import { Loader } from "./components/common/Loader";
import { CoinTable } from "./components/dashboard/CoinTable";
import { MarketStatsCards } from "./components/dashboard/MarketStatsCards";
import { MainLayout } from "./components/layout/MainLayout";
import { WatchlistPanel } from "./components/watchlist/WatchlistPanel";
import { useCoinData } from "./hooks/useCoinData";
import { useWatchlist } from "./hooks/useWatchlist";
import "./App.css";

function sortCoins(coins, sortBy) {
  const sorted = [...coins];

  if (sortBy === "price") {
    sorted.sort((a, b) => b.current_price - a.current_price);
  } else if (sortBy === "change24h") {
    sorted.sort(
      (a, b) =>
        (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    );
  } else {
    sorted.sort((a, b) => b.market_cap - a.market_cap);
  }

  return sorted;
}

function App() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("marketCap");

  const { coins, loading, error, lastUpdated, refetch } = useCoinData();
  const { watchlist, toggleWatchlist, clearWatchlist } = useWatchlist();

  const filteredCoins = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return sortCoins(coins, sortBy);
    }

    const result = coins.filter((coin) => {
      const name = coin.name?.toLowerCase() || "";
      const symbol = coin.symbol?.toLowerCase() || "";
      return name.includes(query) || symbol.includes(query);
    });

    return sortCoins(result, sortBy);
  }, [coins, search, sortBy]);

  const watchlistSet = useMemo(() => new Set(watchlist), [watchlist]);

  const watchlistCoins = useMemo(
    () => coins.filter((coin) => watchlistSet.has(coin.id)),
    [coins, watchlistSet]
  );

  const header = (
    <div className="brand-wrap">
      <h1>CoinPulse</h1>
      <p>Crypto dashboard powered by CoinGecko</p>
    </div>
  );

  const sidebar = (
    <WatchlistPanel watchlistCoins={watchlistCoins} onClear={clearWatchlist} />
  );

  return (
    <MainLayout header={header} sidebar={sidebar}>
      <section className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search coin or symbol"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <label className="sort-wrap" htmlFor="sortBy">
          <span>Sort</span>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="marketCap">Market Cap</option>
            <option value="price">Price</option>
            <option value="change24h">24h Change</option>
          </select>
        </label>
        <button className="primary-btn" type="button" onClick={refetch}>
          Refresh
        </button>
      </section>

      <p className="stamp">
        Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}
      </p>

      {loading && <Loader />}
      {!loading && error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <>
          <MarketStatsCards coins={filteredCoins} />
          <CoinTable
            coins={filteredCoins}
            watchlistSet={watchlistSet}
            onToggleWatchlist={toggleWatchlist}
          />
        </>
      )}
    </MainLayout>
  );
}

export default App;
