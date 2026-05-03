import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Download, Mail, Search, Users, Globe, Filter } from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useActor } from "../../hooks/useActor";

const API_BASE = (import.meta as { env: Record<string,string> }).env?.VITE_API_URL || 'https://gemora-global-2.onrender.com';

function getToken() {
  return sessionStorage.getItem('adminToken') || localStorage.getItem('admin_token') || '';
}

export default function AdminEmailCampaigns() {
  const { actor } = useActor();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  // Fetch contacts with pagination
  const { data: result, isLoading } = useQuery({
    queryKey: ['contacts', search, countryFilter, page],
    queryFn: async () => {
      const token = getToken();
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
        ...(search && { search }),
        ...(countryFilter && { country: countryFilter }),
      });
      const res = await fetch(`${API_BASE}/api/contacts?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: true,
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['contacts-stats'],
    queryFn: async () => {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/contacts/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: true,
  });

  const contacts = result?.items || [];
  const totalPages = result?.pages || 0;
  const total = result?.total || 0;

  // Export CSV
  function exportCSV(country?: string) {
    const token = getToken();
    const url = country
      ? `${API_BASE}/api/contacts/export?country=${encodeURIComponent(country)}`
      : `${API_BASE}/api/contacts/export`;
    // Use fetch with auth header and trigger download
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = country ? `contacts-${country}.csv` : 'all-contacts.csv';
        a.click();
      });
  }

  const byCountry: { country: string; count: number }[] = stats?.byCountry || [];

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6" /> Email Campaigns
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage contacts for email marketing</p>
          </div>
          <Button onClick={() => exportCSV()} className="gap-2">
            <Download className="w-4 h-4" /> Export All CSV
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Contacts', value: stats?.total || 0, icon: Users, color: 'text-blue-600' },
            { label: 'With Email', value: stats?.withEmail || 0, icon: Mail, color: 'text-green-600' },
            { label: 'With Phone', value: stats?.withPhone || 0, icon: Globe, color: 'text-purple-600' },
            { label: 'Countries', value: byCountry.length, icon: Globe, color: 'text-orange-600' },
          ].map(s => (
            <div key={s.label} className="bg-card border rounded-xl p-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Country sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-4">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" /> By Country
              </h2>
              <button
                onClick={() => { setCountryFilter(''); setPage(0); }}
                className={`w-full text-left px-2 py-1.5 rounded text-sm mb-1 transition-colors ${!countryFilter ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                All Countries ({stats?.total || 0})
              </button>
              <div className="max-h-96 overflow-y-auto space-y-0.5">
                {byCountry.map(c => (
                  <div key={c.country} className="flex items-center justify-between group">
                    <button
                      onClick={() => { setCountryFilter(c.country); setPage(0); }}
                      className={`flex-1 text-left px-2 py-1.5 rounded text-xs transition-colors ${countryFilter === c.country ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      {c.country}
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <span className="text-xs text-muted-foreground">{c.count}</span>
                      <button
                        onClick={() => exportCSV(c.country)}
                        className="p-1 hover:text-primary"
                        title={`Export ${c.country}`}
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                    {countryFilter !== c.country && (
                      <span className="text-xs text-muted-foreground group-hover:hidden">{c.count}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contacts table */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, company..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(0); }}
                  className="pl-9"
                />
              </div>
              {countryFilter && (
                <Button variant="outline" onClick={() => { setCountryFilter(''); setPage(0); }}>
                  <Filter className="w-4 h-4 mr-1" /> {countryFilter} ✕
                </Button>
              )}
              <Button variant="outline" onClick={() => exportCSV(countryFilter || undefined)}>
                <Download className="w-4 h-4 mr-1" />
                {countryFilter ? `Export ${countryFilter}` : 'Export CSV'}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-2">{total} contacts{countryFilter ? ` from ${countryFilter}` : ''}</p>

            {/* Table */}
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Company</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Country</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array.from({length: 10}).map((_, i) => (
                        <tr key={i} className="border-b">
                          {Array.from({length:6}).map((_, j) => (
                            <td key={j} className="px-4 py-3">
                              <div className="h-4 bg-muted animate-pulse rounded w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : contacts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-muted-foreground">
                          <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
                          <p>No contacts found</p>
                          <p className="text-xs mt-1">Import contacts using the browser console script</p>
                        </td>
                      </tr>
                    ) : contacts.map((c: Record<string,string>, i: number) => (
                      <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.company}</td>
                        <td className="px-4 py-3">
                          <a href={`mailto:${c.email}`} className="text-primary hover:underline text-xs">{c.email}</a>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono">{c.phone}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{c.country}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[150px] truncate" title={c.productInterest}>
                          {c.productInterest}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
                  <span className="text-sm text-muted-foreground">Page {page+1} of {totalPages}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={page===0} onClick={() => setPage(p=>p-1)}>Previous</Button>
                    <Button size="sm" variant="outline" disabled={page>=totalPages-1} onClick={() => setPage(p=>p+1)}>Next</Button>
                  </div>
                </div>
              )}
            </div>

            {/* Import instructions */}
            {(!stats?.total || stats.total === 0) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">
                <p className="font-semibold text-yellow-800 mb-2">📋 Import Contacts</p>
                <p className="text-yellow-700">Download the <code>import_contacts.js</code> file and paste its contents in browser console (F12) after logging in as admin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
