import api from '../../lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import type { Inquiry } from "../../types";

interface Customer {
  id: string;
  name: string;
  company: string;
  country: string;
  email: string;
  whatsapp: string;
  businessType: string;
  creditLimit: string;
  accountManager: string;
  notes: string;
  tags: string[];
  orders: number;
  totalValue: string;
  lastActivity: string;
}

const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Jean-Pierre Martin",
    company: "Bijoux Paris",
    country: "France",
    email: "jp@bijoux.fr",
    whatsapp: "+33612345678",
    businessType: "Boutique Retailer",
    creditLimit: "$5,000",
    accountManager: "Admin",
    notes: "Top VIP buyer — prefers Kundan sets.",
    tags: ["VIP", "B2B"],
    orders: 8,
    totalValue: "$18,400",
    lastActivity: "April 10, 2026",
  },
  {
    id: "c2",
    name: "Fatima Al-Mansoori",
    company: "Golden Souq LLC",
    country: "UAE",
    email: "fatima@goldensouq.ae",
    whatsapp: "+971501234567",
    businessType: "Wholesale Distributor",
    creditLimit: "$10,000",
    accountManager: "Sales Agent",
    notes: "Prefers oxidised and gold plated collections.",
    tags: ["B2B", "Wholesale"],
    orders: 12,
    totalValue: "$32,000",
    lastActivity: "April 15, 2026",
  },
  {
    id: "c3",
    name: "Emma Thompson",
    company: "Lux Jewels UK",
    country: "UK",
    email: "emma@luxjewels.co.uk",
    whatsapp: "+447700900123",
    businessType: "Online Retailer",
    creditLimit: "$3,000",
    accountManager: "Manager",
    notes: "Interested in minimal and Korean styles.",
    tags: ["B2B"],
    orders: 4,
    totalValue: "$7,200",
    lastActivity: "March 28, 2026",
  },
  {
    id: "c4",
    name: "Sarah Johnson",
    company: "Trendy Boutique NYC",
    country: "USA",
    email: "sarah@boutique.us",
    whatsapp: "+12125550198",
    businessType: "Boutique",
    creditLimit: "$8,000",
    accountManager: "Admin",
    notes: "Bridal season buyer.",
    tags: ["B2B", "Bridal"],
    orders: 6,
    totalValue: "$14,500",
    lastActivity: "April 18, 2026",
  },
];

const EMPTY_CUSTOMER: Customer = {
  id: "",
  name: "",
  company: "",
  country: "",
  email: "",
  whatsapp: "",
  businessType: "",
  creditLimit: "",
  accountManager: "Admin",
  notes: "",
  tags: [],
  orders: 0,
  totalValue: "$0",
  lastActivity: new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const s = localStorage.getItem("gemora_customers");
      return s ? (JSON.parse(s) as Customer[]) : SAMPLE_CUSTOMERS;
    } catch {
      return SAMPLE_CUSTOMERS;
    }
  });
  const [addOpen, setAddOpen] = useState(false);
  const [profileCustomer, setProfileCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<Customer>(EMPTY_CUSTOMER);
  const [filterCountry, setFilterCountry] = useState("All");

  const { data: inquiries } = useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: () => api.getInquiries(),
    enabled: true,
  });

  const saveCustomers = (updated: Customer[]) => {
    localStorage.setItem("gemora_customers", JSON.stringify(updated));
    setCustomers(updated);
  };

  const addCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = { ...form, id: `c${Date.now()}` };
    saveCustomers([newCust, ...customers]);
    setForm(EMPTY_CUSTOMER);
    setAddOpen(false);
  };

  const countries = Array.from(new Set(customers.map((c) => c.country)));
  const filtered =
    filterCountry === "All"
      ? customers
      : customers.filter((c) => c.country === filterCountry);

  // Inquiries for a given customer (match by whatsapp or name)
  const getCustomerInquiries = (cust: Customer) =>
    (inquiries ?? []).filter(
      (inq) =>
        inq.whatsapp === cust.whatsapp ||
        inq.name.toLowerCase() === cust.name.toLowerCase(),
    );

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h2 style={{ color: "#1A237E", fontSize: 22, fontWeight: 700 }}>
          Customers / Buyer CRM
        </h2>
        <div className="flex gap-2">
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            style={{
              background: "#f5f7ff",
              border: "1px solid #c5cae9",
              borderRadius: 8,
              padding: "8px 12px",
              color: "#1A237E",
              fontSize: 13,
            }}
          >
            <option value="All">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button
            className="bg-primary text-primary-foreground"
            onClick={() => setAddOpen(true)}
            data-ocid="admin.customers.open_modal_button"
          >
            + Add Customer
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "Total Customers",
            value: customers.length,
            color: "#1A237E",
          },
          {
            label: "Total Orders",
            value: customers.reduce((a, c) => a + c.orders, 0),
            color: "#2e7d32",
          },
          {
            label: "Countries Served",
            value: new Set(customers.map((c) => c.country)).size,
            color: "#42A5F5",
          },
          {
            label: "Inquiries Received",
            value: (inquiries ?? []).length,
            color: "#e65100",
          },
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
            <p style={{ color: card.color, fontSize: 24, fontWeight: 700 }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

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
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}
            data-ocid="admin.customers.table"
          >
            <thead>
              <tr>
                {[
                  "Name",
                  "Company",
                  "Country",
                  "Contact",
                  "Orders",
                  "Total Value",
                  "Manager",
                  "Tags",
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
                    colSpan={9}
                    style={{
                      color: "#aaa",
                      padding: "16px",
                      textAlign: "center",
                      fontSize: 13,
                    }}
                    data-ocid="admin.customers.empty_state"
                  >
                    No customers yet
                  </td>
                </tr>
              )}
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  style={{ borderBottom: "1px solid #f5f5f5" }}
                  data-ocid={`admin.customers.item.${i + 1}`}
                >
                  <td
                    style={{
                      padding: "10px",
                      fontSize: 14,
                      color: "#222",
                      fontWeight: 500,
                    }}
                  >
                    {c.name}
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#666" }}>
                    {c.company}
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#888" }}>
                    {c.country}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {c.email || "—"}
                    </div>
                    {c.whatsapp && (
                      <a
                        href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 11,
                          color: "#25D366",
                          textDecoration: "none",
                        }}
                      >
                        💬 WhatsApp
                      </a>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: 13,
                      color: "#1A237E",
                      fontWeight: 600,
                      textAlign: "right",
                    }}
                  >
                    {c.orders}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: 13,
                      color: "#2e7d32",
                      fontWeight: 600,
                    }}
                  >
                    {c.totalValue}
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: "#888" }}>
                    {c.accountManager}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: "rgba(26,35,126,0.1)",
                            color: "#1A237E",
                            fontSize: 10,
                            padding: "1px 6px",
                            borderRadius: 20,
                            fontWeight: 600,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setProfileCustomer(c)}
                      style={{
                        background: "#1A237E",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "4px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                      data-ocid={`admin.customers.edit_button.${i + 1}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {addOpen && (
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
          onClick={(e) => e.target === e.currentTarget && setAddOpen(false)}
          data-ocid="admin.customers.dialog"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              maxWidth: 520,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ color: "#1A237E", fontWeight: 700, fontSize: 18 }}>
                Add Customer
              </h3>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                style={{
                  background: "#f5f7ff",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
                data-ocid="admin.customers.close_button"
              >
                ×
              </button>
            </div>
            <form onSubmit={addCustomer} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Name *</Label>
                  <input
                    style={inputStyle}
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                    data-ocid="admin.customers.input"
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
                  <Label>Business Type</Label>
                  <input
                    style={inputStyle}
                    value={form.businessType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, businessType: e.target.value }))
                    }
                    placeholder="Wholesale Distributor"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={form.whatsapp}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, whatsapp: e.target.value }))
                    }
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <Label>Credit Limit</Label>
                  <input
                    style={inputStyle}
                    value={form.creditLimit}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, creditLimit: e.target.value }))
                    }
                    placeholder="$5,000"
                  />
                </div>
                <div>
                  <Label>Account Manager</Label>
                  <select
                    style={inputStyle}
                    value={form.accountManager}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, accountManager: e.target.value }))
                    }
                  >
                    {["Admin", "Manager", "Staff", "Sales Agent"].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
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
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
                data-ocid="admin.customers.submit_button"
              >
                Add Customer
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Customer Profile Modal */}
      {profileCustomer && (
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
          onClick={(e) =>
            e.target === e.currentTarget && setProfileCustomer(null)
          }
          data-ocid="admin.customers.profile_dialog"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              maxWidth: 560,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 style={{ color: "#1A237E", fontWeight: 700, fontSize: 20 }}>
                  {profileCustomer.name}
                </h3>
                <p style={{ color: "#888", fontSize: 13 }}>
                  {profileCustomer.company} · {profileCustomer.country}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProfileCustomer(null)}
                style={{
                  background: "#f5f7ff",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
                data-ocid="admin.customers.close_button"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                ["Email", profileCustomer.email || "—"],
                ["WhatsApp", profileCustomer.whatsapp || "—"],
                ["Business Type", profileCustomer.businessType],
                ["Account Manager", profileCustomer.accountManager],
                ["Credit Limit", profileCustomer.creditLimit || "—"],
                ["Total Orders", String(profileCustomer.orders)],
                ["Total Value", profileCustomer.totalValue],
                ["Last Activity", profileCustomer.lastActivity],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: "#f5f7ff",
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <p style={{ color: "#999", fontSize: 11 }}>{label}</p>
                  <p
                    style={{ color: "#1A237E", fontSize: 13, fontWeight: 600 }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {profileCustomer.whatsapp && (
              <a
                href={`https://wa.me/${profileCustomer.whatsapp.replace(/\D/g, "")}?text=Hi ${encodeURIComponent(profileCustomer.name)}, this is Gemora Global. We'd love to discuss your next jewellery order!`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4 text-center py-2 px-4 rounded-lg font-semibold text-sm"
                style={{
                  background: "#25D366",
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                💬 Send WhatsApp Message
              </a>
            )}

            {getCustomerInquiries(profileCustomer).length > 0 && (
              <div>
                <p
                  style={{
                    color: "#1A237E",
                    fontWeight: 600,
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                >
                  📩 Inquiry History
                </p>
                {getCustomerInquiries(profileCustomer).map((inq) => (
                  <div
                    key={String(inq.id)}
                    style={{
                      background: "#f5f7ff",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 8,
                      fontSize: 12,
                    }}
                  >
                    <div className="flex justify-between">
                      <span style={{ color: "#1A237E", fontWeight: 600 }}>
                        {inq.requirement.slice(0, 60)}
                        {inq.requirement.length > 60 ? "…" : ""}
                      </span>
                      <span
                        style={{
                          color: inq.status === "new" ? "#42A5F5" : "#2e7d32",
                          fontSize: 11,
                        }}
                      >
                        {inq.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {profileCustomer.notes && (
              <div
                style={{
                  background: "#fffde7",
                  border: "1px solid #fff176",
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 12,
                }}
              >
                <p style={{ color: "#f57f17", fontSize: 11, fontWeight: 600 }}>
                  NOTES
                </p>
                <p style={{ color: "#444", fontSize: 13 }}>
                  {profileCustomer.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
