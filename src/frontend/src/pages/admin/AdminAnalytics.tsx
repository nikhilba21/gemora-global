import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { useActor } from "../../hooks/useActor";
import type { Inquiry, Product } from "../../types";

const BOX = {
  background: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: 12,
  padding: 20,
} as const;
const CARD = {
  background: "linear-gradient(145deg, #e8eaf6, #fff)",
  border: "1px solid #c5cae9",
  borderRadius: 12,
  padding: 20,
} as const;

export default function AdminAnalytics() {
  const { actor } = useActor();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => actor!.getDashboardStats(),
    enabled: !!actor,
  });

  const { data: inquiries } = useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: () => actor!.getInquiries(),
    enabled: !!actor,
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["products", null],
    queryFn: () => actor!.getProducts([] as unknown as bigint),
    enabled: !!actor,
  });

  const totalInquiries = Number(
    stats?.totalInquiries ?? inquiries?.length ?? 0,
  );
  const totalProducts = Number(stats?.totalProducts ?? products?.length ?? 0);
  const totalVisits = Number(stats?.totalVisits ?? 0);
  const newInquiries = Number(stats?.newInquiries ?? 0);

  // Country breakdown from real inquiries
  const countryMap: Record<string, number> = {};
  for (const inq of inquiries ?? []) {
    if (inq.country)
      countryMap[inq.country] = (countryMap[inq.country] ?? 0) + 1;
  }
  const countryData = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxCountry =
    countryData.length > 0 ? Math.max(...countryData.map(([, v]) => v)) : 1;

  // Status breakdown
  const statusMap: Record<string, number> = {};
  for (const inq of inquiries ?? []) {
    statusMap[inq.status] = (statusMap[inq.status] ?? 0) + 1;
  }

  // Monthly inquiry data
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthMap: Record<string, number> = {};
  for (const inq of inquiries ?? []) {
    const ts = Number(inq.createdAt ?? 0n) * 1000;
    const d = new Date(ts);
    if (!Number.isNaN(d.getTime())) {
      const key = MONTHS[d.getMonth()];
      monthMap[key] = (monthMap[key] ?? 0) + 1;
    }
  }
  const monthlyData = MONTHS.map((m) => ({
    month: m,
    count: monthMap[m] ?? 0,
  })).filter((m) => m.count > 0);
  const maxMonth =
    monthlyData.length > 0 ? Math.max(...monthlyData.map((m) => m.count)) : 1;

  // Conversion rate
  const conversionRate =
    totalVisits > 0
      ? ((totalInquiries / totalVisits) * 100).toFixed(2)
      : "0.00";

  const exportCSV = () => {
    const rows = [["Metric", "Value"]];
    rows.push(["Total Inquiries", String(totalInquiries)]);
    rows.push(["New Inquiries", String(newInquiries)]);
    rows.push(["Total Products", String(totalProducts)]);
    rows.push(["Total Visits", String(totalVisits)]);
    rows.push(["Conversion Rate", `${conversionRate}%`]);
    for (const [country, count] of countryData)
      rows.push([country, String(count)]);
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gemora_analytics.csv";
    a.click();
  };

  return (
    <AdminLayout>
      {/* GA Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A237E, #283593)",
          borderRadius: 12,
          padding: "14px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <p
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 2,
            }}
          >
            📊 Full Analytics Dashboard
          </p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
            View live traffic, user behaviour, and conversion data in Google
            Analytics
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            href="https://analytics.google.com/analytics/web/#/p/G-QNL80LE10N"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#D4AF37",
              color: "#1A237E",
              fontWeight: 700,
              fontSize: 13,
              padding: "8px 16px",
              borderRadius: 8,
              textDecoration: "none",
            }}
            data-ocid="analytics.ga_link"
          >
            <ExternalLink size={14} /> Open Google Analytics
          </a>
          <button
            type="button"
            onClick={exportCSV}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
            data-ocid="analytics.export_button"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {[
          {
            label: "Total Inquiries",
            value: totalInquiries,
            sub: `${newInquiries} new`,
            color: "#1A237E",
          },
          {
            label: "Total Products",
            value: totalProducts,
            sub: "In catalogue",
            color: "#2e7d32",
          },
          {
            label: "Site Visits",
            value: totalVisits > 0 ? totalVisits.toLocaleString() : "—",
            sub: "Tracked",
            color: "#42A5F5",
          },
          {
            label: "New Inquiries",
            value: newInquiries,
            sub: "Pending response",
            color: "#e65100",
          },
          {
            label: "Conversion Rate",
            value: `${conversionRate}%`,
            sub: "Visits → Inquiries",
            color: "#7B1FA2",
          },
        ].map((card) => (
          <div
            key={card.label}
            style={CARD}
            data-ocid={`analytics.${card.label.toLowerCase().replace(/ /g, "_")}_card`}
          >
            <p style={{ color: "#666", fontSize: 11, marginBottom: 6 }}>
              {card.label}
            </p>
            <p
              style={{
                color: card.color,
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {card.value}
            </p>
            <p style={{ color: "#888", fontSize: 11 }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Country Bar Chart — CSS bars, no library */}
        <div style={BOX}>
          <h3 style={{ color: "#1A237E", marginBottom: 4, fontWeight: 600 }}>
            Inquiries by Country
          </h3>
          <p style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>
            Based on inquiry origin data
          </p>
          {countryData.length === 0 ? (
            <p
              style={{
                color: "#aaa",
                fontSize: 13,
                textAlign: "center",
                paddingTop: 40,
              }}
              data-ocid="analytics.country.empty_state"
            >
              No inquiry data yet
            </p>
          ) : (
            <div className="space-y-2">
              {countryData.map(([country, count]) => (
                <div key={country}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span
                      style={{ fontSize: 12, color: "#444", fontWeight: 500 }}
                    >
                      {country}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#1A237E",
                        fontWeight: 700,
                      }}
                    >
                      {count}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: "#e8eaf6",
                      borderRadius: 4,
                    }}
                  >
                    <div
                      style={{
                        height: 8,
                        background: "#42A5F5",
                        borderRadius: 4,
                        width: `${(count / maxCountry) * 100}%`,
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Inquiries */}
        <div style={BOX}>
          <h3 style={{ color: "#1A237E", marginBottom: 4, fontWeight: 600 }}>
            Monthly Inquiries
          </h3>
          <p style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>
            {monthlyData.length > 0
              ? "Live data from backend"
              : "No inquiry data yet"}
          </p>
          {monthlyData.length === 0 ? (
            <p
              style={{
                color: "#aaa",
                fontSize: 13,
                textAlign: "center",
                paddingTop: 40,
              }}
              data-ocid="analytics.monthly.empty_state"
            >
              Inquiry data will appear once buyers submit inquiries.
            </p>
          ) : (
            <div className="flex items-end gap-1" style={{ height: 120 }}>
              {monthlyData.map((m) => (
                <div
                  key={m.month}
                  className="flex-1 flex flex-col items-center gap-0.5"
                  title={`${m.month}: ${m.count}`}
                >
                  <div
                    style={{
                      width: "100%",
                      background: "#42A5F5",
                      borderRadius: "3px 3px 0 0",
                      height: `${(m.count / maxMonth) * 100}px`,
                      minHeight: 4,
                      transition: "height 0.4s",
                    }}
                  />
                  <span style={{ fontSize: 9, color: "#888" }}>
                    {m.month.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Breakdown + Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Inquiry Status */}
        <div style={BOX}>
          <h3 style={{ color: "#1A237E", marginBottom: 12, fontWeight: 600 }}>
            Inquiries by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(statusMap).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: status === "new" ? "#42A5F5" : "#2e7d32",
                    }}
                  />
                  <span style={{ fontSize: 13, color: "#444" }}>{status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 80,
                      height: 6,
                      background: "#e8eaf6",
                      borderRadius: 3,
                    }}
                  >
                    <div
                      style={{
                        height: 6,
                        background: status === "new" ? "#42A5F5" : "#2e7d32",
                        borderRadius: 3,
                        width: `${(count / totalInquiries) * 100}%`,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      color: "#1A237E",
                      fontWeight: 700,
                      minWidth: 24,
                      textAlign: "right",
                    }}
                  >
                    {count}
                  </span>
                </div>
              </div>
            ))}
            {Object.keys(statusMap).length === 0 && (
              <p
                style={{ color: "#aaa", fontSize: 13 }}
                data-ocid="analytics.status.empty_state"
              >
                No data
              </p>
            )}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div style={BOX}>
          <h3 style={{ color: "#1A237E", marginBottom: 12, fontWeight: 600 }}>
            Conversion Funnel
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Total Visits",
                value: totalVisits,
                color: "#42A5F5",
                pct: 100,
              },
              {
                label: "Total Inquiries",
                value: totalInquiries,
                color: "#1A237E",
                pct: totalVisits > 0 ? (totalInquiries / totalVisits) * 100 : 0,
              },
              {
                label: "New (Pending)",
                value: newInquiries,
                color: "#e65100",
                pct: totalVisits > 0 ? (newInquiries / totalVisits) * 100 : 0,
              },
            ].map((step) => (
              <div key={step.label}>
                <div className="flex justify-between mb-1">
                  <span
                    style={{ fontSize: 12, color: "#444", fontWeight: 500 }}
                  >
                    {step.label}
                  </span>
                  <span
                    style={{ fontSize: 12, color: step.color, fontWeight: 700 }}
                  >
                    {step.value > 0 ? step.value.toLocaleString() : "—"} (
                    {step.pct.toFixed(1)}%)
                  </span>
                </div>
                <div
                  style={{ height: 10, background: "#e8eaf6", borderRadius: 5 }}
                >
                  <div
                    style={{
                      height: 10,
                      background: step.color,
                      borderRadius: 5,
                      width: `${Math.min(step.pct, 100)}%`,
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: "#aaa", fontSize: 11, marginTop: 12 }}>
            GA4 property: G-QNL80LE10N ·{" "}
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#42A5F5" }}
            >
              View full analytics →
            </a>
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
