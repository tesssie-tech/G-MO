import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTopCoins } from "../services/coingeckoApi";

export function useCoinData(autoRefreshMs = 60000) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const abortRef = useRef(null);

  const refetch = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setError("");
    setLoading(true);

    try {
      const marketData = await fetchTopCoins({ signal: controller.signal });
      setCoins(marketData);
      setLastUpdated(new Date());
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Something went wrong while fetching coins.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();

    if (!autoRefreshMs || autoRefreshMs <= 0) {
      return () => {
        if (abortRef.current) {
          abortRef.current.abort();
        }
      };
    }

    const intervalId = setInterval(refetch, autoRefreshMs);

    return () => {
      clearInterval(intervalId);
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [refetch, autoRefreshMs]);

  return {
    coins,
    loading,
    error,
    lastUpdated,
    refetch,
  };
}
