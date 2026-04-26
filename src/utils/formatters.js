export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value ?? 0);
}

export function formatCompactCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export function formatPercent(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return "-";
  }
  return `${numeric >= 0 ? "+" : ""}${numeric.toFixed(2)}%`;
}
