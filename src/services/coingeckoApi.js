const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export async function fetchTopCoins({ signal } = {}) {
  const params = new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: "50",
    page: "1",
    sparkline: "true",
    price_change_percentage: "24h,7d",
  });

  const response = await fetch(
    `${COINGECKO_BASE_URL}/coins/markets?${params.toString()}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load coin market data right now.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
