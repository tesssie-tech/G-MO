export function MainLayout({ header, sidebar, children }) {
  return (
    <div className="cp-shell">
      <header className="cp-header">{header}</header>
      <aside className="cp-sidebar">{sidebar}</aside>
      <main className="cp-main">{children}</main>
    </div>
  );
}
