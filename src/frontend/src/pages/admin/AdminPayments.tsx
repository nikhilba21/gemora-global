import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

type PaymentStatus = "Pending" | "Received" | "Failed";

interface Payment {
  id: string;
  date: string;
  customer: string;
  orderRef: string;
  amount: string;
  currency: string;
  method: string;
  status: PaymentStatus;
  notes: string;
}

const STATUS_COLORS: Record<PaymentStatus, { bg: string; color: string }> = {
  Pending: { bg: "rgba(255,167,38,0.15)", color: "#e65100" },
  Received: { bg: "rgba(46,125,50,0.15)", color: "#2e7d32" },
  Failed: { bg: "rgba(220,0,0,0.1)", color: "#c62828" },
};

const SAMPLE_PAYMENTS: Payment[] = [
  {
    id: "PAY-001",
    date: "March 2, 2026",
    customer: "Jean Dupont",
    orderRef: "ORD-001",
    amount: "2400",
    currency: "USD",
    method: "T/T Bank Transfer",
    status: "Received",
    notes: "Cleared via SWIFT",
  },
  {
    id: "PAY-002",
    date: "March 6, 2026",
    customer: "Fatima Al-Rashid",
    orderRef: "ORD-002",
    amount: "1800",
    currency: "USD",
    method: "PayPal",
    status: "Received",
    notes: "",
  },
  {
    id: "PAY-003",
    date: "March 11, 2026",
    customer: "Sarah Johnson",
    orderRef: "ORD-003",
    amount: "1600",
    currency: "USD",
    method: "Stripe",
    status: "Pending",
    notes: "Partial payment",
  },
];

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "AED",
  "INR",
  "AUD",
  "CAD",
  "SGD",
  "SAR",
];
const METHODS = [
  "T/T Bank Transfer",
  "PayPal",
  "Stripe",
  "Razorpay",
  "Cash",
  "Cheque",
];
const EMPTY: Omit<Payment, "id"> = {
  date: "",
  customer: "",
  orderRef: "",
  amount: "",
  currency: "USD",
  method: "T/T Bank Transfer",
  status: "Pending",
  notes: "",
};

const inputStyle = {
  width: "100%",
  background: "#f5f7ff",
  border: "1px solid #c5cae9",
  borderRadius: 8,
  padding: "8px 12px",
  color: "#1A237E",
  fontSize: 13,
  outline: "none",
} as React.CSSProperties;

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      const s = localStorage.getItem("gemora_payments");
      return s ? JSON.parse(s) : SAMPLE_PAYMENTS;
    } catch {
      return SAMPLE_PAYMENTS;
    }
  });
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Omit<Payment, "id">>(EMPTY);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterCurrency, setFilterCurrency] = useState<string>("All");

  const save = (updated: Payment[]) => {
    localStorage.setItem("gemora_payments", JSON.stringify(updated));
    setPayments(updated);
  };

  const addPayment = (e: React.FormEvent) => {
    e.preventDefault();
    save([
      { ...form, id: `PAY-${String(payments.length + 1).padStart(3, "0")}` },
      ...payments,
    ]);
    setForm(EMPTY);
    setAddOpen(false);
  };

  const filtered = payments.filter((p) => {
    if (filterStatus !== "All" && p.status !== filterStatus) return false;
    if (filterCurrency !== "All" && p.currency !== filterCurrency) return false;
    return true;
  });

  const totalUSD = payments
    .filter((p) => p.status === "Received" && p.currency === "USD")
    .reduce((a, p) => a + (Number.parseFloat(p.amount) || 0), 0);
  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const todayTotal = payments
    .filter((p) => p.status === "Received" && p.date === todayStr)
    .reduce((a, p) => a + (Number.parseFloat(p.amount) || 0), 0);

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
        Payments
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "Total Received (USD)",
            value: `$${totalUSD.toLocaleString()}`,
            color: "#2e7d32",
          },
          {
            label: "Today",
            value: `$${todayTotal.toLocaleString()}`,
            color: "#1A237E",
          },
          {
            label: "Pending",
            value: payments.filter((p) => p.status === "Pending").length,
            color: "#e65100",
          },
          { label: "Total Records", value: payments.length, color: "#42A5F5" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <p style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>
              {card.label}
            </p>
            <p style={{ color: card.color, fontSize: 22, fontWeight: 700 }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Gateway Integration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[
          {
            name: "Stripe",
            icon: "💳",
            status: "Not Connected",
            color: "#635BFF",
          },
          {
            name: "Razorpay",
            icon: "💰",
            status: "Not Connected",
            color: "#072654",
          },
          {
            name: "PayPal",
            icon: "🔵",
            status: "Not Connected",
            color: "#003087",
          },
        ].map((gw) => (
          <div
            key={gw.name}
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: 20 }}>{gw.icon}</span>
              <p style={{ color: gw.color, fontWeight: 700, fontSize: 15 }}>
                {gw.name}
              </p>
            </div>
            <p style={{ color: "#888", fontSize: 12, marginBottom: 10 }}>
              {gw.status}
            </p>
            <button
              type="button"
              style={{
                width: "100%",
                background: gw.color,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "7px 14px",
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
              }}
              onClick={() =>
                alert(
                  `${gw.name} integration requires backend configuration. Contact support@gemoraglobal.co for setup.`,
                )
              }
              data-ocid={`admin.payments.${gw.name.toLowerCase()}_connect_button`}
            >
              Connect {gw.name}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Records */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h3 style={{ color: "#1A237E", fontWeight: 600, fontSize: 16 }}>
            Payment Records
          </h3>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                background: "#f5f7ff",
                border: "1px solid #c5cae9",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#1A237E",
                fontSize: 12,
              }}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
              <option value="Failed">Failed</option>
            </select>
            <select
              value={filterCurrency}
              onChange={(e) => setFilterCurrency(e.target.value)}
              style={{
                background: "#f5f7ff",
                border: "1px solid #c5cae9",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#1A237E",
                fontSize: 12,
              }}
            >
              <option value="All">All Currencies</option>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setAddOpen(!addOpen)}
              style={{
                background: "#1A237E",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "7px 14px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
              data-ocid="admin.payments.add_button"
            >
              + Add Payment
            </button>
          </div>
        </div>

        {addOpen && (
          <form
            onSubmit={addPayment}
            style={{
              background: "#f5f7ff",
              border: "1px solid #c5cae9",
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <Label>Customer *</Label>
                <input
                  style={inputStyle}
                  value={form.customer}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customer: e.target.value }))
                  }
                  required
                  data-ocid="admin.payments.input"
                />
              </div>
              <div>
                <Label>Order Ref</Label>
                <input
                  style={inputStyle}
                  value={form.orderRef}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, orderRef: e.target.value }))
                  }
                  placeholder="ORD-001"
                />
              </div>
              <div>
                <Label>Amount *</Label>
                <input
                  style={inputStyle}
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Method</Label>
                <Select
                  value={form.method}
                  onValueChange={(v) => setForm((f) => ({ ...f, method: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METHODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as PaymentStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <input
                  style={inputStyle}
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Input
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              style={{
                marginTop: 12,
                background: "#1A237E",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "7px 18px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
              data-ocid="admin.payments.submit_button"
            >
              Add Payment
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}
            data-ocid="admin.payments.table"
          >
            <thead>
              <tr>
                {[
                  "Date",
                  "Customer",
                  "Order Ref",
                  "Amount",
                  "Method",
                  "Status",
                  "Notes",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      color: "#999",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      borderBottom: "1px solid #e0e0e0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      color: "#aaa",
                      padding: "16px",
                      textAlign: "center",
                      fontSize: 13,
                    }}
                    data-ocid="admin.payments.empty_state"
                  >
                    No payments found
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: "1px solid #f5f5f5" }}
                  data-ocid={`admin.payments.item.${i + 1}`}
                >
                  <td style={{ padding: "10px", fontSize: 12, color: "#888" }}>
                    {p.date}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: 14,
                      color: "#222",
                      fontWeight: 500,
                    }}
                  >
                    {p.customer}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: 12,
                      color: "#888",
                      fontFamily: "monospace",
                    }}
                  >
                    {p.orderRef || "—"}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: 600,
                      color: "#2e7d32",
                      fontSize: 14,
                    }}
                  >
                    {p.currency} {Number(p.amount).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#666" }}>
                    {p.method}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        ...STATUS_COLORS[p.status],
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: 12,
                      color: "#888",
                      maxWidth: 120,
                    }}
                  >
                    <span className="truncate block">{p.notes || "—"}</span>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={() =>
                        save(payments.filter((pm) => pm.id !== p.id))
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
                      data-ocid={`admin.payments.delete_button.${i + 1}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
