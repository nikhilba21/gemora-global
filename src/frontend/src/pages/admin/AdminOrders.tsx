import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface OrderItem {
  name: string;
  qty: string;
  price: string;
}

interface Order {
  id: string;
  buyer: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  type: "B2B" | "B2C";
  status: OrderStatus;
  trackingNumber: string;
  courier: string;
  items: OrderItem[];
  notes: string;
  createdAt: string;
}

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  Pending: { bg: "rgba(66,165,245,0.15)", color: "#1A237E" },
  Processing: { bg: "rgba(100,150,255,0.15)", color: "#6b9fff" },
  Shipped: { bg: "rgba(180,100,255,0.15)", color: "#c084fc" },
  Delivered: { bg: "rgba(100,220,150,0.15)", color: "#2e7d32" },
  Cancelled: { bg: "rgba(220,80,80,0.15)", color: "#c62828" },
};

const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD-001",
    buyer: "Jean Dupont",
    company: "Bijoux Paris",
    email: "jean@bijoux.fr",
    phone: "+33 6 12 34 56 78",
    country: "France",
    address: "15 Rue de la Paix, Paris",
    amount: "$2,400",
    currency: "USD",
    paymentMethod: "T/T Bank Transfer",
    type: "B2B",
    status: "Delivered",
    trackingNumber: "DHL123456789",
    courier: "DHL",
    items: [
      { name: "Kundan Necklace Set", qty: "50", price: "$28.00" },
      { name: "Pearl Drop Earrings", qty: "100", price: "$8.00" },
    ],
    notes: "VIP client — handle with care.",
    createdAt: "March 1, 2026",
  },
  {
    id: "ORD-002",
    buyer: "Fatima Al-Rashid",
    company: "Al Rashid Jewels",
    email: "fatima@alrashid.ae",
    phone: "+971 50 123 4567",
    country: "UAE",
    address: "Shop 12, Dubai Gold Souk",
    amount: "$1,800",
    currency: "USD",
    paymentMethod: "PayPal",
    type: "B2B",
    status: "Shipped",
    trackingNumber: "FDX987654321",
    courier: "FedEx",
    items: [
      { name: "Oxidised Silver Bangles", qty: "60", price: "$15.00" },
      { name: "Minimal Necklace", qty: "60", price: "$15.00" },
    ],
    notes: "Eco-friendly packaging preferred.",
    createdAt: "March 5, 2026",
  },
  {
    id: "ORD-003",
    buyer: "Sarah Johnson",
    company: "Trendy Boutique NYC",
    email: "sarah@boutique.us",
    phone: "+1 212 555 0198",
    country: "USA",
    address: "220 5th Avenue, New York",
    amount: "$3,200",
    currency: "USD",
    paymentMethod: "Stripe",
    type: "B2B",
    status: "Processing",
    trackingNumber: "",
    courier: "",
    items: [
      { name: "Bridal Choker Set", qty: "20", price: "$80.00" },
      { name: "Kundan Maang Tikka", qty: "40", price: "$20.00" },
    ],
    notes: "Bridal season order — urgent.",
    createdAt: "March 10, 2026",
  },
];

const EMPTY_ORDER: {
  buyer: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  type: "B2B" | "B2C";
  status: OrderStatus;
  trackingNumber: string;
  courier: string;
  notes: string;
} = {
  buyer: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  address: "",
  amount: "",
  currency: "USD",
  paymentMethod: "T/T Bank Transfer",
  type: "B2B",
  status: "Pending" as OrderStatus,
  trackingNumber: "",
  courier: "",
  notes: "",
};
const EMPTY_ITEM: OrderItem = { name: "", qty: "", price: "" };

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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("gemora_orders");
      if (!saved) return SAMPLE_ORDERS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? (parsed as Order[]) : SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterCountry, setFilterCountry] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [form, setForm] = useState(EMPTY_ORDER);
  const [items, setItems] = useState<OrderItem[]>([{ ...EMPTY_ITEM }]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const saveOrders = (updated: Order[]) => {
    localStorage.setItem("gemora_orders", JSON.stringify(updated));
    setOrders(updated);
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o,
    );
    saveOrders(updated);
    if (detailOrder?.id === id)
      setDetailOrder((p) => (p ? { ...p, status: newStatus } : p));
  };

  const deleteOrder = (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      const updated = orders.filter((o) => o.id !== id);
      saveOrders(updated);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (detailOrder?.id === id) setDetailOrder(null);
    }
  };

  const startEdit = (order: Order) => {
    setEditingId(order.id);
    setForm({
      buyer: order.buyer,
      company: order.company,
      email: order.email,
      phone: order.phone,
      country: order.country,
      address: order.address,
      amount: order.amount,
      currency: order.currency,
      paymentMethod: order.paymentMethod,
      type: order.type,
      status: order.status,
      trackingNumber: order.trackingNumber,
      courier: order.courier,
      notes: order.notes,
    });
    setItems(order.items.length > 0 ? [...order.items] : [{ ...EMPTY_ITEM }]);
    setAddOpen(true);
  };

  const addOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = orders.map((o) =>
        o.id === editingId
          ? {
              ...o,
              ...form,
              items: items.filter((it) => it.name.trim()),
            }
          : o,
      );
      saveOrders(updated);
      setEditingId(null);
    } else {
      const newOrder: Order = {
        id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        ...form,
        items: items.filter((it) => it.name.trim()),
        createdAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };
      saveOrders([newOrder, ...orders]);
    }
    setForm(EMPTY_ORDER);
    setItems([{ ...EMPTY_ITEM }]);
    setAddOpen(false);
  };

  const generateInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0d1554; padding-bottom: 30px; margin-bottom: 30px; }
            .brand-box { display: flex; align-items: center; gap: 15px; }
            .logo { height: 60px; width: auto; object-fit: contain; }
            .company-name { font-size: 18px; font-weight: 700; color: #0d1554; }
            .invoice-meta { text-align: right; }
            .invoice-meta h1 { margin: 0; font-size: 32px; color: #0d1554; letter-spacing: -0.02em; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
            .info-box p { margin: 4px 0; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            th { background: #f8fafc; padding: 12px 15px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0; }
            td { padding: 15px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
            .qty-col { text-align: center; }
            .price-col { text-align: right; }
            .total-row { margin-top: 30px; display: flex; justify-content: flex-end; }
            .total-box { background: #0d1554; color: #fff; padding: 20px 40px; border-radius: 8px; text-align: right; min-width: 200px; }
            .total-label { font-size: 11px; text-transform: uppercase; opacity: 0.8; margin-bottom: 4px; }
            .total-value { font-size: 24px; font-weight: 700; }
            .footer { margin-top: 60px; padding-top: 30px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; }
            .footer p { margin: 4px 0; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand-box">
              <img src="/assets/uploads/logo-removebg-preview-1-1.png" class="logo" alt="Gemora Global" />
              <div class="company-name">Gemora Global Private Limited</div>
            </div>
            <div class="invoice-meta">
              <h1>INVOICE</h1>
              <p style="margin:5px 0 0; color:#64748b; font-weight:600;">Order ID: #${order.id}</p>
              <p style="margin:2px 0 0; color:#64748b;">Date: ${order.createdAt}</p>
            </div>
          </div>

          <div class="meta-grid">
            <div class="info-box">
              <div class="section-title">Bill To</div>
              <p><strong>${order.buyer}</strong></p>
              ${order.company ? `<p>${order.company}</p>` : ""}
              <p>${order.address || ""}</p>
              <p>${order.country}</p>
              <p>${order.email || ""}</p>
              <p>${order.phone || ""}</p>
            </div>
            <div class="info-box">
              <div class="section-title">Order Details</div>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              <p><strong>Category:</strong> ${order.type}</p>
              ${order.courier ? `<p><strong>Shipping:</strong> ${order.courier}</p>` : ""}
              ${order.trackingNumber ? `<p><strong>Tracking:</strong> ${order.trackingNumber}</p>` : ""}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th class="qty-col">Qty</th>
                <th class="price-col">Unit Price</th>
                <th class="price-col">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (it) => `
                <tr>
                  <td style="font-weight:500;">${it.name}</td>
                  <td class="qty-col">${it.qty}</td>
                  <td class="price-col">${it.price}</td>
                  <td class="price-col">${it.price}</td> 
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="total-row">
            <div class="total-box">
              <div class="total-label">Grand Total</div>
              <div class="total-value">${order.amount}</div>
            </div>
          </div>

          <div class="footer">
            <p><strong>Gemora Global Private Limited</strong></p>
            <p>Premium Imitation Jewellery Manufacturer & Exporter | Established 2011</p>
            <p>B 66 MAA Hinglaj Nagar, Jaipur - 302021, Rajasthan, India</p>
            <p>www.gemoraglobal.co | globalgemora@gmail.com | +91 7976341419</p>
            <p style="margin-top:20px; font-style:italic;">Thank you for your business!</p>
          </div>

          <script>
            window.onload = function() { 
              setTimeout(() => {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const exportCSV = () => {
    const rows = [
      ["Order ID", "Buyer", "Company", "Country", "Amount", "Status", "Date"],
    ];
    for (const o of orders)
      rows.push([
        o.id,
        o.buyer,
        o.company,
        o.country,
        o.amount,
        o.status,
        o.createdAt,
      ]);
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gemora_orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const countries = Array.from(new Set(orders.map((o) => o.country)));
  const filtered = orders.filter((o) => {
    if (filterStatus !== "All" && o.status !== filterStatus) return false;
    if (filterCountry !== "All" && o.country !== filterCountry) return false;
    if (filterType !== "All" && o.type !== filterType) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const bulkUpdateStatus = (status: OrderStatus) => {
    const updated = orders.map((o) =>
      selected.has(o.id) ? { ...o, status } : o,
    );
    saveOrders(updated);
    setSelected(new Set());
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h2 style={{ color: "#1A237E", fontSize: 22, fontWeight: 700 }}>
          Export Orders
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="px-3 py-2 text-sm font-semibold rounded-lg"
            style={{
              background: "#e8eaf6",
              color: "#1A237E",
              border: "1px solid #c5cae9",
            }}
            data-ocid="admin.orders.export_button"
          >
            Export CSV
          </button>
          <Dialog
            open={addOpen}
            onOpenChange={(open) => {
              setAddOpen(open);
              if (!open) {
                setEditingId(null);
                setForm(EMPTY_ORDER);
                setItems([{ ...EMPTY_ITEM }]);
              }
            }}
          >
            <DialogTrigger asChild>
              <button
                type="button"
                className="px-4 py-2 text-sm font-bold rounded-lg text-white"
                style={{ background: "#1A237E" }}
                data-ocid="admin.orders.open_modal_button"
              >
                + Add Order
              </button>
            </DialogTrigger>
            <DialogContent
              className="mx-4 max-h-[90vh] overflow-y-auto"
              style={{ maxWidth: 640 }}
            >
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Export Order" : "Add Export Order"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={addOrder} className="space-y-3 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Buyer Name *</Label>
                    <input
                      style={inputStyle}
                      value={form.buyer}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, buyer: e.target.value }))
                      }
                      required
                      data-ocid="admin.orders.input"
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <input
                      style={inputStyle}
                      value={form.company}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, company: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <input
                      style={inputStyle}
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <input
                      style={inputStyle}
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Country *</Label>
                    <input
                      style={inputStyle}
                      value={form.country}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, country: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <input
                      style={inputStyle}
                      value={form.amount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, amount: e.target.value }))
                      }
                      placeholder="$0.00"
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select
                      value={form.paymentMethod}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, paymentMethod: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "T/T Bank Transfer",
                          "PayPal",
                          "Stripe",
                          "Razorpay",
                          "Cash",
                          "Cheque",
                        ].map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, type: v as "B2B" | "B2C" }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B2B">B2B</SelectItem>
                        <SelectItem value="B2C">B2C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, status: v as OrderStatus }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Pending",
                          "Processing",
                          "Shipped",
                          "Delivered",
                          "Cancelled",
                        ].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                    value={form.address}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Order Items</Label>
                    <button
                      type="button"
                      onClick={() => setItems((p) => [...p, { ...EMPTY_ITEM }])}
                      style={{
                        background: "#e8eaf6",
                        border: "1px solid #c5cae9",
                        color: "#1A237E",
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      + Add Item
                    </button>
                  </div>
                  {items.map((item, idx) => (
                    <div
                      key={String(idx)}
                      className="grid grid-cols-4 gap-2 mb-2"
                    >
                      <input
                        style={inputStyle}
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) =>
                          setItems((p) =>
                            p.map((it, i) =>
                              i === idx ? { ...it, name: e.target.value } : it,
                            ),
                          )
                        }
                        className="col-span-2"
                      />
                      <input
                        style={inputStyle}
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) =>
                          setItems((p) =>
                            p.map((it, i) =>
                              i === idx ? { ...it, qty: e.target.value } : it,
                            ),
                          )
                        }
                      />
                      <div className="flex gap-1">
                        <input
                          style={inputStyle}
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) =>
                            setItems((p) =>
                              p.map((it, i) =>
                                i === idx
                                  ? { ...it, price: e.target.value }
                                  : it,
                              ),
                            )
                          }
                        />
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setItems((p) => p.filter((_, i) => i !== idx))
                            }
                            style={{
                              background: "crimson",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "4px 8px",
                              cursor: "pointer",
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <Label>Notes</Label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                  />
                </div>
                <button
                  type="submit"
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
                  data-ocid="admin.orders.submit_button"
                >
                  {editingId ? "Update Order" : "Add Order"}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          "All",
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterStatus(s)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
            style={{
              background: filterStatus === s ? "#1A237E" : "#e8eaf6",
              color: filterStatus === s ? "#fff" : "#1A237E",
              border: "1px solid #c5cae9",
            }}
            data-ocid="admin.orders.filter.tab"
          >
            {s}
          </button>
        ))}
        <select
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          style={{
            background: "#f5f7ff",
            border: "1px solid #c5cae9",
            borderRadius: 8,
            padding: "6px 10px",
            color: "#1A237E",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <option value="All">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            background: "#f5f7ff",
            border: "1px solid #c5cae9",
            borderRadius: 8,
            padding: "6px 10px",
            color: "#1A237E",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <option value="All">All Types</option>
          <option value="B2B">B2B</option>
          <option value="B2C">B2C</option>
        </select>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div
          className="flex flex-wrap gap-2 mb-4 p-3 rounded-lg"
          style={{ background: "#e8eaf6" }}
        >
          <span className="text-sm font-medium" style={{ color: "#1A237E" }}>
            {selected.size} selected
          </span>
          {["Processing", "Shipped", "Delivered"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => bulkUpdateStatus(s as OrderStatus)}
              className="px-3 py-1 text-xs font-semibold rounded"
              style={{ background: "#1A237E", color: "#fff" }}
            >
              Mark {s}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="px-3 py-1 text-xs rounded"
            style={{
              background: "#fff",
              color: "#666",
              border: "1px solid #c5cae9",
            }}
          >
            Clear
          </button>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div className="overflow-x-auto">
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}
            data-ocid="admin.orders.table"
          >
            <thead>
              <tr>
                {[
                  "",
                  "Order ID",
                  "Buyer",
                  "Country",
                  "Type",
                  "Amount",
                  "Payment",
                  "Status",
                  "Date",
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
                    colSpan={10}
                    style={{
                      color: "#aaa",
                      padding: "16px",
                      textAlign: "center",
                      fontSize: 13,
                    }}
                    data-ocid="admin.orders.empty_state"
                  >
                    No orders found
                  </td>
                </tr>
              )}
              {filtered.map((order, i) => (
                <tr
                  key={order.id}
                  style={{ borderBottom: "1px solid #f5f5f5" }}
                  data-ocid={`admin.orders.item.${i + 1}`}
                >
                  <td style={{ padding: "10px" }}>
                    <input
                      type="checkbox"
                      checked={selected.has(order.id)}
                      onChange={() => toggleSelect(order.id)}
                    />
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setDetailOrder(order)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#42A5F5",
                        fontFamily: "monospace",
                        fontSize: 13,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      data-ocid="admin.orders.open_modal_button"
                    >
                      {order.id}
                    </button>
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: 14,
                      color: "#222",
                      fontWeight: 500,
                    }}
                  >
                    {order.buyer}
                  </td>
                  <td style={{ padding: "10px", fontSize: 13, color: "#666" }}>
                    {order.country}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        background:
                          order.type === "B2B"
                            ? "rgba(26,35,126,0.1)"
                            : "rgba(43,125,50,0.1)",
                        color: order.type === "B2B" ? "#1A237E" : "#2e7d32",
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      {order.type}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: 14,
                      color: "#1A237E",
                      fontWeight: 600,
                    }}
                  >
                    {order.amount}
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#888" }}>
                    {order.paymentMethod}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <span
                      style={{
                        ...STATUS_COLORS[order.status],
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#999" }}>
                    {order.createdAt}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value as OrderStatus,
                          )
                        }
                        style={{
                          background: "#f5f7ff",
                          border: "1px solid #c5cae9",
                          borderRadius: 6,
                          padding: "4px 8px",
                          color: "#1A237E",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                        data-ocid={`admin.orders.select.${i + 1}`}
                      >
                        {[
                          "Pending",
                          "Processing",
                          "Shipped",
                          "Delivered",
                          "Cancelled",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => startEdit(order)}
                        title="Edit Order"
                        style={{ color: "#1A237E" }}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => generateInvoice(order)}
                        title="Generate Invoice"
                      >
                        📄
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteOrder(order.id)}
                        title="Delete Order"
                        style={{ color: "crimson" }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {detailOrder && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13,21,84,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => e.target === e.currentTarget && setDetailOrder(null)}
          data-ocid="admin.orders.dialog"
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #c5cae9",
              borderRadius: 16,
              padding: 24,
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="flex justify-between items-start mb-5">
              <div>
                <p
                  style={{
                    color: "#999",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Order Details
                </p>
                <h3 style={{ color: "#1A237E", fontWeight: 700, fontSize: 20 }}>
                  {detailOrder.id}
                </h3>
                <p style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
                  Placed on {detailOrder.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={detailOrder.status}
                  onChange={(e) =>
                    updateOrderStatus(
                      detailOrder.id,
                      e.target.value as OrderStatus,
                    )
                  }
                  style={{
                    background: "#f5f7ff",
                    border: "1px solid #c5cae9",
                    borderRadius: 8,
                    padding: "5px 10px",
                    color: "#1A237E",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                  data-ocid="admin.orders.modal_select"
                >
                  {[
                    "Pending",
                    "Processing",
                    "Shipped",
                    "Delivered",
                    "Cancelled",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => generateInvoice(detailOrder)}
                  style={{
                    background: "#E8EAF6",
                    border: "1px solid #c5cae9",
                    color: "#1A237E",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Invoice 📄
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(detailOrder)}
                  style={{
                    background: "#E8EAF6",
                    border: "1px solid #c5cae9",
                    color: "#1A237E",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Edit ✏️
                </button>
                <button
                  type="button"
                  onClick={() => deleteOrder(detailOrder.id)}
                  style={{
                    background: "#FEE2E2",
                    border: "1px solid #FECACA",
                    color: "#B91C1C",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Delete 🗑️
                </button>
                <button
                  type="button"
                  onClick={() => setDetailOrder(null)}
                  style={{
                    background: "#f5f7ff",
                    border: "1px solid #c5cae9",
                    color: "#666",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                  data-ocid="admin.orders.close_button"
                >
                  ×
                </button>
              </div>
            </div>

            <div
              style={{
                background: "#f5f7ff",
                borderRadius: 10,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  color: "#1A237E",
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                👤 Buyer Information
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Name", detailOrder.buyer],
                  ["Company", detailOrder.company || "—"],
                  ["Country", detailOrder.country],
                  ["Email", detailOrder.email || "—"],
                  ["Phone", detailOrder.phone || "—"],
                  ["Payment", detailOrder.paymentMethod],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ color: "#999", fontSize: 11 }}>{label}</p>
                    <p style={{ color: "#222", fontSize: 13 }}>{value}</p>
                  </div>
                ))}
              </div>
              {detailOrder.address && (
                <div style={{ marginTop: 8 }}>
                  <p style={{ color: "#999", fontSize: 11 }}>
                    Shipping Address
                  </p>
                  <p style={{ color: "#444", fontSize: 13 }}>
                    {detailOrder.address}
                  </p>
                </div>
              )}
              {detailOrder.trackingNumber && (
                <div style={{ marginTop: 8 }}>
                  <p style={{ color: "#999", fontSize: 11 }}>
                    Tracking ({detailOrder.courier})
                  </p>
                  <p
                    style={{
                      color: "#1A237E",
                      fontSize: 13,
                      fontFamily: "monospace",
                    }}
                  >
                    {detailOrder.trackingNumber}
                  </p>
                </div>
              )}
            </div>

            {detailOrder.items.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p
                  style={{
                    color: "#1A237E",
                    fontWeight: 600,
                    fontSize: 13,
                    marginBottom: 10,
                  }}
                >
                  📦 Order Items
                </p>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Item", "Qty", "Unit Price"].map((h) => (
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
                    {detailOrder.items.map((item, idx) => (
                      <tr
                        key={String(idx)}
                        style={{ borderBottom: "1px solid #f5f5f5" }}
                      >
                        <td
                          style={{
                            padding: "8px",
                            fontSize: 13,
                            color: "#333",
                          }}
                        >
                          {item.name}
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            fontSize: 13,
                            color: "#666",
                          }}
                        >
                          {item.qty}
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            fontSize: 13,
                            color: "#1A237E",
                          }}
                        >
                          {item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div
              className="flex justify-between items-center pt-3"
              style={{ borderTop: "1px solid #e0e0e0" }}
            >
              <div>
                {detailOrder.notes && (
                  <p style={{ color: "#888", fontSize: 12 }}>
                    📝 {detailOrder.notes}
                  </p>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "#999", fontSize: 11 }}>Total Amount</p>
                <p style={{ color: "#1A237E", fontSize: 20, fontWeight: 700 }}>
                  {detailOrder.amount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

