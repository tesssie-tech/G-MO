import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "coinpulse_watchlist_v1";

function readStoredWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(readStoredWatchlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const watchlistSet = useMemo(() => new Set(watchlist), [watchlist]);

  const isFavorite = (coinId) => watchlistSet.has(coinId);

  const toggleWatchlist = (coinId) => {
    setWatchlist((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    );
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return {
    watchlist,
    isFavorite,
    toggleWatchlist,
    clearWatchlist,
  };
}
