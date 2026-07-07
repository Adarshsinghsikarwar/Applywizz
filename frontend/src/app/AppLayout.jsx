import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/jobs", label: "Job search" },
  { to: "/duplicates", label: "Duplicate review" },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-50 to-white/30 text-ink-800 selection:bg-signal-100 selection:text-signal-600">
      {/* Sticky glassmorphic navbar */}
      <header className="sticky top-0 z-50 border-b border-ink-100/60 bg-white/75 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-signal-400 to-signal-600 shadow-md shadow-signal-500/10">
              <svg className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-mono text-sm font-bold tracking-tight text-ink-900">
              apply<span className="text-signal-500">wizz</span>
              <span className="ml-1.5 rounded-md bg-ink-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-ink-600 uppercase">
                console
              </span>
            </span>
          </div>

          <nav className="flex gap-1.5">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-signal-50 text-signal-600 shadow-sm shadow-signal-500/5"
                      : "text-ink-500 hover:bg-ink-100/50 hover:text-ink-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main layout container with decorative top light leak */}
      <div className="relative overflow-hidden">
        {/* Soft emerald light leak background */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-signal-400/5 blur-[120px]" />
        
        <main className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
