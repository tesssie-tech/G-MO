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

function Banner() {
  const [username] = useState(() => {
    try {
      return localStorage.getItem("username") || "Guest";
    } catch (e) {
      return "Guest";
    }
  });

  return (
    <div className="welcome-banner" role="region" aria-label="Welcome banner">
      <span className="wave" aria-hidden="true">👋</span>
      <span className="welcome-text">Welcome, {username}</span>
    </div>
  );
}

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
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferCoinId, setTransferCoinId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferStatus, setTransferStatus] = useState("");

  const { coins, loading, error, refetch } = useCoinData();
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

  useEffect(() => {
    if (watchlistCoins.length === 0) {
      setTransferCoinId("");
      return;
    }

    setTransferCoinId((current) => {
      if (watchlistCoins.some((coin) => coin.id === current)) {
        return current;
      }
      return watchlistCoins[0].id;
    });
  }, [watchlistCoins]);

  const selectedTransferCoin = useMemo(
    () => watchlistCoins.find((coin) => coin.id === transferCoinId) || null,
    [watchlistCoins, transferCoinId]
  );

  const notificationCount = Math.min(
    99,
    watchlistCoins.length + (transferStatus ? 1 : 0)
  );

  const handleTransferAction = (direction) => {
    const amount = Number(transferAmount);

    if (!transferRecipient.trim()) {
      setTransferStatus("Add a recipient wallet or username.");
      return;
    }

    if (!selectedTransferCoin) {
      setTransferStatus("Star at least one coin to choose a transfer asset.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setTransferStatus("Enter a valid amount greater than zero.");
      return;
    }

    const symbol = selectedTransferCoin.symbol?.toUpperCase() || "COIN";
    const actionWord = direction === "send" ? "Sent" : "Requested";
    const preposition = direction === "send" ? "to" : "from";

    setTransferStatus(
      `${actionWord} ${amount.toLocaleString("en-US", {
        maximumFractionDigits: 6,
      })} ${symbol} ${preposition} ${transferRecipient.trim()}.`
    );
    setTransferAmount("");
  };

  const header = (
    <>
    <div className="brand-wrap">
      <div className="header-top">
        <div className="brand-head">
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Zm0 2.3 5.8 3.2L12 10.8 6.2 7.5 12 4.3Zm-6 5 5 2.9v6.5l-5-2.8V9.3Zm7 9.4v-6.5l5-2.9v6.6l-5 2.8Z" />
            </svg>
          </span>
          <h1>CoinPulse</h1>
          <div className="welcome-inline">
            <Banner />
          </div>
        </div>
        <section className="toolbar header-toolbar">
          <input
            className="search-input"
            type="search"
            placeholder="Discover by coin name or ticker"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="notification-btn"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={`Notifications (${notificationCount})`}
          >
            <span className="notification-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3a5 5 0 0 0-5 5v2.6c0 .5-.2 1-.5 1.4L5 14v1h14v-1l-1.5-2c-.3-.4-.5-.9-.5-1.4V8a5 5 0 0 0-5-5Zm0 19a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 22Z" />
              </svg>
            </span>
          </button>
          <div className="filter-refresh-wrap">
            <label className="sort-wrap" htmlFor="sortBy">
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
          </div>
        </section>
      </div>
    </div>
    </>
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
            <h2>Fast Action</h2>
           

            <label className="transfer-field" htmlFor="transferRecipient">
              <span>Recipient</span>
              <input
                id="transferRecipient"
                className="transfer-input"
                type="text"
                placeholder="Wallet address or username"
                value={transferRecipient}
                onChange={(event) => setTransferRecipient(event.target.value)}
              />
            </label>

            <label className="transfer-field" htmlFor="transferCoin">
              <span>Coin</span>
              <select
                id="transferCoin"
                className="transfer-input"
                value={transferCoinId}
                onChange={(event) => setTransferCoinId(event.target.value)}
                disabled={watchlistCoins.length === 0}
              >
                {watchlistCoins.length === 0 ? (
                  <option value="">Add coins to your watchlist</option>
                ) : (
                  watchlistCoins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.symbol.toUpperCase()} - {coin.name}
                    </option>
                  ))
                )}
              </select>
            </label>

            <label className="transfer-field" htmlFor="transferAmount">
              <span>Amount</span>
              <input
                id="transferAmount"
                className="transfer-input"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={transferAmount}
                onChange={(event) => setTransferAmount(event.target.value)}
              />
            </label>

            <div className="transfer-actions">
              <button
                className="primary-btn"
                type="button"
                onClick={() => handleTransferAction("send")}
                disabled={!selectedTransferCoin}
              >
                Send
              </button>
              <button
                className="ghost-btn"
                type="button"
                onClick={() => handleTransferAction("receive")}
                disabled={!selectedTransferCoin}
              >
                Receive
              </button>
            </div>

            {transferStatus && <p className="transfer-status">{transferStatus}</p>}
          </aside>
        </div>
      )}
    </MainLayout>
  );
}

export default App;
