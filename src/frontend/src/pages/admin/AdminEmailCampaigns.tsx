import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Download, Mail, Search, Users, Globe, Copy, CheckCircle } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";

const API_BASE = (import.meta as { env: Record<string,string> }).env?.VITE_API_URL
  || 'https://gemora-global-2.onrender.com';

function getToken() {
  return sessionStorage.getItem('adminToken') || localStorage.getItem('admin_token') || '';
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

interface Contact {
  id: number; name: string; company: string; email: string;
  phone: string; country: string; productInterest: string; source: string;
}
interface Stats {
  total: number; withEmail: number; withPhone: number;
  byCountry: { country: string; count: number }[];
}

const EMAIL_TEMPLATES = [
  {
    id: 'intro',
    name: '📩 Introduction Email',
    subject: 'Premium Imitation Jewellery Wholesale from Jaipur, India — Gemora Global',
    body: `Dear {name},

I hope this message finds you well.

My name is [Your Name] from Gemora Global, a leading wholesale imitation jewellery manufacturer based in Jaipur, India. We have been supplying premium quality fashion jewellery to boutiques and distributors in 30+ countries since 2011.

We specialize in:
• Imitation & Antique Jewellery
• American Diamond (CZ) Sets
• Kundan & Meenakari Jewellery
• Gold Plated & Oxidised Collections
• Bridal Jewellery Sets

MOQ: 50 units | Factory-direct pricing | Anti-tarnish coating | Full export documentation

I would love to share our latest catalogue and wholesale price list with you. May I know your product requirements so I can send you the most relevant designs?

Warm regards,
[Your Name]
Gemora Global
📞 +91 7976341419
🌐 www.gemoraglobal.co
📧 globalgemora@gmail.com`,
  },
  {
    id: 'catalogue',
    name: '📦 Catalogue Offer',
    subject: 'New 2026 Jewellery Catalogue — 1700+ Wholesale Designs | Gemora Global',
    body: `Dear {name},

Greetings from Gemora Global, Jaipur!

We are excited to share that our 2026 wholesale jewellery catalogue is now ready with 1700+ new designs across all categories.

✨ What's New in 2026:
• 200+ American Diamond designs
• Korean & Minimalist collections
• New Bridal Sets (complete 7-piece)
• Oxidised & Antique collections
• Indo-Western fusion pieces

🎯 Why Gemora Global:
✅ Factory-direct — no middlemen
✅ MOQ 50 units (mix designs allowed)
✅ Anti-tarnish coating on all pieces
✅ DHL/FedEx worldwide shipping
✅ Full export documentation included

Would you like us to send the full catalogue? Please reply with your preferred categories and we'll send you relevant designs with price list.

Best regards,
[Your Name]
Gemora Global
📞 +91 7976341419 (WhatsApp available)
🌐 www.gemoraglobal.co`,
  },
  {
    id: 'followup',
    name: '🔁 Follow-up Email',
    subject: 'Following up — Wholesale Jewellery from Gemora Global',
    body: `Dear {name},

I wanted to follow up on my previous message about our wholesale imitation jewellery collection from Jaipur, India.

In case you missed it — Gemora Global offers:
• 1700+ wholesale jewellery designs
• MOQ just 50 units
• Competitive factory-direct pricing
• Export to {country} with full documentation

Many boutique owners from {country} have found our collections to be excellent sellers. I'd be happy to arrange a sample order so you can evaluate the quality before placing a bulk order.

Could we schedule a quick WhatsApp call to discuss your requirements? My number is +91 7976341419.

Looking forward to hearing from you.

Warm regards,
[Your Name]
Gemora Global
🌐 www.gemoraglobal.co`,
  },
];

export default function AdminEmailCampaigns() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  // Template state
  const [activeTab, setActiveTab] = useState<'contacts' | 'template'>('contacts');
  const [selectedTemplate, setSelectedTemplate] = useState(EMAIL_TEMPLATES[0]);
  const [subject, setSubject] = useState(EMAIL_TEMPLATES[0].subject);
  const [body, setBody] = useState(EMAIL_TEMPLATES[0].body);
  const [copied, setCopied] = useState(false);

  // Load stats once
  useEffect(() => {
    apiFetch<Stats>('/api/contacts/stats')
      .then(setStats)
      .catch(() => setStats({ total: 0, withEmail: 0, withPhone: 0, byCountry: [] }));
  }, []);

  // Load contacts on filter/page change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), pageSize: String(PAGE_SIZE),
      ...(search && { search }),
      ...(countryFilter && { country: countryFilter }),
    });
    apiFetch<{ items: Contact[]; total: number; pages: number }>(`/api/contacts?${params}`)
      .then(r => {
        setContacts(r.items || []);
        setTotal(r.total || 0);
        setTotalPages(r.pages || 0);
      })
      .catch(() => { setContacts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [search, countryFilter, page]);

  function exportCSV(country?: string) {
    const url = country
      ? `${API_BASE}/api/contacts/export?country=${encodeURIComponent(country)}`
      : `${API_BASE}/api/contacts/export`;
    fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = country ? `contacts-${country}.csv` : 'all-contacts.csv';
        a.click();
      });
  }

  function applyTemplate(t: typeof EMAIL_TEMPLATES[0]) {
    setSelectedTemplate(t);
    setSubject(t.subject);
    setBody(t.body);
  }

  function getMailtoLink(contact: Contact) {
    const personalizedBody = body
      .replace(/{name}/g, contact.name.split(' ')[0])
      .replace(/{country}/g, contact.country)
      .replace(/{company}/g, contact.company);
    return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(personalizedBody)}`;
  }

  function copyTemplate() {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openBulkMailto() {
    const filtered = contacts.filter(c => c.email);
    const emails = filtered.slice(0, 50).map(c => c.email).join(';');
    window.open(`mailto:${emails}?subject=${encodeURIComponent(subject)}`);
  }

  const byCountry = stats?.byCountry || [];

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" /> Email Campaigns
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage contacts & send email campaigns</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportCSV(countryFilter || undefined)} className="gap-2">
              <Download className="w-4 h-4" />
              {countryFilter ? `Export ${countryFilter}` : 'Export All CSV'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Contacts', value: stats?.total ?? '...', color: 'text-blue-600' },
            { label: 'With Email', value: stats?.withEmail ?? '...', color: 'text-green-600' },
            { label: 'With Phone', value: stats?.withPhone ?? '...', color: 'text-purple-600' },
            { label: 'Countries', value: byCountry.length || '...', color: 'text-orange-600' },
          ].map(s => (
            <div key={s.label} className="bg-card border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b">
          {(['contacts', 'template'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'contacts' ? '👥 Contacts' : '✉️ Email Templates'}
            </button>
          ))}
        </div>

        {/* ── CONTACTS TAB ── */}
        {activeTab === 'contacts' && (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Country sidebar */}
            <div className="w-full lg:w-56 flex-shrink-0">
              <div className="bg-card border rounded-xl p-3 sticky top-20">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Filter by Country</p>
                <button
                  onClick={() => { setCountryFilter(''); setPage(0); }}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm mb-1 transition-colors ${
                    !countryFilter ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  All Countries ({stats?.total ?? 0})
                </button>
                <div className="max-h-[60vh] overflow-y-auto space-y-0.5">
                  {byCountry.map(c => (
                    <div key={c.country} className="flex items-center gap-1 group">
                      <button
                        onClick={() => { setCountryFilter(c.country); setPage(0); }}
                        className={`flex-1 text-left px-2 py-1.5 rounded text-xs transition-colors ${
                          countryFilter === c.country
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        {c.country}
                        <span className={`ml-1 ${countryFilter === c.country ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          ({c.count})
                        </span>
                      </button>
                      <button
                        onClick={() => exportCSV(c.country)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:text-primary transition-all"
                        title={`Export ${c.country}`}
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contacts table */}
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search name, email, company..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(0); }}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
                {countryFilter && (
                  <Button variant="outline" size="sm" onClick={() => { setCountryFilter(''); setPage(0); }}>
                    {countryFilter} ✕
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {loading ? 'Loading...' : `${total} contacts${countryFilter ? ` in ${countryFilter}` : ''}`}
              </p>

              <div className="bg-card border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {['Name','Company','Email','Phone','Country','Action'].map(h => (
                          <th key={h} className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        Array.from({length: 8}).map((_, i) => (
                          <tr key={i} className="border-b">
                            {Array.from({length:6}).map((_, j) => (
                              <td key={j} className="px-3 py-2.5">
                                <div className="h-3.5 bg-muted animate-pulse rounded w-full" />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : contacts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-muted-foreground">
                            <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p className="font-medium">No contacts found</p>
                            <p className="text-xs mt-1">
                              {stats?.total ? 'Try a different search or filter' : 'Run import_contacts.js in browser console to import'}
                            </p>
                          </td>
                        </tr>
                      ) : contacts.map((c, i) => (
                        <tr key={c.id ?? i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-3 py-2.5">
                            <p className="font-medium text-sm leading-tight">{c.name}</p>
                            {c.productInterest && (
                              <p className="text-xs text-muted-foreground truncate max-w-[140px]" title={c.productInterest}>
                                {c.productInterest}
                              </p>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-[120px] truncate">{c.company}</td>
                          <td className="px-3 py-2.5">
                            <a href={`mailto:${c.email}`} className="text-xs text-primary hover:underline break-all">{c.email}</a>
                          </td>
                          <td className="px-3 py-2.5 text-xs font-mono whitespace-nowrap">{c.phone}</td>
                          <td className="px-3 py-2.5">
                            <span className="text-xs bg-muted px-1.5 py-0.5 rounded whitespace-nowrap">{c.country}</span>
                          </td>
                          <td className="px-3 py-2.5">
                            <a
                              href={getMailtoLink(c)}
                              className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors whitespace-nowrap"
                            >
                              <Mail className="w-3 h-3" /> Send Email
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                    <span className="text-xs text-muted-foreground">Page {page+1} of {totalPages} ({total} total)</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" disabled={page===0} onClick={() => setPage(p=>p-1)}>← Previous</Button>
                      <Button size="sm" variant="outline" disabled={page>=totalPages-1} onClick={() => setPage(p=>p+1)}>Next →</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TEMPLATE TAB ── */}
        {activeTab === 'template' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Template picker */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-xl p-4">
                <p className="text-sm font-semibold mb-3">Choose Template</p>
                <div className="space-y-2">
                  {EMAIL_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => applyTemplate(t)}
                      className={`w-full text-left px-3 py-3 rounded-lg border text-sm transition-colors ${
                        selectedTemplate.id === t.id
                          ? 'border-primary bg-primary/5 text-primary font-medium'
                          : 'border-border hover:border-primary/50 hover:bg-muted'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t space-y-2">
                  <Button onClick={copyTemplate} variant="outline" className="w-full gap-2" size="sm">
                    {copied ? <><CheckCircle className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Template</>}
                  </Button>
                  <Button onClick={openBulkMailto} className="w-full gap-2" size="sm">
                    <Mail className="w-4 h-4" /> Open in Email Client
                  </Button>
                  <Button onClick={() => exportCSV()} variant="outline" className="w-full gap-2" size="sm">
                    <Download className="w-4 h-4" /> Download Contacts CSV
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                  <p className="font-semibold mb-1">💡 How to use</p>
                  <ol className="space-y-1 list-decimal list-inside">
                    <li>Choose a template</li>
                    <li>Edit subject & body</li>
                    <li>In Contacts tab, click "Send Email" on any contact</li>
                    <li>Or copy template & paste in Gmail/Outlook</li>
                    <li>Use "Download CSV" to import contacts into Mailchimp / Brevo</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Template editor */}
            <div className="lg:col-span-2 space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Subject Line</label>
                <Input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="text-sm"
                  placeholder="Email subject..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Email Body
                  <span className="text-xs text-muted-foreground font-normal ml-2">
                    Use {'{name}'}, {'{country}'}, {'{company}'} as placeholders
                  </span>
                </label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={24}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary font-mono resize-y"
                  placeholder="Email body..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={copyTemplate} variant="outline" className="gap-2 flex-1">
                  {copied ? <><CheckCircle className="w-4 h-4 text-green-500" />Copied!</> : <><Copy className="w-4 h-4" />Copy Full Template</>}
                </Button>
                <Button onClick={openBulkMailto} className="gap-2 flex-1">
                  <Mail className="w-4 h-4" /> Open in Email Client (50 contacts)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
