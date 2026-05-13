import api from '../../lib/api';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import { useActor } from "../../hooks/useActor";

type Tab = "general" | "branding" | "social" | "users" | "api";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "general", label: "General", icon: "⚙️" },
  { id: "branding", label: "Branding", icon: "🎨" },
  { id: "social", label: "Social & Analytics", icon: "📊" },
  { id: "users", label: "Users & Roles", icon: "👤" },
  { id: "api", label: "API & Integrations", icon: "🔗" },
];

interface AdminUser {
  username: string;
  role: string;
  createdAt: string;
}

export default function AdminSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("general");

  // General settings
  const [settings, setSettings] = useState(() => {
    try {
      const s = localStorage.getItem("gemora_settings_general");
      return s
        ? JSON.parse(s)
        : {
            siteName: "Gemora Global",
            tagline: "India's Leading Imitation Jewellery Exporter",
            email: "globalgemora@gmail.com",
            phone: "+91 7976341419",
            whatsapp: "+917976341419",
            street: "B 66 MAA Hinglaj Nagar",
            city: "Jaipur",
            postal: "302021",
            country: "India",
            defaultCurrency: "USD",
            defaultMOQ: "50",
          };
    } catch {
      return {};
    }
  });

  const [users, setUsers] = useState<AdminUser[]>(() => {
    try {
      const s = localStorage.getItem("gemora_admin_users");
      return s
        ? JSON.parse(s)
        : [{ username: "admin", role: "Admin", createdAt: "2024-01-01" }];
    } catch {
      return [{ username: "admin", role: "Admin", createdAt: "2024-01-01" }];
    }
  });
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    password: "",
    role: "Staff",
  });
  const [apiKey] = useState(
    `GG-${Math.random().toString(36).slice(2, 18).toUpperCase()}`,
  );
  const [webhookUrl, setWebhookUrl] = useState("");

  const { data: contentMap } = useQuery({
    queryKey: ["content-social"],
    queryFn: async () => {
      if (!actor) return {} as Record<string, string>;
      const keys = [
        "ga_id",
        "tawkto_id",
        "instagram_url",
        "linkedin_url",
        "facebook_url",
        "pinterest_url",
        "whatsapp_number",
      ];
      const entries = await Promise.all(
        keys.map(async (k) => {
          const v = await actor.getContent(k);
          const val =
            typeof v === "string"
              ? v
              : v == null
                ? ""
                : Array.isArray(v)
                  ? (v[0] ?? "")
                  : "";
          return [k, val] as [string, string];
        }),
      );
      return Object.fromEntries(entries) as Record<string, string>;
    },
    enabled: true,
  });

  const [localSocial, setLocalSocial] = useState<Record<string, string>>({});
  const getSocial = (k: string) =>
    localSocial[k] !== undefined ? localSocial[k] : (contentMap?.[k] ?? "");
  const setSocial = (k: string, v: string) =>
    setLocalSocial((m) => ({ ...m, [k]: v }));

  const saveSocialMutation = useMutation({
    mutationFn: async (key: string) => {
      await api.setContent(key, getSocial(key));
    },
    onSuccess: () => {
      toast.success("Setting saved");
      qc.invalidateQueries({ queryKey: ["content-social"] });
    },
    onError: () => toast.error("Failed to save"),
  });

  const saveGeneralSettings = () => {
    localStorage.setItem("gemora_settings_general", JSON.stringify(settings));
    toast.success("General settings saved!");
  };

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [
      ...users,
      {
        username: newUserForm.username,
        role: newUserForm.role,
        createdAt: new Date().toISOString().split("T")[0],
      },
    ];
    localStorage.setItem("gemora_admin_users", JSON.stringify(updated));
    setUsers(updated);
    setNewUserForm({ username: "", password: "", role: "Staff" });
    toast.success("User added");
  };

  const inputStyle = {
    background: "#f5f7ff",
    border: "1px solid #c5cae9",
    borderRadius: 8,
    padding: "8px 12px",
    color: "#1A237E",
    fontSize: 13,
    outline: "none",
    width: "100%",
  } as React.CSSProperties;

  const SaveBtn = ({ k }: { k: string }) => (
    <button
      type="button"
      onClick={() => saveSocialMutation.mutate(k)}
      style={{
        background: "#1A237E",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "6px 16px",
        fontWeight: 700,
        fontSize: 12,
        cursor: "pointer",
        marginTop: 6,
      }}
      data-ocid={`admin.settings.${k}.save_button`}
    >
      Save
    </button>
  );

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
        Settings
      </h2>

      {/* Tab Nav */}
      <div
        className="flex flex-wrap gap-0 mb-6 rounded-lg overflow-hidden"
        style={{ border: "1px solid #c5cae9", width: "fit-content" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-1.5"
            style={{
              background: activeTab === tab.id ? "#1A237E" : "#f5f7ff",
              color: activeTab === tab.id ? "#fff" : "#1A237E",
            }}
            data-ocid={`admin.settings.${tab.id}.tab`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === "general" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <h3 style={{ color: "#1A237E", fontWeight: 600, marginBottom: 16 }}>
            General Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Site Name</Label>
              <Input
                value={settings.siteName}
                onChange={(e) =>
                  setSettings((s: typeof settings) => ({
                    ...s,
                    siteName: e.target.value,
                  }))
                }
                className="mt-1"
                data-ocid="admin.settings.site_name.input"
              />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input
                value={settings.tagline}
                onChange={(e) =>
                  setSettings((s: typeof settings) => ({
                    ...s,
                    tagline: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings((s: typeof settings) => ({
                    ...s,
                    email: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={settings.phone}
                onChange={(e) =>
                  setSettings((s: typeof settings) => ({
                    ...s,
                    phone: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>WhatsApp Number</Label>
              <Input
                value={settings.whatsapp}
                onChange={(e) =>
                  setSettings((s: typeof settings) => ({
                    ...s,
                    whatsapp: e.target.value,
                  }))
                }
                className="mt-1"
                placeholder="+917976341419"
              />
            </div>
            <div>
              <Label>Default Currency</Label>
              <input
                style={inputStyle}
                value={settings.defaultCurrency}
                onChange={(e) =>
                  setSettings((s: typeof settings) => ({
                    ...s,
                    defaultCurrency: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Default MOQ (units)</Label>
              <Input
                type="number"
                value={settings.defaultMOQ}
                onChange={(e) =>
                  setSettings((s: typeof settings) => ({
                    ...s,
                    defaultMOQ: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label>Business Address</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <input
                  style={inputStyle}
                  value={settings.street}
                  onChange={(e) =>
                    setSettings((s: typeof settings) => ({
                      ...s,
                      street: e.target.value,
                    }))
                  }
                  placeholder="Street"
                />
              </div>
              <div>
                <input
                  style={inputStyle}
                  value={settings.city}
                  onChange={(e) =>
                    setSettings((s: typeof settings) => ({
                      ...s,
                      city: e.target.value,
                    }))
                  }
                  placeholder="City"
                />
              </div>
              <div>
                <input
                  style={inputStyle}
                  value={settings.postal}
                  onChange={(e) =>
                    setSettings((s: typeof settings) => ({
                      ...s,
                      postal: e.target.value,
                    }))
                  }
                  placeholder="Postal Code"
                />
              </div>
              <div>
                <input
                  style={inputStyle}
                  value={settings.country}
                  onChange={(e) =>
                    setSettings((s: typeof settings) => ({
                      ...s,
                      country: e.target.value,
                    }))
                  }
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={saveGeneralSettings}
            style={{
              marginTop: 20,
              background: "#1A237E",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
            data-ocid="admin.settings.general.save_button"
          >
            Save General Settings
          </button>
        </div>
      )}

      {/* Branding — link to website settings */}
      {activeTab === "branding" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <h3 style={{ color: "#1A237E", fontWeight: 600, marginBottom: 8 }}>
            Branding Settings
          </h3>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
            Manage logo, favicon, hero slider, and color scheme.
          </p>
          <div
            style={{
              background: "#e8eaf6",
              border: "1px solid #c5cae9",
              borderRadius: 10,
              padding: 16,
            }}
          >
            <p style={{ color: "#1A237E", fontWeight: 600, fontSize: 14 }}>
              🎨 Website Settings Panel
            </p>
            <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
              All branding settings (logo upload, hero slider, contact info) are
              managed in the Website Settings page.
            </p>
            <a
              href="/admin/website-settings"
              style={{
                display: "inline-block",
                marginTop: 12,
                background: "#1A237E",
                color: "#fff",
                borderRadius: 8,
                padding: "8px 18px",
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
              }}
              data-ocid="admin.settings.branding.link"
            >
              Go to Website Settings →
            </a>
          </div>
        </div>
      )}

      {/* Social & Analytics */}
      {activeTab === "social" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <h3 style={{ color: "#1A237E", fontWeight: 600, marginBottom: 16 }}>
            Social & Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                key: "ga_id",
                label: "Google Analytics ID",
                placeholder: "G-QNL80LE10N",
              },
              {
                key: "tawkto_id",
                label: "Tawk.to Property ID",
                placeholder: "69df85ee3937ef1c2e296a9b/1jm8i6b6f",
              },
              {
                key: "instagram_url",
                label: "Instagram URL",
                placeholder: "https://instagram.com/gemoraglobal",
              },
              {
                key: "linkedin_url",
                label: "LinkedIn URL",
                placeholder: "https://linkedin.com/company/gemoraglobal",
              },
              {
                key: "facebook_url",
                label: "Facebook URL",
                placeholder: "https://facebook.com/gemoraglobal",
              },
              {
                key: "pinterest_url",
                label: "Pinterest URL",
                placeholder: "https://pinterest.com/gemoraglobal",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  value={getSocial(key)}
                  onChange={(e) => setSocial(key, e.target.value)}
                  placeholder={placeholder}
                  className="mt-1"
                  data-ocid={`admin.settings.${key}.input`}
                />
                <SaveBtn k={key} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users & Roles */}
      {activeTab === "users" && (
        <div className="space-y-5">
          <div
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3 style={{ color: "#1A237E", fontWeight: 600, marginBottom: 16 }}>
              Admin Users
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Username", "Role", "Created", "Actions"].map((h) => (
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
                {users.map((u, i) => (
                  <tr
                    key={u.username}
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                    data-ocid={`admin.settings.users.item.${i + 1}`}
                  >
                    <td
                      style={{
                        padding: "10px",
                        fontSize: 14,
                        color: "#222",
                        fontWeight: 500,
                      }}
                    >
                      {u.username}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          background:
                            u.role === "Admin"
                              ? "rgba(212,175,55,0.2)"
                              : "rgba(26,35,126,0.1)",
                          color: u.role === "Admin" ? "#b8860b" : "#1A237E",
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontWeight: 600,
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td
                      style={{ padding: "10px", fontSize: 12, color: "#888" }}
                    >
                      {u.createdAt}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {u.username !== "admin" && (
                        <button
                          type="button"
                          onClick={() => {
                            const upd = users.filter(
                              (us) => us.username !== u.username,
                            );
                            localStorage.setItem(
                              "gemora_admin_users",
                              JSON.stringify(upd),
                            );
                            setUsers(upd);
                          }}
                          style={{
                            background: "crimson",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "3px 10px",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3 style={{ color: "#1A237E", fontWeight: 600, marginBottom: 16 }}>
              Add New Admin User
            </h3>
            <form
              onSubmit={addUser}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
            >
              <div>
                <Label>Username *</Label>
                <Input
                  value={newUserForm.username}
                  onChange={(e) =>
                    setNewUserForm((f) => ({ ...f, username: e.target.value }))
                  }
                  required
                  className="mt-1"
                  data-ocid="admin.settings.add_user.input"
                />
              </div>
              <div>
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) =>
                    setNewUserForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Role</Label>
                <select
                  style={{ ...inputStyle, marginTop: 4 }}
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm((f) => ({ ...f, role: e.target.value }))
                  }
                >
                  {["Admin", "Manager", "Staff", "Sales Agent"].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                style={{
                  background: "#1A237E",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
                data-ocid="admin.settings.add_user.submit_button"
              >
                Add User
              </button>
            </form>
            <div
              style={{
                background: "#f5f7ff",
                borderRadius: 8,
                padding: 12,
                marginTop: 16,
              }}
            >
              <p
                style={{
                  color: "#1A237E",
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                Role Descriptions
              </p>
              {[
                ["Admin", "Full access to all features"],
                ["Manager", "Products, orders, customers, analytics"],
                ["Staff", "Products and orders only"],
                ["Sales Agent", "Customers and inquiries only"],
              ].map(([role, desc]) => (
                <div key={role} className="flex gap-2 mb-1">
                  <span
                    style={{
                      color: "#888",
                      fontSize: 12,
                      minWidth: 80,
                      fontWeight: 600,
                    }}
                  >
                    {role}:
                  </span>
                  <span style={{ color: "#666", fontSize: 12 }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* API & Integrations */}
      {activeTab === "api" && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <h3 style={{ color: "#1A237E", fontWeight: 600, marginBottom: 16 }}>
            API & Integrations
          </h3>
          <div className="space-y-4">
            <div
              style={{
                background: "#f5f7ff",
                border: "1px solid #c5cae9",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <p style={{ color: "#1A237E", fontWeight: 600, fontSize: 13 }}>
                API Key
              </p>
              <div className="flex items-center gap-2 mt-2">
                <code
                  style={{
                    background: "#fff",
                    border: "1px solid #c5cae9",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: "#1A237E",
                    flex: 1,
                  }}
                >
                  {apiKey}
                </code>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(apiKey)
                      .then(() => toast.success("Copied!"))
                  }
                  style={{
                    background: "#1A237E",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  data-ocid="admin.settings.api_copy_button"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <Label>Webhook URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-server.com/webhook"
                  data-ocid="admin.settings.webhook_input"
                />
                <button
                  type="button"
                  onClick={() => toast.success("Webhook URL saved!")}
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
                >
                  Save
                </button>
              </div>
            </div>

            {[
              {
                name: "CRM Integration",
                desc: "Connect your CRM (HubSpot, Salesforce, Zoho) to sync customer data.",
                icon: "👥",
              },
              {
                name: "ERP Integration",
                desc: "Sync orders and inventory with your ERP system (SAP, Oracle, Tally).",
                icon: "🏭",
              },
              {
                name: "Analytics Tools",
                desc: "Connect Google Analytics, Mixpanel, or Hotjar for detailed insights.",
                icon: "📊",
              },
            ].map((integration) => (
              <div
                key={integration.name}
                style={{
                  background: "#f5f7ff",
                  border: "1px solid #c5cae9",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 18 }}>{integration.icon}</span>
                      <p
                        style={{
                          color: "#1A237E",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {integration.name}
                      </p>
                    </div>
                    <p style={{ color: "#888", fontSize: 12 }}>
                      {integration.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    style={{
                      background: "#e8eaf6",
                      color: "#1A237E",
                      border: "1px solid #c5cae9",
                      borderRadius: 8,
                      padding: "6px 14px",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                    onClick={() =>
                      toast.info(
                        "Contact globalgemora@gmail.com to set up custom integrations.",
                      )
                    }
                  >
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

