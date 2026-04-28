const navItems = [
  {
    href: "#overview",
    label: "Panorama",
    key: "overview",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13h7v7H4v-7Zm9-9h7v16h-7V4ZM4 4h7v7H4V4Z" />
      </svg>
    ),
  },
  {
    href: "#market-stats",
    label: "Pulse Metrics",
    key: "stats",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 20h14v-2H5v2ZM7 16h2V9H7v7Zm4 0h2V4h-2v12Zm4 0h2v-5h-2v5Z" />
      </svg>
    ),
  },
  {
    href: "#coin-table",
    label: "Market Ledger",
    key: "table",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4V5Zm2 2v3h12V7H6Zm0 5v5h3v-5H6Zm5 0v5h7v-5h-7Z" />
      </svg>
    ),
  },
  {
    href: "#watchlist",
    label: "Starred Vault",
    key: "watchlist",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 17.3-6.2 3.7L7.4 14 2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.4 4.8 1.6 7-6.2-3.7Z" />
      </svg>
    ),
  },
  {
    href: "#profile",
    label: "Identity",
    key: "profile",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.2 0-8 2.1-8 5v1h16v-1c0-2.9-3.8-5-8-5Z" />
      </svg>
    ),
  },
  {
    href: "#messages",
    label: "Dispatches",
    key: "messages",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16v11H7l-3 3V4Zm2 2v7.2L6.2 13H18V6H6Z" />
      </svg>
    ),
  },
  {
    href: "#settings",
    label: "Studio Settings",
    key: "settings",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m19.4 13 .1-1-.1-1 2-1.6-2-3.4-2.3 1a7.6 7.6 0 0 0-1.7-1L15 3h-6l-.4 3a7.6 7.6 0 0 0-1.7 1l-2.3-1-2 3.4L4.6 11l-.1 1 .1 1-2 1.6 2 3.4 2.3-1a7.6 7.6 0 0 0 1.7 1L9 21h6l.4-3a7.6 7.6 0 0 0 1.7-1l2.3 1 2-3.4-2-1.6ZM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
      </svg>
    ),
  },
];

export function SideNav({
  watchlistCount,
  isOpen,
  themeMode,
  onToggle,
  onToggleTheme,
  onNavigate,
}) {
  return (
    <nav className="side-nav" aria-label="Primary">
      <div className="side-nav-main" aria-label="Primary navigation">
        <ul className="side-nav-list">
          {navItems.map((item) => (
            <li key={item.key}>
              {item.key === "overview" ? (
                <button
                  type="button"
                  className="side-nav-overview-btn"
                  onClick={() => {
                    onToggle();
                    try {
                      window.location.hash = item.href;
                    } catch (e) {}
                  }}
                  aria-pressed={isOpen}
                  title={isOpen ? undefined : item.label}
                  aria-label={isOpen ? undefined : item.label}
                >
                  <span className="side-nav-icon">{item.icon}</span>
                  <span className="side-nav-text">{item.label}</span>
                </button>
              ) : (
                <a
                  href={item.href}
                  onClick={onNavigate}
                  title={isOpen ? undefined : item.label}
                  aria-label={isOpen ? undefined : item.label}
                >
                  <span className="side-nav-icon">{item.icon}</span>
                  <span className="side-nav-text">
                    {item.label}
                    {item.key === "watchlist" ? ` (${watchlistCount})` : ""}
                  </span>
                </a>
              )}
            </li>
          ))}
        </ul>
   
      </div>
      <div className="side-nav-appearance" aria-label="Appearance controls">
        <p className="side-nav-label">Appearance</p>
        <button
          className="theme-switch-btn"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
          role="switch"
          aria-checked={themeMode !== "dark"}
        >
          <span className={`switch ${themeMode === "dark" ? "off" : "on"}`} aria-hidden="true">
            <span className="switch-thumb" />
          </span>
          <span className="theme-switch-text">
            {themeMode === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </nav>
  );
}
