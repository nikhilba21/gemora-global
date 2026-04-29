import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

interface ShippingRate {
  id: string;
  country: string;
  weightMin: string;
  weightMax: string;
  price: string;
  carrier: string;
  days: string;
}

interface Courier {
  id: string;
  name: string;
  website: string;
  trackingUrl: string;
  active: boolean;
}

const SAMPLE_RATES: ShippingRate[] = [
  {
    id: "sr1",
    country: "UAE",
    weightMin: "0",
    weightMax: "5",
    price: "$15",
    carrier: "DHL",
    days: "3-5",
  },
  {
    id: "sr2",
    country: "UAE",
    weightMin: "5",
    weightMax: "20",
    price: "$35",
    carrier: "DHL",
    days: "3-5",
  },
  {
    id: "sr3",
    country: "USA",
    weightMin: "0",
    weightMax: "5",
    price: "$25",
    carrier: "FedEx",
    days: "7-10",
  },
  {
    id: "sr4",
    country: "UK",
    weightMin: "0",
    weightMax: "5",
    price: "$20",
    carrier: "DHL",
    days: "5-7",
  },
  {
    id: "sr5",
    country: "France",
    weightMin: "0",
    weightMax: "5",
    price: "$22",
    carrier: "DHL",
    days: "5-7",
  },
];

const SAMPLE_COURIERS: Courier[] = [
  {
    id: "c1",
    name: "DHL Express",
    website: "https://dhl.com",
    trackingUrl:
      "https://www.dhl.com/en/express/tracking.html?AWB={trackingId}",
    active: true,
  },
  {
    id: "c2",
    name: "FedEx",
    website: "https://fedex.com",
    trackingUrl: "https://www.fedex.com/fedextrack/?trknbr={trackingId}",
    active: true,
  },
  {
    id: "c3",
    name: "Aramex",
    website: "https://aramex.com",
    trackingUrl:
      "https://www.aramex.com/track-shipment?ShipmentNumber={trackingId}",
    active: true,
  },
];

const DOC_TEMPLATES = [
  {
    name: "Commercial Invoice",
    icon: "📄",
    desc: "Standard invoice for customs clearance",
  },
  {
    name: "Packing List",
    icon: "📦",
    desc: "Detailed list of all items in the shipment",
  },
  {
    name: "Certificate of Origin",
    icon: "🏛️",
    desc: "Declares the country of manufacture (India)",
  },
  {
    name: "HS Code Reference",
    icon: "🔢",
    desc: "Harmonized System codes for jewellery (7117)",
  },
  {
    name: "GST Invoice",
    icon: "💰",
    desc: "For Indian domestic and export sales",
  },
  {
    name: "Shipping Bill",
    icon: "🚢",
    desc: "Required for customs export clearance",
  },
];

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

export default function AdminLogistics() {
  const [rates, setRates] = useState<ShippingRate[]>(() => {
    try {
      const s = localStorage.getItem("gemora_logistics_rates");
      return s ? JSON.parse(s) : SAMPLE_RATES;
    } catch {
      return SAMPLE_RATES;
    }
  });
  const [couriers, setCouriers] = useState<Courier[]>(() => {
    try {
      const s = localStorage.getItem("gemora_logistics_couriers");
      return s ? JSON.parse(s) : SAMPLE_COURIERS;
    } catch {
      return SAMPLE_COURIERS;
    }
  });
  const [addRateOpen, setAddRateOpen] = useState(false);
  const [addCourierOpen, setAddCourierOpen] = useState(false);
  const [rateForm, setRateForm] = useState<Omit<ShippingRate, "id">>({
    country: "",
    weightMin: "0",
    weightMax: "5",
    price: "",
    carrier: "",
    days: "",
  });
  const [courierForm, setCourierForm] = useState<Omit<Courier, "id">>({
    name: "",
    website: "",
    trackingUrl: "",
    active: true,
  });

  const saveRates = (updated: ShippingRate[]) => {
    localStorage.setItem("gemora_logistics_rates", JSON.stringify(updated));
    setRates(updated);
  };
  const saveCouriers = (updated: Courier[]) => {
    localStorage.setItem("gemora_logistics_couriers", JSON.stringify(updated));
    setCouriers(updated);
  };

  const addRate = (e: React.FormEvent) => {
    e.preventDefault();
    saveRates([{ ...rateForm, id: `sr${Date.now()}` }, ...rates]);
    setRateForm({
      country: "",
      weightMin: "0",
      weightMax: "5",
      price: "",
      carrier: "",
      days: "",
    });
    setAddRateOpen(false);
  };

  const addCourier = (e: React.FormEvent) => {
    e.preventDefault();
    saveCouriers([{ ...courierForm, id: `c${Date.now()}` }, ...couriers]);
    setCourierForm({ name: "", website: "", trackingUrl: "", active: true });
    setAddCourierOpen(false);
  };

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
        Logistics & Shipping
      </h2>

      {/* Shipping Rates */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ color: "#1A237E", fontWeight: 600, fontSize: 16 }}>
            🚚 Shipping Rates
          </h3>
          <button
            type="button"
            onClick={() => setAddRateOpen(!addRateOpen)}
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
            data-ocid="admin.logistics.add_rate_button"
          >
            + Add Rate
          </button>
        </div>

        {addRateOpen && (
          <form
            onSubmit={addRate}
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
                <Label>Country *</Label>
                <input
                  style={inputStyle}
                  value={rateForm.country}
                  onChange={(e) =>
                    setRateForm((f) => ({ ...f, country: e.target.value }))
                  }
                  required
                  data-ocid="admin.logistics.rate.input"
                />
              </div>
              <div>
                <Label>Weight Min (kg)</Label>
                <input
                  style={inputStyle}
                  type="number"
                  value={rateForm.weightMin}
                  onChange={(e) =>
                    setRateForm((f) => ({ ...f, weightMin: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Weight Max (kg)</Label>
                <input
                  style={inputStyle}
                  type="number"
                  value={rateForm.weightMax}
                  onChange={(e) =>
                    setRateForm((f) => ({ ...f, weightMax: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Price *</Label>
                <input
                  style={inputStyle}
                  value={rateForm.price}
                  onChange={(e) =>
                    setRateForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="$25"
                  required
                />
              </div>
              <div>
                <Label>Carrier *</Label>
                <input
                  style={inputStyle}
                  value={rateForm.carrier}
                  onChange={(e) =>
                    setRateForm((f) => ({ ...f, carrier: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label>Transit Days</Label>
                <input
                  style={inputStyle}
                  value={rateForm.days}
                  onChange={(e) =>
                    setRateForm((f) => ({ ...f, days: e.target.value }))
                  }
                  placeholder="5-7"
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
              data-ocid="admin.logistics.rate.submit_button"
            >
              Add Rate
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}
            data-ocid="admin.logistics.rates.table"
          >
            <thead>
              <tr>
                {[
                  "Country",
                  "Weight Range",
                  "Price",
                  "Carrier",
                  "Days",
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
              {rates.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      color: "#aaa",
                      padding: "16px",
                      textAlign: "center",
                      fontSize: 13,
                    }}
                    data-ocid="admin.logistics.rates.empty_state"
                  >
                    No rates yet
                  </td>
                </tr>
              )}
              {rates.map((r, i) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: "1px solid #f5f5f5" }}
                  data-ocid={`admin.logistics.rates.item.${i + 1}`}
                >
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: 500,
                      color: "#222",
                      fontSize: 13,
                    }}
                  >
                    {r.country}
                  </td>
                  <td style={{ padding: "10px", fontSize: 13, color: "#666" }}>
                    {r.weightMin}–{r.weightMax} kg
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      color: "#1A237E",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {r.price}
                  </td>
                  <td style={{ padding: "10px", fontSize: 13, color: "#888" }}>
                    {r.carrier}
                  </td>
                  <td style={{ padding: "10px", fontSize: 13, color: "#888" }}>
                    {r.days}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={() =>
                        saveRates(rates.filter((rt) => rt.id !== r.id))
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
                      data-ocid={`admin.logistics.rates.delete_button.${i + 1}`}
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

      {/* Export Documentation */}
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
            fontSize: 16,
            marginBottom: 16,
          }}
        >
          📋 Export Documentation Templates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {DOC_TEMPLATES.map((doc) => (
            <div
              key={doc.name}
              style={{
                background: "#f5f7ff",
                border: "1px solid #c5cae9",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: 22 }}>{doc.icon}</span>
                <p style={{ color: "#1A237E", fontWeight: 600, fontSize: 13 }}>
                  {doc.name}
                </p>
              </div>
              <p style={{ color: "#888", fontSize: 12 }}>{doc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Courier Partners */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ color: "#1A237E", fontWeight: 600, fontSize: 16 }}>
            🤝 Courier Partners
          </h3>
          <button
            type="button"
            onClick={() => setAddCourierOpen(!addCourierOpen)}
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
            data-ocid="admin.logistics.add_courier_button"
          >
            + Add Courier
          </button>
        </div>

        {addCourierOpen && (
          <form
            onSubmit={addCourier}
            style={{
              background: "#f5f7ff",
              border: "1px solid #c5cae9",
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Courier Name *</Label>
                  <input
                    style={inputStyle}
                    value={courierForm.name}
                    onChange={(e) =>
                      setCourierForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                    data-ocid="admin.logistics.courier.input"
                  />
                </div>
                <div>
                  <Label>Website</Label>
                  <input
                    style={inputStyle}
                    type="url"
                    value={courierForm.website}
                    onChange={(e) =>
                      setCourierForm((f) => ({ ...f, website: e.target.value }))
                    }
                    placeholder="https://"
                  />
                </div>
              </div>
              <div>
                <Label>Tracking URL Template (use {"{trackingId}"})</Label>
                <Input
                  value={courierForm.trackingUrl}
                  onChange={(e) =>
                    setCourierForm((f) => ({
                      ...f,
                      trackingUrl: e.target.value,
                    }))
                  }
                  placeholder="https://track.dhl.com/{trackingId}"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={courierForm.active}
                  onCheckedChange={(v) =>
                    setCourierForm((f) => ({ ...f, active: v }))
                  }
                />
                <Label>Active</Label>
              </div>
              <button
                type="submit"
                style={{
                  background: "#1A237E",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 18px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
                data-ocid="admin.logistics.courier.submit_button"
              >
                Add Courier
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {couriers.map((c, i) => (
            <div
              key={c.id}
              style={{
                background: "#f5f7ff",
                border: "1px solid #c5cae9",
                borderRadius: 10,
                padding: 14,
              }}
              data-ocid={`admin.logistics.courier.item.${i + 1}`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      style={{
                        color: "#1A237E",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {c.name}
                    </p>
                    <span
                      style={{
                        background: c.active
                          ? "rgba(46,125,50,0.15)"
                          : "rgba(200,0,0,0.1)",
                        color: c.active ? "#2e7d32" : "#c62828",
                        fontSize: 10,
                        padding: "1px 6px",
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#42A5F5",
                        fontSize: 12,
                        textDecoration: "none",
                      }}
                    >
                      {c.website}
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    saveCouriers(couriers.filter((cr) => cr.id !== c.id))
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
                  data-ocid={`admin.logistics.courier.delete_button.${i + 1}`}
                >
                  Remove
                </button>
              </div>
              {c.trackingUrl && (
                <p
                  style={{
                    color: "#888",
                    fontSize: 11,
                    marginTop: 4,
                    fontFamily: "monospace",
                  }}
                >
                  {c.trackingUrl}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
