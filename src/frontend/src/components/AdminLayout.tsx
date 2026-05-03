import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const GOLD = "#D4AF37";
const SIDEBAR_BG = "linear-gradient(180deg, #0d1554 0%, #111b6a 100%)";
const SIDEBAR_BORDER = "1px solid rgba(212,175,55,0.15)";

type NavItem = { label: string; to: string; icon: string };
type NavGroup = { title: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", to: "/admin", icon: "⬛" },
      { label: "Analytics", to: "/admin/analytics", icon: "📊" },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Products", to: "/admin/products", icon: "📦" },
      { label: "Categories", to: "/admin/categories", icon: "🏷️" },
      { label: "Gallery", to: "/admin/gallery", icon: "🖼️" },
      { label: "Gallery Folders", to: "/admin/gallery-folders", icon: "📁" },
      { label: "Email Campaigns", to: "/admin/email-campaigns", icon: "📧" },
      { label: "Blog", to: "/admin/blog", icon: "✍️" },
      { label: "Catalogues", to: "/admin/catalogue", icon: "📑" },
      { label: "Testimonials", to: "/admin/testimonials", icon: "⭐" },
      { label: "Pages (CMS)", to: "/admin/cms", icon: "📝" },
    ],
  },
  {
    title: "COMMERCE",
    items: [
      { label: "Orders", to: "/admin/orders", icon: "🛒" },
      { label: "Customers / CRM", to: "/admin/customers", icon: "👥" },
      { label: "Enquiries", to: "/admin/inquiries", icon: "📨" },
      { label: "Marketing", to: "/admin/marketing", icon: "📣" },
      { label: "Country Settings", to: "/admin/country-settings", icon: "🌍" },
      { label: "Logistics", to: "/admin/logistics", icon: "🚚" },
      { label: "Payments", to: "/admin/payments", icon: "💳" },
      { label: "Automation", to: "/admin/automation", icon: "⚡" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Website Settings", to: "/admin/website-settings", icon: "🌐" },
      { label: "Settings", to: "/admin/settings", icon: "⚙️" },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("adminSession");
    navigate("/admin/login");
    onNavClick?.();
  };

  const isActive = (to: string) =>
    to === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(to);

  return (
    <>
      <div
        className="p-5 flex items-center gap-3 flex-shrink-0"
        style={{ borderBottom: SIDEBAR_BORDER }}
      >
        <img
          src="/assets/uploads/logo-removebg-preview-1-1.png"
          alt="Gemora Global"
          className="h-8 object-contain"
        />
        <span
          style={{
            color: GOLD,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.05em",
          }}
        >
          GEMORA ADMIN
        </span>
      </div>

      <nav className="flex-1 p-2 flex flex-col gap-0 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-2">
            <p
              className="px-3 py-1.5 text-[10px] font-bold tracking-widest"
              style={{ color: "rgba(212,175,55,0.45)" }}
            >
              {group.title}
            </p>
            {group.items.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavClick}
                  className="flex items-center gap-3 px-3 rounded-lg text-sm transition-all"
                  style={{
                    minHeight: 40,
                    background: active
                      ? "linear-gradient(90deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 100%)"
                      : "transparent",
                    color: active ? GOLD : "rgba(255,255,255,0.6)",
                    borderLeft: active
                      ? `3px solid ${GOLD}`
                      : "3px solid transparent",
                    fontWeight: active ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "rgba(212,175,55,0.08)";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "rgba(255,255,255,0.9)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "rgba(255,255,255,0.6)";
                    }
                  }}
                >
                  <span style={{ fontSize: 14, minWidth: 18 }}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 flex-shrink-0" style={{ borderTop: SIDEBAR_BORDER }}>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(212,175,55,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.35)";
          }}
          data-ocid="admin.logout_button"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentLabel =
    ALL_NAV_ITEMS.find((n) =>
      n.to === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(n.to),
    )?.label ?? "Admin";

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#0a0f3c", color: "#fff" }}
    >
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0"
        style={{
          width: 240,
          background: SIDEBAR_BG,
          borderRight: SIDEBAR_BORDER,
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {drawerOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop overlay
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className="lg:hidden fixed top-0 left-0 z-50 flex flex-col h-full overflow-y-auto"
        style={{
          width: 260,
          background: SIDEBAR_BG,
          borderRight: SIDEBAR_BORDER,
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        aria-label="Admin navigation"
      >
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-sm z-10"
          style={{
            background: "rgba(212,175,55,0.15)",
            color: GOLD,
            border: "1px solid rgba(212,175,55,0.3)",
          }}
          aria-label="Close navigation"
        >
          ✕
        </button>
        <SidebarContent onNavClick={() => setDrawerOpen(false)} />
      </aside>

      {/* Main content */}
      <main
        className="flex-1 overflow-auto min-w-0"
        style={{ background: "#f4f6ff" }}
      >
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6"
          style={{
            height: 56,
            background: "linear-gradient(90deg, #1A237E 0%, #1a2e9a 100%)",
            borderBottom: "1px solid rgba(212,175,55,0.2)",
            boxShadow: "0 2px 12px rgba(26,35,126,0.3)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex flex-col gap-1 p-1.5 rounded-md flex-shrink-0"
              style={{ color: "rgba(255,255,255,0.9)" }}
              aria-label="Open navigation"
              data-ocid="admin.hamburger_button"
            >
              <span className="block w-5 h-0.5 bg-current rounded" />
              <span className="block w-5 h-0.5 bg-current rounded" />
              <span className="block w-5 h-0.5 bg-current rounded" />
            </button>
            <h1
              className="truncate"
              style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}
            >
              <span style={{ color: GOLD, marginRight: 8 }}>◆</span>
              {currentLabel}
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              placeholder="Search..."
              className="hidden sm:block px-3 py-1.5 rounded-lg text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(212,175,55,0.35)",
                color: "rgba(255,255,255,0.9)",
                width: 140,
              }}
              data-ocid="admin.search_input"
            />
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: GOLD, color: "#1A237E" }}
            >
              A
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
