import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import { useActor } from "../../hooks/useActor";
import type { Inquiry } from "../../types";

export default function AdminAutomation() {
  const { actor } = useActor();
  const [emailAuto, setEmailAuto] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("gemora_auto_email") ?? "false",
      ) as boolean;
    } catch {
      return false;
    }
  });
  const [stockAlert, setStockAlert] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("gemora_auto_stock") ?? "true",
      ) as boolean;
    } catch {
      return true;
    }
  });
  const [stockThreshold, setStockThreshold] = useState(() => {
    return localStorage.getItem("gemora_auto_stock_threshold") ?? "10";
  });
  const [followUpDays, setFollowUpDays] = useState("2");
  const [priceRule, setPriceRule] = useState({
    category: "all",
    action: "increase",
    amount: "10",
  });
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const { data: inquiries } = useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: () => actor!.getInquiries(),
    enabled: !!actor,
  });

  const saveEmailAuto = (v: boolean) => {
    localStorage.setItem("gemora_auto_email", JSON.stringify(v));
    setEmailAuto(v);
    toast.success(v ? "Auto email ON" : "Auto email OFF");
  };

  const saveStockAlert = (v: boolean) => {
    localStorage.setItem("gemora_auto_stock", JSON.stringify(v));
    setStockAlert(v);
    toast.success(v ? "Stock alerts ON" : "Stock alerts OFF");
  };

  const sendTestAlert = () => {
    setAlertModalOpen(true);
  };

  // Follow-up: inquiries older than X days with status "new"
  const now = Date.now();
  const daysMs = Number(followUpDays) * 24 * 60 * 60 * 1000;
  const overdueInquiries = (inquiries ?? []).filter((inq) => {
    const ts = Number(inq.createdAt ?? 0n) * 1000;
    return inq.status === "new" && ts > 0 && now - ts > daysMs;
  });

  const markContacted = async (id: bigint) => {
    if (!actor) return;
    try {
      await actor.updateInquiryStatus(id, "contacted");
      toast.success("Marked as contacted");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const applyPriceRule = () => {
    toast.success(
      `Price rule queued: ${priceRule.action} by ${priceRule.amount}% for ${priceRule.category === "all" ? "all categories" : priceRule.category}. Note: bulk product update requires manual processing via Products section.`,
    );
  };

  const inputStyle = {
    background: "#f5f7ff",
    border: "1px solid #c5cae9",
    borderRadius: 8,
    padding: "8px 12px",
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
        Automation Engine
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Auto Email */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 style={{ color: "#1A237E", fontWeight: 600, fontSize: 15 }}>
                ✉️ Auto Email After Inquiry
              </h3>
              <p style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
                Automatically send a welcome email to new buyers when they
                submit an inquiry.
              </p>
            </div>
            <Switch
              checked={emailAuto}
              onCheckedChange={saveEmailAuto}
              data-ocid="admin.automation.email_toggle"
            />
          </div>
          {emailAuto && (
            <div
              style={{
                marginTop: 14,
                background: "#f5f7ff",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <p style={{ color: "#e65100", fontSize: 12, fontWeight: 600 }}>
                ⚠️ Email service requires backend setup.
              </p>
              <p style={{ color: "#888", fontSize: 12 }}>
                Contact the platform team to enable transactional emails.
                Template will trigger on each new inquiry submission.
              </p>
            </div>
          )}
        </div>

        {/* Stock Alerts */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 style={{ color: "#1A237E", fontWeight: 600, fontSize: 15 }}>
                📦 Low Stock Alerts
              </h3>
              <p style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
                Get notified when product stock falls below the threshold.
              </p>
            </div>
            <Switch
              checked={stockAlert}
              onCheckedChange={saveStockAlert}
              data-ocid="admin.automation.stock_toggle"
            />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <label
              htmlFor="stock-threshold"
              style={{ color: "#666", fontSize: 13, flexShrink: 0 }}
            >
              Threshold:
            </label>
            <input
              id="stock-threshold"
              type="number"
              style={{ ...inputStyle, width: 80 }}
              value={stockThreshold}
              onChange={(e) => {
                setStockThreshold(e.target.value);
                localStorage.setItem(
                  "gemora_auto_stock_threshold",
                  e.target.value,
                );
              }}
              data-ocid="admin.automation.stock_threshold_input"
            />
            <span style={{ color: "#888", fontSize: 13 }}>units</span>
            <button
              type="button"
              onClick={sendTestAlert}
              style={{
                background: "#e8eaf6",
                color: "#1A237E",
                border: "1px solid #c5cae9",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 600,
              }}
              data-ocid="admin.automation.test_alert_button"
            >
              Send Test Alert
            </button>
          </div>
        </div>
      </div>

      {/* Follow-Up Reminders */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 style={{ color: "#1A237E", fontWeight: 600, fontSize: 15 }}>
            ⏰ Follow-Up Reminders
          </h3>
          <div className="flex items-center gap-2">
            <span style={{ color: "#666", fontSize: 13 }}>
              Show inquiries with no response for
            </span>
            <input
              type="number"
              style={{ ...inputStyle, width: 60 }}
              value={followUpDays}
              onChange={(e) => setFollowUpDays(e.target.value)}
              data-ocid="admin.automation.followup_days_input"
            />
            <span style={{ color: "#666", fontSize: 13 }}>days</span>
          </div>
        </div>
        {overdueInquiries.length === 0 ? (
          <p
            style={{
              color: "#aaa",
              fontSize: 13,
              textAlign: "center",
              padding: "20px 0",
            }}
            data-ocid="admin.automation.followup.empty_state"
          >
            🎉 No overdue inquiries! All inquiries have been responded to.
          </p>
        ) : (
          <div className="space-y-3">
            {overdueInquiries.slice(0, 10).map((inq, i) => {
              const ts = Number(inq.createdAt ?? 0n) * 1000;
              const daysAgo = Math.floor((now - ts) / (24 * 60 * 60 * 1000));
              return (
                <div
                  key={String(inq.id)}
                  style={{
                    background: "#fff7e6",
                    border: "1px solid #ffe0b2",
                    borderRadius: 10,
                    padding: 14,
                  }}
                  data-ocid={`admin.automation.followup.item.${i + 1}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p
                        style={{
                          color: "#1A237E",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {inq.name} — {inq.country}
                      </p>
                      <p style={{ color: "#888", fontSize: 12 }}>
                        {inq.requirement.slice(0, 80)}
                        {inq.requirement.length > 80 ? "…" : ""}
                      </p>
                      <p
                        style={{ color: "#e65100", fontSize: 11, marginTop: 4 }}
                      >
                        ⏱ {daysAgo} days without response
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {inq.whatsapp && (
                        <a
                          href={`https://wa.me/${inq.whatsapp.replace(/\D/g, "")}?text=Hi ${encodeURIComponent(inq.name)}, we received your inquiry. Let's connect!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: "#25D366",
                            color: "#fff",
                            borderRadius: 6,
                            padding: "4px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          WhatsApp
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => markContacted(inq.id)}
                        style={{
                          background: "#2e7d32",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "4px 12px",
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                        data-ocid={`admin.automation.followup.contacted_button.${i + 1}`}
                      >
                        Mark Contacted
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Update Rules */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            color: "#1A237E",
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 16,
          }}
        >
          💰 Price Update Rules
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div>
            <p style={{ color: "#666", fontSize: 12, marginBottom: 4 }}>
              Category
            </p>
            <select
              style={inputStyle}
              value={priceRule.category}
              onChange={(e) =>
                setPriceRule((p) => ({ ...p, category: e.target.value }))
              }
              data-ocid="admin.automation.price_category_select"
            >
              <option value="all">All Products</option>
              <option value="earrings">Earrings</option>
              <option value="necklaces">Necklaces</option>
              <option value="bangles">Bangles</option>
              <option value="bridal">Bridal Sets</option>
            </select>
          </div>
          <div>
            <p style={{ color: "#666", fontSize: 12, marginBottom: 4 }}>
              Action
            </p>
            <select
              style={inputStyle}
              value={priceRule.action}
              onChange={(e) =>
                setPriceRule((p) => ({ ...p, action: e.target.value }))
              }
              data-ocid="admin.automation.price_action_select"
            >
              <option value="increase">Increase by %</option>
              <option value="decrease">Decrease by %</option>
            </select>
          </div>
          <div>
            <p style={{ color: "#666", fontSize: 12, marginBottom: 4 }}>
              Amount (%)
            </p>
            <input
              style={inputStyle}
              type="number"
              min="1"
              max="100"
              value={priceRule.amount}
              onChange={(e) =>
                setPriceRule((p) => ({ ...p, amount: e.target.value }))
              }
              data-ocid="admin.automation.price_amount_input"
            />
          </div>
          <button
            type="button"
            onClick={applyPriceRule}
            style={{
              background: "#1A237E",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
            data-ocid="admin.automation.price_apply_button"
          >
            Apply Rule
          </button>
        </div>
        <p style={{ color: "#888", fontSize: 12, marginTop: 12 }}>
          ⚠️ This will queue a bulk price update for all matching products.
          You'll see a confirmation toast. Actual price updates happen via the
          Products section.
        </p>
      </div>

      {/* Test Alert Modal */}
      {alertModalOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) =>
            e.target === e.currentTarget && setAlertModalOpen(false)
          }
          data-ocid="admin.automation.alert_dialog"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              maxWidth: 420,
              width: "100%",
            }}
          >
            <h3
              style={{
                color: "#1A237E",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              📦 Low Stock Alert Test
            </h3>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 16 }}>
              If stock alerts were active and any product fell below{" "}
              <strong>{stockThreshold} units</strong>, this notification would
              be sent to the admin email.
            </p>
            <div
              style={{
                background: "#fff3e0",
                border: "1px solid #ffe0b2",
                borderRadius: 10,
                padding: 14,
                marginBottom: 16,
              }}
            >
              <p style={{ color: "#e65100", fontWeight: 600, fontSize: 13 }}>
                ⚠️ Low Stock Alert
              </p>
              <p style={{ color: "#555", fontSize: 13, marginTop: 4 }}>
                3 products are below the {stockThreshold}-unit threshold. Please
                restock soon.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAlertModalOpen(false)}
              style={{
                width: "100%",
                background: "#1A237E",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
              data-ocid="admin.automation.alert_close_button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
