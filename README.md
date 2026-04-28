# CoinPulse

CoinPulse is a professional frontend crypto dashboard built with React and the CoinGecko API. The app focuses on real market data, clear information hierarchy, responsive behavior, and polished micro-interactions.

## Live Product Goals

- Display the top 50 cryptocurrencies by market cap in a clean, scannable dashboard.
- Help users spot trends quickly through visual feedback and structured table/card layouts.
- Let users personalize the experience with a persisted watchlist.
- Demonstrate interview-level frontend architecture and product thinking.

## Tech Stack

- React (Create React App)
- JavaScript (ES6+)
- CSS (custom responsive theme)
- CoinGecko REST API
- LocalStorage for client persistence

## Core Features

- Top 50 coins fetched from CoinGecko with market-cap sorting.
- Loading, error, and manual retry states.
- Auto-refresh data cycle for fresher market context.
- Search by coin name or symbol.
- Sort options for market cap, price, and 24h change.
- Responsive market table (desktop) and card layout (mobile).
- Watchlist with persistence across browser sessions.
- Micro-interactions for price updates, watchlist toggles, and loading states.

## Architecture

The project is split by responsibility so features remain easy to maintain and scale.

```text
src/
  components/
	 common/
		ErrorState.jsx
		Loader.jsx
	 dashboard/
		CoinRow.jsx
		CoinTable.jsx
		MarketStatsCards.jsx
	 layout/
		MainLayout.jsx
	 watchlist/
		WatchlistPanel.jsx
  hooks/
	 useCoinData.js
	 useWatchlist.js
  services/
	 coingeckoApi.js
  utils/
	 formatters.js
  App.js
  App.css
```

### Why this structure

- Components focus on rendering and interaction.
- Hooks focus on stateful business logic.
- Services isolate API concerns and keep fetch details reusable.
- Utilities centralize formatting logic and avoid repeated code.

This separation makes the app easier to test, extend, and explain in interviews.

## Essential Components

1. MainLayout
	- Provides the app shell with header, sidebar, and main content.
	- Keeps page-level structure consistent.

2. MarketStatsCards
	- Shows high-level market summary metrics for fast context.
	- Adds information hierarchy before deep table scanning.

3. CoinTable
	- Main data visualization for desktop users.
	- Supports high-density financial data presentation.

4. CoinRow
	- Renders per-coin details and watchlist actions.
	- Handles price movement micro-interactions.

5. WatchlistPanel
	- Displays user favorites and supports quick clearing.
	- Drives personalization and repeat utility.

## Custom Hooks and Technical Logic

### useCoinData

Purpose:
- Fetches top-50 market data.
- Exposes loading, error, and last-updated metadata.
- Supports refetch and periodic refresh.

Key logic decisions:
- Uses AbortController to cancel in-flight requests and avoid stale updates.
- Keeps async logic out of UI components to improve reusability.
- Exposes a refetch function for manual refresh and retry actions.

Interview explanation:
- This hook separates data orchestration from presentation, which reduces component complexity and improves testability.
- Abort handling prevents race conditions when users trigger multiple refreshes or navigate quickly.
- Explicit loading and error states model real-world network behavior rather than only happy-path rendering.

### useWatchlist

Purpose:
- Stores favorite coin IDs in LocalStorage.
- Returns helper methods to toggle and clear favorites.

Key logic decisions:
- Uses lazy initial state so LocalStorage is read once on mount.
- Persists updates in a side effect whenever watchlist changes.
- Uses Set-based checks for fast favorite lookups while rendering rows.

Interview explanation:
- This hook demonstrates state persistence and client-side personalization without backend complexity.
- Defensive parsing avoids crashes from malformed storage payloads.
- Lookup optimization keeps rendering responsive as data scales.

## API Design

Endpoint used:
- /coins/markets

Primary query settings:
- vs_currency=usd
- order=market_cap_desc
- per_page=50
- page=1
- sparkline=true
- price_change_percentage=24h,7d

Why:
- These parameters provide enough context for a dashboard: ranking, trend changes, valuation, and mini trend signal support.

## UI and UX System

### Color Palette (Dark Premium)

- #E7C0BB (primary text)
- #360808 (base background)
- #8C3C47 (elevated surfaces)
- #DA7E8B (secondary surfaces)
- #EC9EAB (accent and actions)
- #E2CDCF (secondary text)

Applied strategy:
- Deep base with warm highlights for a distinct finance-brand feel.
- Accessible text hierarchy with primary and secondary shades.
- Semantic positive/negative colors reserved for market direction.

### Responsive Data Layout

Desktop:
- Sticky table header for long-scroll usability.
- Structured columns for rank, identity, price, changes, market cap, and watch controls.

Tablet:
- Reduced visual density while preserving key market indicators.

Mobile:
- Table rows switch to card-style blocks for readability.
- Core values remain visible without horizontal scrolling.

### Micro-Interactions

- Row flash on price updates (up/down direction).
- Percentage pulse effect on change values.
- Watchlist button pop animation on toggle.
- Skeleton shimmer during loading.

Why this matters:
- Animation is used to improve decision speed, not just decoration.
- Users can identify meaningful updates quickly in volatile market views.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm start
```

Open http://localhost:3000.

### 3. Run tests

```bash
npm test
```

### 4. Build for production

```bash
npm run build
```

## Scripts

- npm start: Runs the app in development mode.
- npm test: Runs test suite in watch mode.
- npm run build: Generates optimized production output.
- npm run eject: Exposes CRA tooling configuration (one-way operation).

## Interview-Ready Talking Points

1. Architecture
	- Clear separation between rendering, state logic, and external I/O.

2. Reliability
	- Loading/error/retry patterns and request cancellation for resilient UX.

3. Performance
	- Efficient local lookup patterns and focused rendering responsibilities.

4. Product thinking
	- Information hierarchy for traders: overview cards, searchable table, personalized watchlist.

5. UX maturity
	- Purposeful micro-interactions that highlight meaningful market change.

## Roadmap Ideas

- Add sparkline chart rendering in each row.
- Add pagination or virtualization for larger datasets.
- Add coin detail page with historical chart ranges.
- Add currency selector and portfolio simulation.
- Add unit tests for hooks and integration tests for watchlist behavior.

## License

This project is for portfolio and educational demonstration.

## Recent changes

- Replaced the default React favicon with the app brand (`public/brand-logo.svg`).
- Added an inline welcome banner in the header that reads `localStorage.username` (falls back to "Guest").
- Reworked the side navigation: removed the separate expand/collapse button, made the Panorama item toggle the nav, and unified item styling.
- Replaced the theme icon with an accessible sliding on/off switch that toggles light/dark mode.

To set the username shown in the banner open the browser console and run:

```js
localStorage.setItem('username', 'Your Name');
location.reload();
```

If you recently pulled changes and the favicon doesn't update, hard-refresh the page (Ctrl+F5) to clear the browser cache.
