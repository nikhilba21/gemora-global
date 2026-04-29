import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

interface CountrySetting {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  active: boolean;
  customPricing: boolean;
  priceMultiplier: string;
}

const DEFAULT_COUNTRIES: CountrySetting[] = [
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    currency: "INR",
    currencySymbol: "₹",
    active: true,
    customPricing: false,
    priceMultiplier: "1.0",
  },
  {
    code: "US",
    name: "USA",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
    active: true,
    customPricing: true,
    priceMultiplier: "1.2",
  },
  {
    code: "GB",
    name: "UK",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
    active: true,
    customPricing: true,
    priceMultiplier: "1.1",
  },
  {
    code: "AE",
    name: "UAE",
    flag: "🇦🇪",
    currency: "AED",
    currencySymbol: "AED",
    active: true,
    customPricing: true,
    priceMultiplier: "1.15",
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    currencySymbol: "A$",
    active: true,
    customPricing: false,
    priceMultiplier: "1.25",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    currencySymbol: "C$",
    active: true,
    customPricing: false,
    priceMultiplier: "1.2",
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    currency: "SGD",
    currencySymbol: "S$",
    active: true,
    customPricing: false,
    priceMultiplier: "1.15",
  },
  {
    code: "MY",
    name: "Malaysia",
    flag: "🇲🇾",
    currency: "MYR",
    currencySymbol: "RM",
    active: true,
    customPricing: false,
    priceMultiplier: "1.1",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    currency: "SAR",
    currencySymbol: "SAR",
    active: true,
    customPricing: false,
    priceMultiplier: "1.2",
  },
  {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    currency: "NGN",
    currencySymbol: "₦",
    active: true,
    customPricing: false,
    priceMultiplier: "1.3",
  },
  {
    code: "LK",
    name: "Sri Lanka",
    flag: "🇱🇰",
    currency: "LKR",
    currencySymbol: "Rs",
    active: true,
    customPricing: false,
    priceMultiplier: "1.1",
  },
  {
    code: "KW",
    name: "Kuwait",
    flag: "🇰🇼",
    currency: "KWD",
    currencySymbol: "KD",
    active: true,
    customPricing: false,
    priceMultiplier: "1.2",
  },
  {
    code: "FR",
    name: "France/Europe",
    flag: "🇫🇷",
    currency: "EUR",
    currencySymbol: "€",
    active: true,
    customPricing: true,
    priceMultiplier: "1.15",
  },
];

export default function AdminCountrySettings() {
  const [countries, setCountries] = useState<CountrySetting[]>(() => {
    try {
      const s = localStorage.getItem("gemora_country_settings");
      return s ? JSON.parse(s) : DEFAULT_COUNTRIES;
    } catch {
      return DEFAULT_COUNTRIES;
    }
  });
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const update = (
    code: string,
    field: keyof CountrySetting,
    value: string | boolean,
  ) => {
    setCountries((prev) =>
      prev.map((c) => (c.code === code ? { ...c, [field]: value } : c)),
    );
  };

  const saveAll = () => {
    localStorage.setItem("gemora_country_settings", JSON.stringify(countries));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle = {
    background: "#f5f7ff",
    border: "1px solid #c5cae9",
    borderRadius: 6,
    padding: "6px 10px",
    color: "#1A237E",
    fontSize: 13,
    outline: "none",
  } as React.CSSProperties;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ color: "#1A237E", fontSize: 22, fontWeight: 700 }}>
          Country Store Settings
        </h2>
        <button
          type="button"
          onClick={saveAll}
          style={{
            background: saved ? "#2e7d32" : "#1A237E",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 20px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          data-ocid="admin.country.save_button"
        >
          {saved ? "✓ Saved!" : "Save All Settings"}
        </button>
      </div>

      <div
        style={{
          background: "#e8f4fe",
          border: "1px solid #c5cae9",
          borderRadius: 12,
          padding: "12px 16px",
          marginBottom: 20,
        }}
      >
        <p style={{ color: "#1A237E", fontSize: 13 }}>
          <strong>📌 Note:</strong> These settings control country-specific
          content, pricing multipliers, and currency display on the website.
          Toggle countries off to hide their store pages.
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ background: "#e8eaf6", padding: "10px 16px" }}>
          <p style={{ color: "#1A237E", fontWeight: 600, fontSize: 13 }}>
            {countries.filter((c) => c.active).length} / {countries.length}{" "}
            countries active
          </p>
        </div>
        <div className="overflow-x-auto">
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}
            data-ocid="admin.country.table"
          >
            <thead>
              <tr>
                {[
                  "Country",
                  "Currency",
                  "Active",
                  "Custom Pricing",
                  "Price Multiplier",
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {countries.map((country, i) => {
                const isEditing = editingCode === country.code;
                return (
                  <tr
                    key={country.code}
                    style={{
                      borderBottom: "1px solid #f5f5f5",
                      background: country.active
                        ? "transparent"
                        : "rgba(0,0,0,0.02)",
                    }}
                    data-ocid={`admin.country.item.${i + 1}`}
                  >
                    <td style={{ padding: "12px 14px" }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 20 }}>{country.flag}</span>
                        <div>
                          <p
                            style={{
                              color: "#222",
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          >
                            {country.name}
                          </p>
                          <p style={{ color: "#999", fontSize: 11 }}>
                            {country.code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {isEditing ? (
                        <div className="flex gap-1">
                          <input
                            style={{ ...inputStyle, width: 60 }}
                            value={country.currency}
                            onChange={(e) =>
                              update(country.code, "currency", e.target.value)
                            }
                          />
                          <input
                            style={{ ...inputStyle, width: 50 }}
                            value={country.currencySymbol}
                            onChange={(e) =>
                              update(
                                country.code,
                                "currencySymbol",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ) : (
                        <div>
                          <p
                            style={{
                              color: "#1A237E",
                              fontWeight: 600,
                              fontSize: 13,
                            }}
                          >
                            {country.currency}
                          </p>
                          <p style={{ color: "#888", fontSize: 12 }}>
                            {country.currencySymbol}
                          </p>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <Switch
                        checked={country.active}
                        onCheckedChange={(v) =>
                          update(country.code, "active", v)
                        }
                        data-ocid={`admin.country.active_toggle.${i + 1}`}
                      />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <Switch
                        checked={country.customPricing}
                        onCheckedChange={(v) =>
                          update(country.code, "customPricing", v)
                        }
                        data-ocid={`admin.country.pricing_toggle.${i + 1}`}
                      />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {isEditing ? (
                        <input
                          style={{ ...inputStyle, width: 80 }}
                          type="number"
                          step="0.01"
                          value={country.priceMultiplier}
                          onChange={(e) =>
                            update(
                              country.code,
                              "priceMultiplier",
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <span
                            style={{
                              color: "#1A237E",
                              fontWeight: 600,
                              fontSize: 13,
                            }}
                          >
                            ×{country.priceMultiplier}
                          </span>
                          {Number.parseFloat(country.priceMultiplier) > 1 && (
                            <span style={{ color: "#2e7d32", fontSize: 11 }}>
                              +
                              {(
                                (Number.parseFloat(country.priceMultiplier) -
                                  1) *
                                100
                              ).toFixed(0)}
                              %
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCode(isEditing ? null : country.code)
                        }
                        style={{
                          background: isEditing ? "#2e7d32" : "#e8eaf6",
                          color: isEditing ? "#fff" : "#1A237E",
                          border: "1px solid #c5cae9",
                          borderRadius: 6,
                          padding: "4px 12px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                        data-ocid={`admin.country.edit_button.${i + 1}`}
                      >
                        {isEditing ? "Done" : "Edit"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
