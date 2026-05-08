import api from '../../lib/api';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import type { Inquiry, Product } from "../../types";

const BOX = {
  background: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: 12,
  padding: 20,
} as const;

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "rgba(66,165,245,0.15)", color: "#1A237E" },
  Processing: { bg: "rgba(100,150,255,0.15)", color: "#6b9fff" },
  Shipped: { bg: "rgba(180,100,255,0.15)", color: "#c084fc" },
  Delivered: { bg: "rgba(100,220,150,0.15)", color: "#2e7d32" },
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.getStats(),
    enabled: true,
  });

  const { data: rawInquiries } = useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: () => api.getInquiries(),
    enabled: true,
  });
  const inquiries = Array.isArray(rawInquiries) ? rawInquiries : ((rawInquiries as any)?.items || []);

  const { data: productsRes } = useQuery({
    queryKey: ["products", null],
    queryFn: () => api.getProducts({page:'0',pageSize:'2000'}),
    enabled: true,
  });
  const products = Array.isArray(productsRes?.items) ? productsRes.items : (Array.isArray(productsRes) ? productsRes : []);

  const orders = (() => {
    try {
      const s = localStorage.getItem("gemora_orders");
      if (!s) return [];
      const parsed = JSON.parse(s);
      return Array.isArray(parsed) ? (parsed as Array<{ status: string }>) : [];
    } catch {
      return [];
    }
  })();

  const ordersByStatus = orders.reduce(
    (acc: Record<string, number>, o: { status: string }) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const recentInquiries = (inquiries ?? []).slice(0, 5);

  const countryMap: Record<string, number> = {};
  for (const inq of inquiries ?? []) {
    if (inq.country)
      countryMap[inq.country] = (countryMap[inq.country] ?? 0) + 1;
  }
  const countryRows = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const statCards = [
    {
      label: "Total Products",
      value: stats ? String(stats.totalProducts) : "—",
      link: "/admin/products",
      color: "#1A237E",
      icon: "📦",
    },
    {
      label: "Total Inquiries",
      value: stats ? String(stats.totalInquiries) : "—",
      link: "/admin/inquiries",
      color: "#2e7d32",
      icon: "📨",
    },
    {
      label: "New Inquiries",
      value: stats ? String(stats.newInquiries) : "—",
      link: "/admin/inquiries",
      color: "#e65100",
      icon: "🔔",
    },
    {
      label: "Total Visits",
      value: stats ? String(stats.totalVisits) : "—",
      link: "/admin/analytics",
      color: "#42A5F5",
      icon: "👁️",
    },
    {
      label: "Active Orders",
      value: String(orders.length),
      link: "/admin/orders",
      color: "#7B1FA2",
      icon: "🛒",
    },
    {
      label: "Blog Posts",
      value: stats
        ? String(
            (stats as unknown as { totalBlogPosts?: bigint }).totalBlogPosts ??
              0,
          )
        : "—",
      link: "/admin/blog",
      color: "#00838f",
      icon: "✍️",
    },
  ];

  const pipelineStatuses = ["Pending", "Processing", "Shipped", "Delivered"];

  return (
    <AdminLayout>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: "Add Product", to: "/admin/products", color: "#1A237E" },
          { label: "View Inquiries", to: "/admin/inquiries", color: "#2e7d32" },
          { label: "Add Blog Post", to: "/admin/blog", color: "#e65100" },
          { label: "Add Order", to: "/admin/orders", color: "#7B1FA2" },
        ].map((a) => (
          <button
            key={a.to}
            type="button"
            onClick={() => navigate(a.to)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: a.color }}
            data-ocid="admin.dashboard.quick_action_button"
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        {statCards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => navigate(card.link)}
            className="text-left rounded-xl p-4 transition-all hover:shadow-md"
            style={{ background: "#fff", border: "1px solid #e0e0e0" }}
            data-ocid="admin.dashboard.stat_card"
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 20 }}>{card.icon}</span>
            </div>
            <p style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>
              {card.label}
            </p>
            <p
              style={{
                color: card.color,
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {card.value}
            </p>
          </button>
        ))}
      </div>

      {/* Orders Pipeline + Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Orders Pipeline */}
        <div style={BOX}>
          <h3 className="font-semibold mb-4" style={{ color: "#1A237E" }}>
            Orders Pipeline
          </h3>
          {pipelineStatuses.map((status) => {
            const count = ordersByStatus[status] ?? 0;
            const maxCount = Math.max(
              ...pipelineStatuses.map((s) => ordersByStatus[s] ?? 0),
              1,
            );
            return (
              <div key={status} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#444" }}
                  >
                    {status}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={
                      STATUS_COLORS[status] ?? {
                        background: "#f5f7ff",
                        color: "#666",
                      }
                    }
                  >
                    {count}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ background: "#e8eaf6" }}
                >
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(count / maxCount) * 100}%`,
                      background: STATUS_COLORS[status]?.color ?? "#c5cae9",
                    }}
                  />
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="mt-3 text-xs font-medium"
            style={{ color: "#42A5F5" }}
          >
            View all orders →
          </button>
        </div>

        {/* Recent Inquiries */}
        <div style={{ ...BOX, gridColumn: "span 2" }}>
          <h3 className="font-semibold mb-4" style={{ color: "#1A237E" }}>
            Recent Enquiries
          </h3>
          <div className="overflow-x-auto">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 320,
              }}
            >
              <thead>
                <tr>
                  {["Name", "Country", "Requirement", "Status"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "6px 8px",
                        color: "#999",
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentInquiries.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-sm"
                      style={{ color: "#aaa" }}
                      data-ocid="admin.inquiries.empty_state"
                    >
                      No enquiries yet
                    </td>
                  </tr>
                )}
                {recentInquiries.map((inq, i) => (
                  <tr
                    key={String(inq.id)}
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                    data-ocid={`admin.dashboard.inquiry.item.${i + 1}`}
                  >
                    <td
                      style={{
                        padding: "8px",
                        fontSize: 13,
                        color: "#333",
                        fontWeight: 500,
                      }}
                    >
                      {inq.name}
                    </td>
                    <td style={{ padding: "8px", fontSize: 12, color: "#666" }}>
                      {inq.country}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        fontSize: 12,
                        color: "#888",
                        maxWidth: 180,
                      }}
                    >
                      <span className="truncate block">
                        {inq.requirement.slice(0, 50)}
                        {inq.requirement.length > 50 ? "…" : ""}
                      </span>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <span
                        style={{
                          background:
                            inq.status === "new"
                              ? "rgba(66,165,245,0.15)"
                              : "rgba(100,200,100,0.15)",
                          color: inq.status === "new" ? "#1A237E" : "#2e7d32",
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontWeight: 600,
                        }}
                      >
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/inquiries")}
            className="mt-3 text-xs font-medium"
            style={{ color: "#42A5F5" }}
          >
            View all enquiries →
          </button>
        </div>
      </div>

      {/* Country Performance + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div style={BOX}>
          <h3 className="font-semibold mb-4" style={{ color: "#1A237E" }}>
            Country Performance (Inquiries)
          </h3>
          {countryRows.length === 0 ? (
            <p
              className="text-sm text-center py-8"
              style={{ color: "#aaa" }}
              data-ocid="admin.dashboard.country.empty_state"
            >
              No inquiry data yet
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Country", "Inquiries", "Share"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "6px 8px",
                        color: "#999",
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {countryRows.map(([country, count], i) => {
                  const total = (inquiries ?? []).length || 1;
                  return (
                    <tr
                      key={country}
                      style={{ borderBottom: "1px solid #f5f5f5" }}
                      data-ocid={`admin.dashboard.country.item.${i + 1}`}
                    >
                      <td
                        style={{ padding: "8px", fontSize: 13, color: "#333" }}
                      >
                        {country}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          fontSize: 13,
                          color: "#1A237E",
                          fontWeight: 600,
                        }}
                      >
                        {count}
                      </td>
                      <td
                        style={{ padding: "8px", fontSize: 12, color: "#888" }}
                      >
                        {((count / total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div style={BOX}>
          <h3 className="font-semibold mb-4" style={{ color: "#1A237E" }}>
            Products Overview
          </h3>
          <div className="overflow-x-auto">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 300,
              }}
            >
              <thead>
                <tr>
                  {["Product Name", "SKU", "Featured"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "6px 8px",
                        color: "#999",
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(products ?? []).length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-sm"
                      style={{ color: "#aaa" }}
                      data-ocid="admin.products.empty_state"
                    >
                      No products yet
                    </td>
                  </tr>
                )}
                {(products ?? []).slice(0, 5).map((p, i) => (
                  <tr
                    key={String(p.id)}
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                    data-ocid={`admin.products.item.${i + 1}`}
                  >
                    <td
                      style={{
                        padding: "8px",
                        fontSize: 13,
                        color: "#222",
                        fontWeight: 500,
                      }}
                    >
                      {p.name}
                    </td>
                    <td style={{ padding: "8px", fontSize: 12, color: "#888" }}>
                      {p.sku || "—"}
                    </td>
                    <td style={{ padding: "8px" }}>
                      {p.featured ? (
                        <span
                          style={{
                            background: "rgba(212,175,55,0.15)",
                            color: "#b8860b",
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 20,
                            fontWeight: 600,
                          }}
                        >
                          Yes
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="mt-3 text-xs font-medium"
            style={{ color: "#42A5F5" }}
          >
            Manage all products →
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
