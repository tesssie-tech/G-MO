import { useEffect, useMemo, useState } from "react";
import { ErrorState } from "./components/common/ErrorState";
import { Loader } from "./components/common/Loader";
import { CoinTable } from "./components/dashboard/CoinTable";
import { MarketStatsCards } from "./components/dashboard/MarketStatsCards";
import { MainLayout } from "./components/layout/MainLayout";
import { SideNav } from "./components/layout/SideNav";
import { WatchlistPanel } from "./components/watchlist/WatchlistPanel";
import { useCoinData } from "./hooks/useCoinData";
import { useWatchlist } from "./hooks/useWatchlist";
import "./App.css";

const COIN_PAGE_SIZE = 6;

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
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [visibleCoinCount, setVisibleCoinCount] = useState(COIN_PAGE_SIZE);
  const [themeMode, setThemeMode] = useState("dark");

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

  useEffect(() => {
    setVisibleCoinCount(COIN_PAGE_SIZE);
  }, [search, sortBy, coins.length]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  const visibleCoins = useMemo(
    () => filteredCoins.slice(0, visibleCoinCount),
    [filteredCoins, visibleCoinCount]
  );

  const hasMoreCoins = visibleCoinCount < filteredCoins.length;

  const viewMoreCoins = () => {
    setVisibleCoinCount((current) => Math.min(current + COIN_PAGE_SIZE, filteredCoins.length));
  };

  const watchlistCoins = useMemo(
    () => coins.filter((coin) => watchlistSet.has(coin.id)),
    [coins, watchlistSet]
  );

  const header = (
    <div className="brand-wrap">
      <div className="brand-head">
        <span className="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Zm0 2.3 5.8 3.2L12 10.8 6.2 7.5 12 4.3Zm-6 5 5 2.9v6.5l-5-2.8V9.3Zm7 9.4v-6.5l5-2.9v6.6l-5 2.8Z" />
          </svg>
        </span>
        <h1>CoinPulse</h1>
      </div>
      <p>Market intelligence, curated in real time.</p>
    </div>
  );

  const sidebar = (
    <SideNav
      watchlistCount={watchlistCoins.length}
      isOpen={isNavOpen}
      themeMode={themeMode}
      onToggle={() => setIsNavOpen((current) => !current)}
      onToggleTheme={() =>
        setThemeMode((currentMode) => (currentMode === "dark" ? "light" : "dark"))
      }
      onNavigate={() => setIsNavOpen(false)}
    />
  );

  return (
    <MainLayout
      header={header}
      sidebar={sidebar}
      sidebarOpen={isNavOpen}
    >
      <section id="overview" className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Discover by coin name or ticker"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <label className="sort-wrap" htmlFor="sortBy">
          <span>Curate By</span>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="marketCap">Market Prestige</option>
            <option value="price">Spot Price</option>
            <option value="change24h">24h Momentum</option>
          </select>
        </label>
        <button className="primary-btn" type="button" onClick={refetch}>
          Refresh 
        </button>
      </section>

      <p className="stamp">
        Last market sync: {lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}
      </p>

      {loading && <Loader />}
      {!loading && error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && (
        <div className="dashboard-grid">
          <div className="dashboard-main">
            <section id="market-stats">
              <MarketStatsCards coins={filteredCoins} watchlistCoins={watchlistCoins} />
            </section>
            <section id="coin-table">
              <CoinTable
                coins={visibleCoins}
                watchlistSet={watchlistSet}
                onToggleWatchlist={toggleWatchlist}
              />
              {hasMoreCoins && (
                <div className="table-actions">
                  <button className="ghost-btn" type="button" onClick={viewMoreCoins}>
                    Reveal More ({filteredCoins.length - visibleCoinCount} remaining)
                  </button>
                </div>
              )}
            </section>
            <section id="watchlist" className="watchlist-shell">
              <WatchlistPanel watchlistCoins={watchlistCoins} onClear={clearWatchlist} />
            </section>
          </div>
          <aside className="fast-actions" aria-label="Fast actions">
            <h2>Fast Actions</h2>
            <p>One-click shortcuts for your dashboard workflow.</p>
            <button className="primary-btn" type="button" onClick={refetch}>
              Refresh Pulse
            </button>
            <button
              className="ghost-btn"
              type="button"
              onClick={() =>
                setThemeMode((currentMode) => (currentMode === "dark" ? "light" : "dark"))
              }
            >
              Switch to {themeMode === "dark" ? "Light" : "Dark"} Mode
            </button>
            <button
              className="ghost-btn"
              type="button"
              onClick={() => setVisibleCoinCount(filteredCoins.length)}
              disabled={!hasMoreCoins}
            >
              Show All Coins
            </button>
            <button
              className="ghost-btn"
              type="button"
              onClick={clearWatchlist}
              disabled={watchlistCoins.length === 0}
            >
              Clear Starred Vault
            </button>
            <button
              className="ghost-btn"
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to Top
            </button>
          </aside>
        </div>
      )}
    </MainLayout>
  );
}

export default App;
