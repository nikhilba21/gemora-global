import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const PAGES = [
  {
    id: "home",
    name: "Homepage",
    title: "Best Imitation Jewellery Exporter India | Gemora Global",
    description:
      "Gemora Global — India's leading imitation jewellery manufacturer. Wholesale pricing, MOQ from 50 units. Shipping to UAE, France, USA, UK & Europe.",
  },
  {
    id: "products",
    name: "Products",
    title: "Imitation Jewellery Wholesale Catalogue | Gemora",
    description:
      "Browse 500+ wholesale imitation jewellery designs — necklaces, earrings, bangles, bridal sets. Factory-direct prices, MOQ 50 units.",
  },
  {
    id: "wholesale",
    name: "Wholesale",
    title: "Wholesale Imitation Jewellery India MOQ | Gemora",
    description:
      "Wholesale imitation jewellery direct from India. MOQ 50 units. B2B pricing, anti-tarnish, global shipping.",
  },
  {
    id: "about",
    name: "About",
    title: "About Gemora Global | Jewellery Exporter Jaipur",
    description:
      "Gemora Global is a leading Jaipur-based imitation jewellery manufacturer and exporter, established 2011.",
  },
  {
    id: "contact",
    name: "Contact",
    title: "Contact Gemora Global | Wholesale Jewellery Enquiry",
    description:
      "Get in touch with Gemora Global for wholesale jewellery enquiries, custom orders, and export pricing.",
  },
];

interface SeoField {
  title: string;
  description: string;
}
interface Coupon {
  id: string;
  code: string;
  discount: string;
  type: "percent" | "flat";
  countries: string;
  expiry: string;
  active: boolean;
}

export default function AdminMarketing() {
  const [activeTab, setActiveTab] = useState<"seo" | "coupons" | "campaigns">(
    "seo",
  );
  const [seoFields, setSeoFields] = useState<Record<string, SeoField>>(() =>
    Object.fromEntries(
      PAGES.map((p) => [p.id, { title: p.title, description: p.description }]),
    ),
  );
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const s = localStorage.getItem("gemora_coupons");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [couponForm, setCouponForm] = useState<Coupon>({
    id: "",
    code: "",
    discount: "",
    type: "percent",
    countries: "All",
    expiry: "",
    active: true,
  });
  const [addCouponOpen, setAddCouponOpen] = useState(false);
  const [campaignLog, setCampaignLog] = useState<
    { date: string; type: string; subject: string }[]
  >(() => {
    try {
      const s = localStorage.getItem("gemora_campaigns");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [waMessage, setWaMessage] = useState(
    "Hi! We have new arrivals from Gemora Global 💎 Check our latest collection: https://www.gemoraglobal.co/products",
  );
  const [emailSubject, setEmailSubject] = useState(
    "New Arrivals — Gemora Global Jewellery",
  );
  const [emailBody, setEmailBody] = useState(
    "Dear Buyer,\n\nWe are excited to share our latest jewellery collection with you.\n\nVisit: https://www.gemoraglobal.co/products\n\nBest regards,\nGemora Global Team",
  );

  const saveCoupons = (updated: Coupon[]) => {
    localStorage.setItem("gemora_coupons", JSON.stringify(updated));
    setCoupons(updated);
  };

  const saveCampaigns = (
    updated: { date: string; type: string; subject: string }[],
  ) => {
    localStorage.setItem("gemora_campaigns", JSON.stringify(updated));
    setCampaignLog(updated);
  };

  const addCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = { ...couponForm, id: `CPN-${Date.now()}` };
    saveCoupons([newCoupon, ...coupons]);
    setCouponForm({
      id: "",
      code: "",
      discount: "",
      type: "percent",
      countries: "All",
      expiry: "",
      active: true,
    });
    setAddCouponOpen(false);
  };

  const logCampaign = (type: string, subject: string) => {
    const newLog = {
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      type,
      subject,
    };
    saveCampaigns([newLog, ...campaignLog]);
    alert(
      `${type} campaign logged! Note: Send manually from your email/WhatsApp app.`,
    );
  };

  const inputStyle = {
    width: "100%",
    background: "#f5f7ff",
    border: "1px solid #c5cae9",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#1A237E",
    fontSize: 13,
    outline: "none",
  } as React.CSSProperties;

  return (
    <AdminLayout>
      <h2
        style={{
          color: "#1A237E",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        Marketing & Growth Engine
      </h2>

      {/* Tabs */}
      <div
        className="flex gap-0 mb-6 rounded-lg overflow-hidden"
        style={{ border: "1px solid #c5cae9", width: "fit-content" }}
      >
        {[
          ["seo", "🔍 SEO Manager"],
          ["coupons", "🏷️ Coupons"],
          ["campaigns", "📣 Campaigns"],
        ].map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className="px-5 py-2.5 text-sm font-semibold transition-colors"
            style={{
              background: activeTab === tab ? "#1A237E" : "#f5f7ff",
              color: activeTab === tab ? "#fff" : "#1A237E",
            }}
            data-ocid={`admin.marketing.${tab}.tab`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "seo" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ background: "#e8eaf6", padding: "12px 20px" }}>
            <p style={{ color: "#1A237E", fontWeight: 600, fontSize: 14 }}>
              Page Meta Tags
            </p>
            <p style={{ color: "#666", fontSize: 12 }}>
              Edit title (max 65 chars) and description (max 160 chars) for each
              page.
            </p>
          </div>
          {PAGES.map((page) => {
            const isEditing = editingPage === page.id;
            const fields = seoFields[page.id] ?? {
              title: page.title,
              description: page.description,
            };
            return (
              <div
                key={page.id}
                style={{ padding: 20, borderBottom: "1px solid #f0f0f0" }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        color: "#999",
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {page.name}
                    </p>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <Label>Title ({fields.title.length}/65)</Label>
                          <Input
                            value={fields.title}
                            onChange={(e) =>
                              setSeoFields((prev) => ({
                                ...prev,
                                [page.id]: {
                                  ...prev[page.id],
                                  title: e.target.value,
                                },
                              }))
                            }
                            maxLength={65}
                          />
                        </div>
                        <div>
                          <Label>
                            Description ({fields.description.length}/160)
                          </Label>
                          <Textarea
                            value={fields.description}
                            onChange={(e) =>
                              setSeoFields((prev) => ({
                                ...prev,
                                [page.id]: {
                                  ...prev[page.id],
                                  description: e.target.value,
                                },
                              }))
                            }
                            maxLength={160}
                            rows={2}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingPage(null)}
                          style={{
                            background: "#1A237E",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 16px",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                          data-ocid="admin.marketing.seo.save_button"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <p
                          style={{
                            color: "#1A237E",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {fields.title}
                        </p>
                        <p
                          style={{ color: "#666", fontSize: 12, marginTop: 2 }}
                        >
                          {fields.description}
                        </p>
                      </>
                    )}
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setEditingPage(page.id)}
                      style={{
                        background: "#e8eaf6",
                        border: "1px solid #c5cae9",
                        color: "#1A237E",
                        borderRadius: 6,
                        padding: "4px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      data-ocid="admin.marketing.seo.edit_button"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "coupons" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p style={{ color: "#1A237E", fontWeight: 600 }}>Coupon Codes</p>
            <button
              type="button"
              onClick={() => setAddCouponOpen(!addCouponOpen)}
              style={{
                background: "#1A237E",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
              data-ocid="admin.marketing.coupons.add_button"
            >
              + Add Coupon
            </button>
          </div>

          {addCouponOpen && (
            <form
              onSubmit={addCoupon}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label>Coupon Code *</Label>
                  <input
                    style={inputStyle}
                    value={couponForm.code}
                    onChange={(e) =>
                      setCouponForm((f) => ({
                        ...f,
                        code: e.target.value.toUpperCase(),
                      }))
                    }
                    required
                    placeholder="GEMORA20"
                    data-ocid="admin.marketing.coupons.input"
                  />
                </div>
                <div>
                  <Label>Discount Value *</Label>
                  <input
                    style={inputStyle}
                    value={couponForm.discount}
                    onChange={(e) =>
                      setCouponForm((f) => ({ ...f, discount: e.target.value }))
                    }
                    required
                    placeholder="20"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <select
                    style={inputStyle}
                    value={couponForm.type}
                    onChange={(e) =>
                      setCouponForm((f) => ({
                        ...f,
                        type: e.target.value as "percent" | "flat",
                      }))
                    }
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount ($)</option>
                  </select>
                </div>
                <div>
                  <Label>Applicable Countries</Label>
                  <input
                    style={inputStyle}
                    value={couponForm.countries}
                    onChange={(e) =>
                      setCouponForm((f) => ({
                        ...f,
                        countries: e.target.value,
                      }))
                    }
                    placeholder="All, USA, UAE"
                  />
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <input
                    style={inputStyle}
                    type="date"
                    value={couponForm.expiry}
                    onChange={(e) =>
                      setCouponForm((f) => ({ ...f, expiry: e.target.value }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <Switch
                    checked={couponForm.active}
                    onCheckedChange={(v) =>
                      setCouponForm((f) => ({ ...f, active: v }))
                    }
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <button
                type="submit"
                style={{
                  background: "#1A237E",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 20px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
                data-ocid="admin.marketing.coupons.submit_button"
              >
                Create Coupon
              </button>
            </form>
          )}

          <div
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {coupons.length === 0 ? (
              <div
                style={{
                  padding: 40,
                  textAlign: "center",
                  color: "#aaa",
                  fontSize: 14,
                }}
                data-ocid="admin.marketing.coupons.empty_state"
              >
                No coupons yet. Create your first one above.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {[
                      "Code",
                      "Discount",
                      "Countries",
                      "Expiry",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "10px 14px",
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
                  {coupons.map((c, i) => (
                    <tr
                      key={c.id}
                      style={{ borderBottom: "1px solid #f5f5f5" }}
                      data-ocid={`admin.marketing.coupons.item.${i + 1}`}
                    >
                      <td
                        style={{
                          padding: "10px 14px",
                          fontFamily: "monospace",
                          fontSize: 13,
                          color: "#1A237E",
                          fontWeight: 700,
                        }}
                      >
                        {c.code}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 13,
                          color: "#2e7d32",
                          fontWeight: 600,
                        }}
                      >
                        {c.discount}
                        {c.type === "percent" ? "%" : "$"}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 12,
                          color: "#888",
                        }}
                      >
                        {c.countries}
                      </td>
                      <td
                        style={{
                          padding: "10px 14px",
                          fontSize: 12,
                          color: "#888",
                        }}
                      >
                        {c.expiry || "No expiry"}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <span
                          style={{
                            background: c.active
                              ? "rgba(46,125,50,0.15)"
                              : "rgba(200,0,0,0.1)",
                            color: c.active ? "#2e7d32" : "#c62828",
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 20,
                            fontWeight: 600,
                          }}
                        >
                          {c.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigator.clipboard.writeText(c.code)
                            }
                            style={{
                              background: "#e8eaf6",
                              border: "1px solid #c5cae9",
                              color: "#1A237E",
                              borderRadius: 6,
                              padding: "3px 10px",
                              fontSize: 11,
                              cursor: "pointer",
                            }}
                          >
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              saveCoupons(
                                coupons.filter((cp) => cp.id !== c.id),
                              )
                            }
                            style={{
                              background: "crimson",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "3px 10px",
                              fontSize: 11,
                              cursor: "pointer",
                            }}
                            data-ocid={`admin.marketing.coupons.delete_button.${i + 1}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === "campaigns" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* WhatsApp Broadcast */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span style={{ fontSize: 20 }}>💬</span>
                <h3 style={{ color: "#1A237E", fontWeight: 600, fontSize: 15 }}>
                  WhatsApp Broadcast
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Message Template</Label>
                  <Textarea
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    rows={4}
                    data-ocid="admin.marketing.whatsapp.textarea"
                  />
                </div>
                <div
                  style={{
                    background: "#e8f5e9",
                    border: "1px solid #c8e6c9",
                    borderRadius: 8,
                    padding: 10,
                  }}
                >
                  <p style={{ color: "#1B5E20", fontSize: 12 }}>
                    ℹ️ Send this message manually via WhatsApp Business app.
                    Click below to open WhatsApp with this message pre-filled.
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      background: "#25D366",
                      color: "#fff",
                      borderRadius: 8,
                      padding: "8px 16px",
                      fontWeight: 700,
                      fontSize: 13,
                      textDecoration: "none",
                      display: "block",
                    }}
                    data-ocid="admin.marketing.whatsapp.send_button"
                  >
                    Open in WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      logCampaign("WhatsApp", waMessage.slice(0, 50))
                    }
                    style={{
                      background: "#e8eaf6",
                      color: "#1A237E",
                      border: "1px solid #c5cae9",
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Log Campaign
                  </button>
                </div>
              </div>
            </div>

            {/* Email Campaign */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span style={{ fontSize: 20 }}>✉️</span>
                <h3 style={{ color: "#1A237E", fontWeight: 600, fontSize: 15 }}>
                  Email Campaign
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    data-ocid="admin.marketing.email.subject_input"
                  />
                </div>
                <div>
                  <Label>Body</Label>
                  <Textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={4}
                    data-ocid="admin.marketing.email.body_textarea"
                  />
                </div>
                <div
                  style={{
                    background: "#e8f4fe",
                    border: "1px solid #c5cae9",
                    borderRadius: 8,
                    padding: 10,
                  }}
                >
                  <p style={{ color: "#1A237E", fontSize: 12 }}>
                    ℹ️ Copy and send via Gmail or your email client. Log below to
                    track campaigns.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => logCampaign("Email", emailSubject)}
                  style={{
                    width: "100%",
                    background: "#1A237E",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                  data-ocid="admin.marketing.email.log_button"
                >
                  Log Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Campaign History */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h3 style={{ color: "#1A237E", fontWeight: 600, marginBottom: 12 }}>
              Campaign History
            </h3>
            {campaignLog.length === 0 ? (
              <p
                style={{
                  color: "#aaa",
                  fontSize: 13,
                  textAlign: "center",
                  padding: "20px 0",
                }}
                data-ocid="admin.marketing.campaigns.empty_state"
              >
                No campaigns logged yet.
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Date", "Type", "Description"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          color: "#999",
                          fontSize: 11,
                          fontWeight: 600,
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaignLog.map((log, i) => (
                    <tr
                      key={String(i)}
                      style={{ borderBottom: "1px solid #f5f5f5" }}
                    >
                      <td
                        style={{ padding: "8px", fontSize: 12, color: "#888" }}
                      >
                        {log.date}
                      </td>
                      <td style={{ padding: "8px" }}>
                        <span
                          style={{
                            background:
                              log.type === "WhatsApp"
                                ? "rgba(37,211,102,0.15)"
                                : "rgba(26,35,126,0.1)",
                            color:
                              log.type === "WhatsApp" ? "#1B5E20" : "#1A237E",
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 20,
                            fontWeight: 600,
                          }}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td
                        style={{ padding: "8px", fontSize: 13, color: "#444" }}
                      >
                        {log.subject}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
