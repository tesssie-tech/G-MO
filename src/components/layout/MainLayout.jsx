export function MainLayout({
  header,
  sidebar,
  children,
  sidebarOpen,
}) {
  return (
    <div className={`cp-shell ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <header className="cp-header">{header}</header>
      <aside
        id="site-side-nav"
        className={`cp-sidebar ${sidebarOpen ? "open" : "closed"}`}
      >
        {sidebar}
      </aside>
      <main className="cp-main">{children}</main>
    </div>
  );
}
