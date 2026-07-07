import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/jobs", label: "Job search" },
  { to: "/duplicates", label: "Duplicate review" },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-100 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-mono text-sm font-semibold tracking-tight text-ink-800">
            job-portal <span className="text-signal-500">console</span>
          </span>
          <nav className="flex gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium ${
                    isActive
                      ? "bg-signal-100 text-signal-600"
                      : "text-ink-500 hover:bg-ink-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
