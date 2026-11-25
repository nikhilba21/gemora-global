import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import AdminLayout from "../../components/AdminLayout";
import type { Inquiry } from "../../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  MessageCircle,
  Phone,
  Search,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Filter,
  Globe,
  User,
  FileText,
  Copy,
  Send,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  PhoneCall,
  Flame,
} from "lucide-react";

export type PipelineStage =
  | "New"
  | "Contacted"
  | "Requirement Received"
  | "Catalogue Shared"
  | "Sample Sent"
  | "Quotation Sent"
  | "Order Won"
  | "Order Lost";

export interface WhatsAppLead {
  id: string | number;
  name: string;
  whatsapp: string;
  email?: string;
  country: string;
  city?: string;
  source: string;
  pipelineStage: PipelineStage;
  requirement?: string;
  notes?: string;
  createdAt: string;
  lastContactedAt?: string | null;
  tags?: string[];
  isCustom?: boolean;
}

const PIPELINE_STAGES: PipelineStage[] = [
  "New",
  "Contacted",
  "Requirement Received",
  "Catalogue Shared",
  "Sample Sent",
  "Quotation Sent",
  "Order Won",
  "Order Lost",
];

const STAGE_CONFIG: Record<
  PipelineStage,
  { bg: string; text: string; border: string; icon: string }
> = {
  New: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/20",
    icon: "🔵",
  },
  Contacted: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-500/20",
    icon: "🟡",
  },
  "Requirement Received": {
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    border: "border-purple-500/20",
    icon: "🟣",
  },
  "Catalogue Shared": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-600",
    border: "border-indigo-500/20",
    icon: "📑",
  },
  "Sample Sent": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-600",
    border: "border-cyan-500/20",
    icon: "📦",
  },
  "Quotation Sent": {
    bg: "bg-orange-500/10",
    text: "text-orange-600",
    border: "border-orange-500/20",
    icon: "💰",
  },
  "Order Won": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-500/20",
    icon: "🎉",
  },
  "Order Lost": {
    bg: "bg-rose-500/10",
    text: "text-rose-600",
    border: "border-rose-500/20",
    icon: "⚪",
  },
};

const DEFAULT_TEMPLATES = [
  {
    id: "intro",
    title: "1. Welcome & Introduction",
    text: "Hi {name}, thank you for connecting with Gemora Global (Jaipur)! We are direct manufacturers of premium Kundan, AD & Bridal Imitation Jewellery (MOQ 50 units). How can we assist your boutique/business today?",
  },
  {
    id: "catalogue",
    title: "2. Latest 2026 Catalogue",
    text: "Hello {name}! Here is our latest 2026 Wholesale Jewellery Catalogue from Gemora Global Jaipur: https://www.gemoraglobal.co/catalogues . Please check the designs and let us know which pieces you would like factory pricing for.",
  },
  {
    id: "quote",
    title: "3. Direct Factory Quote & MOQ",
    text: "Dear {name}, regarding your wholesale jewellery requirement: we offer 100% factory-direct pricing with anti-tarnish micro-coating, 50 units MOQ, and insured worldwide express shipping. Would you like a formal price estimate?",
  },
  {
    id: "followup",
    title: "4. Follow-Up on Jewellery Inquiry",
    text: "Hi {name}, following up from Gemora Global regarding your jewellery requirement. Do you have any questions or require custom photos/videos of our ready stock pieces?",
  },
];

// Helper: Sanitize & normalize phone number for WhatsApp
export function sanitizeWhatsAppNumber(
  raw: string,
  defaultCountryCode = "91"
): string {
  if (!raw) return "";
  let cleaned = raw.replace(/[^\d+]/g, "").trim();
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.substring(2);
  }
  // 10 digits Indian mobile number (starts with 6,7,8,9)
  if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
    cleaned = `${defaultCountryCode}${cleaned}`;
  }
  // 11 digits with leading 0 (e.g. 09876543210 in India)
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = `${defaultCountryCode}${cleaned.substring(1)}`;
  }
  return cleaned;
}

// Helper: Format phone number for readability
export function formatPhoneNumber(num: string): string {
  const clean = sanitizeWhatsAppNumber(num);
  if (!clean) return num || "N/A";
  if (clean.startsWith("91") && clean.length === 12) {
    return `+91 ${clean.slice(2, 7)} ${clean.slice(7)}`;
  }
  if (clean.startsWith("1") && clean.length === 11) {
    return `+1 (${clean.slice(1, 4)}) ${clean.slice(4, 7)}-${clean.slice(7)}`;
  }
  if (clean.startsWith("971")) {
    return `+971 ${clean.slice(3)}`;
  }
  return `+${clean}`;
}

// Helper: Auto-detect Country from phone number prefix
export function detectCountryFromPhone(phone: string): string {
  if (!phone) return "India";
  const cleaned = phone.replace(/[^\d+]/g, "").trim();
  let code = cleaned;
  if (code.startsWith("00")) {
    code = "+" + code.substring(2);
  } else if (!code.startsWith("+")) {
    code = "+" + code;
  }

  // Common international prefixes
  if (code.startsWith("+91")) return "India";
  if (code.startsWith("+971")) return "UAE";
  if (code.startsWith("+966")) return "Saudi Arabia";
  if (code.startsWith("+974")) return "Qatar";
  if (code.startsWith("+965")) return "Kuwait";
  if (code.startsWith("+968")) return "Oman";
  if (code.startsWith("+973")) return "Bahrain";
  if (code.startsWith("+44")) return "United Kingdom";
  if (code.startsWith("+33")) return "France";
  if (code.startsWith("+31")) return "Netherlands";
  if (code.startsWith("+49")) return "Germany";
  if (code.startsWith("+39")) return "Italy";
  if (code.startsWith("+34")) return "Spain";
  if (code.startsWith("+32")) return "Belgium";
  if (code.startsWith("+41")) return "Switzerland";
  if (code.startsWith("+43")) return "Austria";
  if (code.startsWith("+46")) return "Sweden";
  if (code.startsWith("+47")) return "Norway";
  if (code.startsWith("+45")) return "Denmark";
  if (code.startsWith("+353")) return "Ireland";
  if (code.startsWith("+351")) return "Portugal";
  if (code.startsWith("+30")) return "Greece";
  if (code.startsWith("+48")) return "Poland";
  if (code.startsWith("+61")) return "Australia";
  if (code.startsWith("+64")) return "New Zealand";
  if (code.startsWith("+65")) return "Singapore";
  if (code.startsWith("+60")) return "Malaysia";
  if (code.startsWith("+62")) return "Indonesia";
  if (code.startsWith("+66")) return "Thailand";
  if (code.startsWith("+84")) return "Vietnam";
  if (code.startsWith("+81")) return "Japan";
  if (code.startsWith("+82")) return "South Korea";
  if (code.startsWith("+86")) return "China";
  if (code.startsWith("+852")) return "Hong Kong";
  if (code.startsWith("+27")) return "South Africa";
  if (code.startsWith("+234")) return "Nigeria";
  if (code.startsWith("+254")) return "Kenya";
  if (code.startsWith("+20")) return "Egypt";
  if (code.startsWith("+55")) return "Brazil";
  if (code.startsWith("+52")) return "Mexico";
  if (code.startsWith("+7")) return "Russia / Kazakhstan";
  if (code.startsWith("+90")) return "Turkey";
  if (code.startsWith("+94")) return "Sri Lanka";
  if (code.startsWith("+880")) return "Bangladesh";
  if (code.startsWith("+977")) return "Nepal";
  if (code.startsWith("+92")) return "Pakistan";
  if (code.startsWith("+1")) return "USA / Canada";

  const rawDigits = cleaned.replace(/\D/g, "");
  if (rawDigits.length === 10 && /^[6-9]/.test(rawDigits)) {
    return "India";
  }

  return "International";
}

// Helper: Decode Quoted-Printable vCard strings (e.g. =E0=A4=... or =20)
function decodeQuotedPrintable(raw: string): string {
  try {
    const cleaned = raw.replace(/=\r?\n/g, "");
    const percentEncoded = cleaned.replace(/=([0-9A-Fa-f]{2})/g, "%$1");
    return decodeURIComponent(percentEncoded);
  } catch {
    return raw.replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
  }
}

// Helper: Clean, unescape, and decode vCard values
function cleanVCardValue(val: string, isQuotedPrintable: boolean = false): string {
  if (!val) return "";
  let res = val.trim();
  if (isQuotedPrintable || (res.includes("=") && /=[0-9A-Fa-f]{2}/.test(res))) {
    res = decodeQuotedPrintable(res);
  }
  return res
    .replace(/\\([,;\\nN])/g, (_, ch) => (ch.toLowerCase() === "n" ? " " : ch))
    .trim();
}

export default function AdminWhatsAppLeads() {
  const qc = useQueryClient();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("ALL");
  const [selectedSource, setSelectedSource] = useState<string>("ALL");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [activeLeadForNotes, setActiveLeadForNotes] =
    useState<WhatsAppLead | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  // Templates
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState("intro");

  // New lead form state
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    whatsapp: "",
    country: "India",
    requirement: "",
    source: "WhatsApp Direct",
    pipelineStage: "New" as PipelineStage,
    notes: "",
  });

  // Google Contacts Import state
  const [importTab, setImportTab] = useState<"file" | "paste">("file");
  const [importRawText, setImportRawText] = useState("");
  const [parsedImportList, setParsedImportList] = useState<
    Array<{
      name: string;
      whatsapp: string;
      country: string;
      email?: string;
      notes?: string;
    }>
  >([]);
  const [importDefaultStage, setImportDefaultStage] =
    useState<PipelineStage>("New");
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local storage cache for offline resilience & custom leads
  const [customLeads, setCustomLeads] = useState<WhatsAppLead[]>(() => {
    try {
      const stored = localStorage.getItem("gemora_whatsapp_leads_crm");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save custom leads to local storage
  const persistCustomLeads = (updated: WhatsAppLead[]) => {
    setCustomLeads(updated);
    try {
      localStorage.setItem("gemora_whatsapp_leads_crm", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist leads to localStorage", e);
    }
  };

  // Fetch inquiries from backend
  const { data: rawInquiries, isLoading: isInquiriesLoading } = useQuery<
    Inquiry[]
  >({
    queryKey: ["inquiries"],
    queryFn: () => api.getInquiries(),
    staleTime: 30000,
  });

  // Convert backend inquiries to WhatsAppLead format
  const backendLeads: WhatsAppLead[] = useMemo(() => {
    const list = Array.isArray(rawInquiries)
      ? rawInquiries
      : ((rawInquiries as any)?.items || []);

    return list
      .filter((inq: any) => inq.whatsapp && inq.whatsapp.trim())
      .map((inq: any) => {
        let stage: PipelineStage = "New";
        const rawStage = (inq.pipelineStage || inq.status || "").toLowerCase();
        if (rawStage.includes("contacted") || rawStage === "read") stage = "Contacted";
        else if (rawStage.includes("require") || rawStage.includes("discuss"))
          stage = "Requirement Received";
        else if (rawStage.includes("catalogue") || rawStage.includes("catalog"))
          stage = "Catalogue Shared";
        else if (rawStage.includes("sample")) stage = "Sample Sent";
        else if (rawStage.includes("quote") || rawStage.includes("quotation"))
          stage = "Quotation Sent";
        else if (rawStage.includes("won") || rawStage.includes("replied"))
          stage = "Order Won";
        else if (rawStage.includes("lost")) stage = "Order Lost";

        return {
          id: inq.id,
          name: inq.name || "WhatsApp Inquirer",
          whatsapp: inq.whatsapp,
          country: inq.country || "Global",
          source: inq.source || "Website WhatsApp",
          pipelineStage: stage,
          requirement: inq.requirement || "",
          notes: inq.notes || "",
          createdAt: inq.createdAt
            ? new Date(Number(inq.createdAt)).toISOString()
            : new Date().toISOString(),
          lastContactedAt: inq.lastContactedAt || null,
          isCustom: false,
        };
      });
  }, [rawInquiries]);

  // Combine backend leads + custom/imported leads (avoiding duplicates by phone)
  const allLeads: WhatsAppLead[] = useMemo(() => {
    const map = new Map<string, WhatsAppLead>();

    // 1. Add backend inquiries
    backendLeads.forEach((l) => {
      const cleanPhone = sanitizeWhatsAppNumber(l.whatsapp);
      if (cleanPhone) map.set(cleanPhone, l);
    });

    // 2. Add / merge custom leads (custom leads take priority on CRM stage & notes)
    customLeads.forEach((cl) => {
      const cleanPhone = sanitizeWhatsAppNumber(cl.whatsapp);
      if (cleanPhone) {
        const existing = map.get(cleanPhone);
        if (existing) {
          map.set(cleanPhone, {
            ...existing,
            ...cl,
            notes: cl.notes || existing.notes,
            lastContactedAt: cl.lastContactedAt || existing.lastContactedAt,
            pipelineStage: cl.pipelineStage || existing.pipelineStage,
          });
        } else {
          map.set(cleanPhone, cl);
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const tA = new Date(a.createdAt).getTime() || 0;
      const tB = new Date(b.createdAt).getTime() || 0;
      return tB - tA;
    });
  }, [backendLeads, customLeads]);

  // Filtered leads based on search, stage, and source
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      // Stage filter
      if (selectedStage !== "ALL" && lead.pipelineStage !== selectedStage) {
        return false;
      }
      // Source filter
      if (selectedSource !== "ALL" && lead.source !== selectedSource) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(q);
        const matchesPhone = lead.whatsapp.includes(q);
        const matchesCountry = (lead.country || "").toLowerCase().includes(q);
        const matchesReq = (lead.requirement || "").toLowerCase().includes(q);
        const matchesNotes = (lead.notes || "").toLowerCase().includes(q);
        return (
          matchesName ||
          matchesPhone ||
          matchesCountry ||
          matchesReq ||
          matchesNotes
        );
      }
      return true;
    });
  }, [allLeads, selectedStage, selectedSource, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = allLeads.length;
    const newCount = allLeads.filter((l) => l.pipelineStage === "New").length;
    const inDiscussion = allLeads.filter((l) =>
      ["Contacted", "Requirement Received", "Catalogue Shared", "Quotation Sent"].includes(
        l.pipelineStage
      )
    ).length;
    const wonCount = allLeads.filter(
      (l) => l.pipelineStage === "Order Won"
    ).length;
    return { total, newCount, inDiscussion, wonCount };
  }, [allLeads]);

  // Unique sources for filter dropdown
  const uniqueSources = useMemo(() => {
    const s = new Set<string>();
    allLeads.forEach((l) => {
      if (l.source) s.add(l.source);
    });
    return Array.from(s);
  }, [allLeads]);

  // Update lead stage
  const handleStageChange = async (lead: WhatsAppLead, newStage: PipelineStage) => {
    const cleanPhone = sanitizeWhatsAppNumber(lead.whatsapp);
    const updatedCustom = customLeads.map((cl) => {
      if (sanitizeWhatsAppNumber(cl.whatsapp) === cleanPhone) {
        return { ...cl, pipelineStage: newStage };
      }
      return cl;
    });

    // If not in custom leads yet, add it
    if (!updatedCustom.some((cl) => sanitizeWhatsAppNumber(cl.whatsapp) === cleanPhone)) {
      updatedCustom.push({ ...lead, pipelineStage: newStage });
    }
    persistCustomLeads(updatedCustom);

    // If lead has a backend ID, sync with backend CRM endpoint
    if (typeof lead.id === "number" || (typeof lead.id === "string" && !isNaN(Number(lead.id)))) {
      try {
        await api.updateInquiryCRM(Number(lead.id), {
          pipelineStage: newStage,
        });
      } catch (e) {
        console.warn("Backend stage sync failed, saved locally", e);
      }
    }

    toast.success(`Updated ${lead.name} stage to "${newStage}"`);
  };

  // Open WhatsApp Chat with single click
  const handleOpenWhatsApp = (lead: WhatsAppLead, templateId?: string) => {
    const cleanPhone = sanitizeWhatsAppNumber(lead.whatsapp);
    if (!cleanPhone) {
      toast.error("Invalid WhatsApp number");
      return;
    }

    // Pick template
    const tId = templateId || selectedTemplateId;
    const tpl = templates.find((t) => t.id === tId) || templates[0];
    const message = tpl.text.replace(/\{name\}/g, lead.name || "there");

    const nowIso = new Date().toISOString();

    // Mark as Contacted if currently New
    const nextStage: PipelineStage =
      lead.pipelineStage === "New" ? "Contacted" : lead.pipelineStage;

    // Update in custom leads state & localStorage
    const updatedCustom = customLeads.map((cl) => {
      if (sanitizeWhatsAppNumber(cl.whatsapp) === cleanPhone) {
        return {
          ...cl,
          lastContactedAt: nowIso,
          pipelineStage: nextStage,
        };
      }
      return cl;
    });
    if (!updatedCustom.some((cl) => sanitizeWhatsAppNumber(cl.whatsapp) === cleanPhone)) {
      updatedCustom.push({
        ...lead,
        lastContactedAt: nowIso,
        pipelineStage: nextStage,
      });
    }
    persistCustomLeads(updatedCustom);

    // Open WhatsApp Web / WhatsApp Business
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    toast.success(`Opening WhatsApp chat with ${lead.name}`, {
      description: `Marked as ${nextStage}`,
    });
  };

  // Add Lead Mutation / Handler
  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name.trim() || !newLeadForm.whatsapp.trim()) {
      toast.error("Name and WhatsApp number are required");
      return;
    }

    const cleanPhone = sanitizeWhatsAppNumber(newLeadForm.whatsapp);
    const newEntry: WhatsAppLead = {
      id: `lead_${Date.now()}`,
      name: newLeadForm.name.trim(),
      whatsapp: newLeadForm.whatsapp.trim(),
      country: newLeadForm.country.trim() || "India",
      source: newLeadForm.source || "WhatsApp Direct",
      pipelineStage: newLeadForm.pipelineStage,
      requirement: newLeadForm.requirement.trim(),
      notes: newLeadForm.notes.trim(),
      createdAt: new Date().toISOString(),
      lastContactedAt: null,
      isCustom: true,
    };

    // Save to custom leads
    persistCustomLeads([newEntry, ...customLeads]);

    // Also attempt backend creation
    try {
      await api.submitInquiry({
        name: newEntry.name,
        country: newEntry.country,
        whatsapp: newEntry.whatsapp,
        requirement: newEntry.requirement,
        source: newEntry.source,
      });
      qc.invalidateQueries({ queryKey: ["inquiries"] });
    } catch (e) {
      console.warn("Backend submit failed, stored in CRM local cache", e);
    }

    toast.success(`Added ${newEntry.name} to WhatsApp Leads!`);
    setIsAddModalOpen(false);
    setNewLeadForm({
      name: "",
      whatsapp: "",
      country: "India",
      requirement: "",
      source: "WhatsApp Direct",
      pipelineStage: "New",
      notes: "",
    });
  };

  // Save Notes for Lead
  const handleSaveNotes = () => {
    if (!activeLeadForNotes) return;
    const cleanPhone = sanitizeWhatsAppNumber(activeLeadForNotes.whatsapp);

    const updatedCustom = customLeads.map((cl) => {
      if (sanitizeWhatsAppNumber(cl.whatsapp) === cleanPhone) {
        return { ...cl, notes: tempNotes };
      }
      return cl;
    });
    if (!updatedCustom.some((cl) => sanitizeWhatsAppNumber(cl.whatsapp) === cleanPhone)) {
      updatedCustom.push({ ...activeLeadForNotes, notes: tempNotes });
    }
    persistCustomLeads(updatedCustom);

    toast.success("Notes saved successfully");
    setIsNotesModalOpen(false);
  };

  // Delete / Archive Lead
  const handleDeleteLead = async (lead: WhatsAppLead) => {
    if (
      !confirm(
        `Are you sure you want to remove ${lead.name} (${lead.whatsapp}) from WhatsApp CRM?`
      )
    )
      return;

    const cleanPhone = sanitizeWhatsAppNumber(lead.whatsapp);
    const updatedCustom = customLeads.filter(
      (cl) => sanitizeWhatsAppNumber(cl.whatsapp) !== cleanPhone
    );
    persistCustomLeads(updatedCustom);

    // If backend ID exists
    if (typeof lead.id === "number" || (typeof lead.id === "string" && !isNaN(Number(lead.id)))) {
      try {
        await api.deleteInquiry(Number(lead.id));
        qc.invalidateQueries({ queryKey: ["inquiries"] });
      } catch (e) {
        console.warn("Backend delete inquiry failed", e);
      }
    }

    toast.success(`Lead ${lead.name} removed`);
  };

  // Export All Leads to CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads to export");
      return;
    }

    const headers = [
      "Name",
      "WhatsApp Number",
      "Country",
      "Pipeline Stage",
      "Source",
      "Requirement",
      "Notes",
      "Created At",
      "Last Contacted At",
    ];

    const rows = filteredLeads.map((l) => [
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${sanitizeWhatsAppNumber(l.whatsapp)}"`,
      `"${(l.country || "").replace(/"/g, '""')}"`,
      `"${l.pipelineStage}"`,
      `"${l.source}"`,
      `"${(l.requirement || "").replace(/"/g, '""')}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
      `"${l.createdAt || ""}"`,
      `"${l.lastContactedAt || "Never"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `gemora_whatsapp_leads_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredLeads.length} leads to CSV`);
  };

  // Parse Google Contacts CSV or vCard (.vcf)
  const parseGoogleContactsFile = async (file: File) => {
    try {
      const text = await file.text();
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".vcf") || fileName.endsWith(".vcard")) {
        // Parse vCard format
        const vcardContacts: Array<{
          name: string;
          whatsapp: string;
          country: string;
          email?: string;
          notes?: string;
        }> = [];

        // Unfold folded lines per RFC 6350 (lines starting with space or tab continue previous line)
        const unfoldedText = text.replace(/\r?\n[ \t]+/g, "");
        const cards = unfoldedText.split(/BEGIN:VCARD/i).slice(1);

        for (const card of cards) {
          let name = "";
          let orgName = "";
          let phone = "";
          let email = "";
          let notes = "";

          const lines = card.split(/\r?\n/);
          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;

            // Formatted Name: FN;CHARSET=UTF-8:... or FN:... or item1.FN:...
            const fnMatch = line.match(/^(?:item\d+\.)?FN(?:;([^:]*))?:(.*)$/i);
            if (fnMatch) {
              const params = fnMatch[1] || "";
              const rawVal = fnMatch[2] || "";
              const isQP = /ENCODING=QUOTED-PRINTABLE/i.test(params);
              const parsedName = cleanVCardValue(rawVal, isQP);
              if (parsedName && !name) {
                name = parsedName;
              }
              continue;
            }

            // Structured Name: N;CHARSET=UTF-8:Family;Given;Middle;Prefix;Suffix
            const nMatch = line.match(/^(?:item\d+\.)?N(?:;([^:]*))?:(.*)$/i);
            if (nMatch && !name) {
              const params = nMatch[1] || "";
              const rawVal = nMatch[2] || "";
              const isQP = /ENCODING=QUOTED-PRINTABLE/i.test(params);
              const parts = rawVal
                .split(";")
                .map((p) => cleanVCardValue(p, isQP))
                .filter(Boolean);
              if (parts.length >= 2) {
                const family = parts[0] || "";
                const given = parts[1] || "";
                const middle = parts[2] || "";
                name = [given, middle, family].filter(Boolean).join(" ").trim();
              } else if (parts.length === 1) {
                name = parts[0];
              }
              continue;
            }

            // Organization Name (ORG)
            const orgMatch = line.match(/^(?:item\d+\.)?ORG(?:;([^:]*))?:(.*)$/i);
            if (orgMatch) {
              const params = orgMatch[1] || "";
              const rawVal = orgMatch[2] || "";
              const isQP = /ENCODING=QUOTED-PRINTABLE/i.test(params);
              const parsedOrg = cleanVCardValue(rawVal.split(";")[0], isQP);
              if (parsedOrg && !orgName) {
                orgName = parsedOrg;
              }
              continue;
            }

            // Phone: TEL;TYPE=CELL;PREF:+... or item1.TEL:...
            const telMatch = line.match(/^(?:item\d+\.)?TEL(?:;[^:]*)?:(.*)$/i);
            if (telMatch) {
              const rawTel = telMatch[1].trim();
              if (rawTel && !phone && sanitizeWhatsAppNumber(rawTel)) {
                phone = rawTel;
              }
              continue;
            }

            // Email: EMAIL;TYPE=INTERNET:...
            const emailMatch = line.match(/^(?:item\d+\.)?EMAIL(?:;[^:]*)?:(.*)$/i);
            if (emailMatch) {
              const rawEmail = emailMatch[1].trim();
              if (rawEmail && !email) {
                email = rawEmail;
              }
              continue;
            }

            // Note: NOTE:...
            const noteMatch = line.match(/^(?:item\d+\.)?NOTE(?:;([^:]*))?:(.*)$/i);
            if (noteMatch) {
              const params = noteMatch[1] || "";
              const rawVal = noteMatch[2] || "";
              const isQP = /ENCODING=QUOTED-PRINTABLE/i.test(params);
              const parsedNote = cleanVCardValue(rawVal, isQP);
              if (parsedNote && !notes) {
                notes = parsedNote;
              }
              continue;
            }
          }

          // Fallback name if FN & N are absent but ORG is present
          if (!name && orgName) {
            name = orgName;
          }

          if (phone && sanitizeWhatsAppNumber(phone)) {
            const detectedCountry = detectCountryFromPhone(phone);
            const fallbackName = name
              ? name
              : `WhatsApp Buyer (+${sanitizeWhatsAppNumber(phone).slice(-4)})`;

            vcardContacts.push({
              name: fallbackName,
              whatsapp: phone,
              country: detectedCountry,
              email: email || undefined,
              notes: notes || undefined,
            });
          }
        }

        setParsedImportList(vcardContacts);
        if (vcardContacts.length > 0) {
          toast.success(`Found ${vcardContacts.length} contacts with names & numbers from vCard!`);
        } else {
          toast.warning("No contacts with valid phone numbers found in vCard.");
        }
      } else {
        // Strip UTF-8 BOM if present
        const cleanText = text.replace(/^\ufeff/, "");

        // Parse CSV rows handling quotes
        const rows: string[][] = [];
        let currentRow: string[] = [];
        let currentCell = "";
        let insideQuotes = false;

        for (let i = 0; i < cleanText.length; i++) {
          const char = cleanText[i];
          const nextChar = cleanText[i + 1];

          if (char === '"') {
            if (insideQuotes && nextChar === '"') {
              currentCell += '"';
              i++;
            } else {
              insideQuotes = !insideQuotes;
            }
          } else if (char === "," && !insideQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = "";
          } else if ((char === "\r" || char === "\n") && !insideQuotes) {
            if (char === "\r" && nextChar === "\n") i++;
            currentRow.push(currentCell.trim());
            if (currentRow.some((c) => c.length > 0)) {
              rows.push(currentRow);
            }
            currentRow = [];
            currentCell = "";
          } else {
            currentCell += char;
          }
        }
        if (currentCell || currentRow.length > 0) {
          currentRow.push(currentCell.trim());
          if (currentRow.some((c) => c.length > 0)) rows.push(currentRow);
        }

        if (rows.length < 2) {
          toast.error("CSV file appears to be empty or has no data rows");
          return;
        }

        const headers = rows[0].map((h) =>
          h.toLowerCase().trim().replace(/^"/, "").replace(/"$/, "")
        );

        // Find column indices
        const nameIdx = headers.findIndex(
          (h) => h === "name" || h === "display name" || h === "full name" || h.includes("display name")
        );
        const firstNameIdx = headers.findIndex(
          (h) => h === "first name" || h === "given name" || h.includes("first name") || h.includes("given name")
        );
        const lastNameIdx = headers.findIndex(
          (h) => h === "last name" || h === "family name" || h.includes("last name") || h.includes("family name")
        );
        const companyIdx = headers.findIndex(
          (h) => h === "company" || h === "organization" || h.includes("organization name") || h.includes("company name")
        );

        // Phone column indices
        const phoneIndices: number[] = [];
        headers.forEach((h, idx) => {
          if (
            h.includes("phone") ||
            h.includes("mobile") ||
            h.includes("tel") ||
            h === "whatsapp"
          ) {
            phoneIndices.push(idx);
          }
        });

        // Email, Country, Notes
        const countryIdx = headers.findIndex(
          (h) => h.includes("country") || h.includes("region")
        );
        const emailIdx = headers.findIndex(
          (h) => h.includes("e-mail") || h === "email"
        );
        const notesIdx = headers.findIndex(
          (h) => h.includes("notes") || h === "note"
        );

        const parsed: Array<{
          name: string;
          whatsapp: string;
          country: string;
          email?: string;
          notes?: string;
        }> = [];

        for (let r = 1; r < rows.length; r++) {
          const row = rows[r];
          let contactName = nameIdx !== -1 ? (row[nameIdx] || "").trim() : "";
          if (!contactName && firstNameIdx !== -1) {
            const first = (row[firstNameIdx] || "").trim();
            const last = lastNameIdx !== -1 ? (row[lastNameIdx] || "").trim() : "";
            contactName = `${first} ${last}`.trim();
          }
          if (!contactName && companyIdx !== -1) {
            contactName = (row[companyIdx] || "").trim();
          }

          // Search first available valid phone number
          let phoneVal = "";
          for (const pIdx of phoneIndices) {
            if (row[pIdx] && sanitizeWhatsAppNumber(row[pIdx])) {
              phoneVal = row[pIdx].trim();
              break;
            }
          }

          // Fallback: search any column that looks like a phone number
          if (!phoneVal) {
            for (let c = 0; c < row.length; c++) {
              const cell = (row[c] || "").trim();
              const digitsOnly = cell.replace(/\D/g, "");
              if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
                phoneVal = cell;
                break;
              }
            }
          }

          if (phoneVal && sanitizeWhatsAppNumber(phoneVal)) {
            let rowCountry = countryIdx !== -1 && row[countryIdx] ? row[countryIdx].trim() : "";
            if (!rowCountry || rowCountry.toLowerCase() === "india") {
              rowCountry = detectCountryFromPhone(phoneVal);
            }

            parsed.push({
              name: contactName || `WhatsApp Buyer (+${sanitizeWhatsAppNumber(phoneVal).slice(-4)})`,
              whatsapp: phoneVal,
              country: rowCountry,
              email: emailIdx !== -1 && row[emailIdx] ? row[emailIdx].trim() : undefined,
              notes: notesIdx !== -1 && row[notesIdx] ? row[notesIdx].trim() : undefined,
            });
          }
        }

        setParsedImportList(parsed);
        if (parsed.length > 0) {
          toast.success(
            `Found ${parsed.length} contacts with phone numbers in CSV!`
          );
        } else {
          toast.warning("No contacts with valid phone numbers were detected.");
        }
      }
    } catch (err: any) {
      console.error("Error reading contact file", err);
      toast.error("Failed to parse file: " + (err.message || "Unknown error"));
    }
  };

  // Parse Raw Pasted Text (e.g. from Excel or WhatsApp export)
  const parsePastedText = () => {
    if (!importRawText.trim()) {
      toast.error("Please paste contact details first");
      return;
    }

    const lines = importRawText.split(/\r?\n/);
    const parsed: Array<{
      name: string;
      whatsapp: string;
      country: string;
      notes?: string;
    }> = [];

    for (const line of lines) {
      if (!line.trim()) continue;
      // Split by tab, comma, or semicolon
      const parts = line.split(/[,\t;]/).map((p) => p.trim());
      if (parts.length >= 2) {
        // e.g. "Rahul, 9876543210, India" or "9876543210, Rahul"
        let name = parts[0];
        let phone = parts[1];
        let country = parts[2] ? parts[2].trim() : "";
        let notes = parts[3] || "";

        // If part[0] is digits, flip
        if (/^\+?\d{10,14}$/.test(name.replace(/[^\d+]/g, ""))) {
          const temp = name;
          name = phone;
          phone = temp;
        }

        if (sanitizeWhatsAppNumber(phone)) {
          if (!country) {
            country = detectCountryFromPhone(phone);
          }
          parsed.push({
            name: name || `WhatsApp Buyer (+${sanitizeWhatsAppNumber(phone).slice(-4)})`,
            whatsapp: phone,
            country,
            notes,
          });
        }
      } else {
        // Single phone on a line
        const digits = line.replace(/[^\d+]/g, "");
        if (digits.length >= 10) {
          parsed.push({
            name: `Direct Buyer (+${digits.slice(-4)})`,
            whatsapp: line.trim(),
            country: detectCountryFromPhone(line.trim()),
          });
        }
      }
    }

    setParsedImportList(parsed);
    toast.success(`Parsed ${parsed.length} contacts from pasted text!`);
  };

  // Execute Bulk Import
  const handleExecuteImport = async () => {
    if (parsedImportList.length === 0) {
      toast.error("No contacts to import");
      return;
    }

    setIsImporting(true);
    let importedCount = 0;
    let duplicateCount = 0;

    const existingPhones = new Set(
      allLeads.map((l) => sanitizeWhatsAppNumber(l.whatsapp))
    );

    const newLeadsToAdd: WhatsAppLead[] = [];

    for (const c of parsedImportList) {
      const clean = sanitizeWhatsAppNumber(c.whatsapp);
      if (existingPhones.has(clean)) {
        duplicateCount++;
        continue;
      }
      existingPhones.add(clean);

      const lead: WhatsAppLead = {
        id: `gcontact_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: c.name,
        whatsapp: c.whatsapp,
        email: c.email,
        country: c.country || "India",
        source: "Google Contacts",
        pipelineStage: importDefaultStage,
        requirement: c.notes || "Imported from Google Contacts",
        notes: c.notes || "",
        createdAt: new Date().toISOString(),
        lastContactedAt: null,
        isCustom: true,
      };

      newLeadsToAdd.push(lead);
      importedCount++;
    }

    // Persist to custom leads
    persistCustomLeads([...newLeadsToAdd, ...customLeads]);

    // Optional: send to backend
    for (const l of newLeadsToAdd.slice(0, 50)) {
      api
        .submitInquiry({
          name: l.name,
          country: l.country,
          whatsapp: l.whatsapp,
          requirement: l.requirement,
          source: l.source,
        })
        .catch(() => {});
    }

    setIsImporting(false);
    setIsImportModalOpen(false);
    setParsedImportList([]);
    setImportRawText("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    toast.success(
      `Successfully imported ${importedCount} contacts from Google Contacts!`,
      {
        description:
          duplicateCount > 0
            ? `${duplicateCount} existing numbers were automatically skipped.`
            : undefined,
      }
    );
  };

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg text-xl">
              💬
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
              WhatsApp Leads &amp; CRM Manager
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Single-click WhatsApp Business messaging, pipeline tracking, and Google Contacts import.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => setIsTemplateModalOpen(true)}
            variant="outline"
            size="sm"
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
            Quick Templates
          </Button>

          <Button
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
            size="sm"
            className="border-emerald-500/30 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 font-medium"
          >
            <Upload className="w-4 h-4 mr-1.5 text-emerald-600" />
            Import Google Contacts
          </Button>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="bg-[#1A237E] hover:bg-[#111868] text-white font-medium"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
            👥
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">
              Total WhatsApp Leads
            </p>
            <p className="text-2xl font-bold text-slate-900">{metrics.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-lg">
            ⚡
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-amber-600">
              New / Uncontacted
            </p>
            <p className="text-2xl font-bold text-slate-900">{metrics.newCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-lg">
            💬
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">
              In Discussion
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {metrics.inDiscussion}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
            🏆
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-emerald-600">
              Orders Won
            </p>
            <p className="text-2xl font-bold text-slate-900">{metrics.wonCount}</p>
          </div>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by buyer name, phone, country, notes..."
              className="pl-9 bg-white border-slate-200 h-9 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Stage filter */}
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="h-9 w-[170px] bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Filter Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Stages ({allLeads.length})</SelectItem>
                {PIPELINE_STAGES.map((st) => (
                  <SelectItem key={st} value={st}>
                    {STAGE_CONFIG[st].icon} {st} (
                    {allLeads.filter((l) => l.pipelineStage === st).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Source filter */}
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="h-9 w-[160px] bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Filter Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sources</SelectItem>
                {uniqueSources.map((src) => (
                  <SelectItem key={src} value={src}>
                    {src}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchQuery || selectedStage !== "ALL" || selectedSource !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStage("ALL");
                  setSelectedSource("ALL");
                }}
                className="text-xs h-9 text-slate-500 hover:text-slate-800"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Leads Table */}
        {filteredLeads.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-2xl mb-3">
              💬
            </div>
            <h3 className="font-semibold text-slate-800 text-base mb-1">
              No WhatsApp Leads Found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
              {searchQuery || selectedStage !== "ALL"
                ? "No leads matched your filter criteria. Try clearing search filters."
                : "Start managing WhatsApp leads by importing from Google Contacts or adding a lead manually."}
            </p>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => setIsImportModalOpen(true)}
                variant="outline"
                size="sm"
                className="border-emerald-500/40 text-emerald-700 bg-emerald-50/50"
              >
                <Upload className="w-4 h-4 mr-1.5" />
                Import Google Contacts
              </Button>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                size="sm"
                className="bg-[#1A237E] text-white"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add First Lead
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
                  <TableHead className="w-[200px] text-slate-800 font-bold text-xs">
                    Buyer &amp; Location
                  </TableHead>
                  <TableHead className="w-[160px] text-slate-800 font-bold text-xs">
                    WhatsApp Number
                  </TableHead>
                  <TableHead className="w-[170px] text-slate-800 font-bold text-xs">
                    Pipeline Stage
                  </TableHead>
                  <TableHead className="w-[130px] text-slate-800 font-bold text-xs">
                    Source
                  </TableHead>
                  <TableHead className="text-slate-800 font-bold text-xs">
                    Requirement &amp; Notes
                  </TableHead>
                  <TableHead className="w-[130px] text-slate-800 font-bold text-xs">
                    Last Contact
                  </TableHead>
                  <TableHead className="w-[170px] text-right text-slate-800 font-bold text-xs">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const stageStyle =
                    STAGE_CONFIG[lead.pipelineStage] || STAGE_CONFIG["New"];
                  const isNew = lead.pipelineStage === "New";

                  return (
                    <TableRow
                      key={String(lead.id)}
                      className={`hover:bg-slate-50/80 transition-colors border-b border-slate-100 ${
                        isNew ? "bg-blue-50/20" : ""
                      }`}
                    >
                      {/* Buyer Name & Country */}
                      <TableCell className="align-top py-3">
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                          {isNew && (
                            <span
                              className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0"
                              title="New Uncontacted Lead"
                            />
                          )}
                          <span>{lead.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{lead.country || "Global Buyer"}</span>
                        </div>
                        {lead.email && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                            {lead.email}
                          </div>
                        )}
                      </TableCell>

                      {/* WhatsApp / Phone */}
                      <TableCell className="align-top py-3">
                        <div className="font-mono text-xs font-semibold text-slate-800">
                          {formatPhoneNumber(lead.whatsapp)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${sanitizeWhatsAppNumber(lead.whatsapp)}`}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-primary transition-colors"
                            title="Call Phone"
                          >
                            <PhoneCall className="w-3 h-3 text-slate-400" /> Call
                          </a>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                sanitizeWhatsAppNumber(lead.whatsapp)
                              );
                              toast.success("Phone copied!");
                            }}
                            className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 hover:text-slate-600"
                            title="Copy number"
                          >
                            <Copy className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </TableCell>

                      {/* Pipeline Stage Select */}
                      <TableCell className="align-top py-3">
                        <Select
                          value={lead.pipelineStage}
                          onValueChange={(val) =>
                            handleStageChange(lead, val as PipelineStage)
                          }
                        >
                          <SelectTrigger
                            className={`h-7 text-xs font-semibold border ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border} rounded-md`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PIPELINE_STAGES.map((st) => (
                              <SelectItem key={st} value={st} className="text-xs">
                                {STAGE_CONFIG[st].icon} {st}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Source */}
                      <TableCell className="align-top py-3">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-medium bg-slate-100 text-slate-700 border-none"
                        >
                          {lead.source}
                        </Badge>
                      </TableCell>

                      {/* Requirement & Notes Preview */}
                      <TableCell className="align-top py-3">
                        <div
                          onClick={() => {
                            setActiveLeadForNotes(lead);
                            setTempNotes(lead.notes || "");
                            setIsNotesModalOpen(true);
                          }}
                          className="cursor-pointer group max-w-xs"
                          title="Click to view/edit notes"
                        >
                          {lead.requirement && (
                            <p className="text-xs text-slate-700 font-medium line-clamp-1">
                              {lead.requirement}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-500 line-clamp-1 italic group-hover:text-primary transition-colors flex items-center gap-1 mt-0.5">
                            <FileText className="w-2.5 h-2.5 flex-shrink-0 text-slate-400" />
                            {lead.notes
                              ? lead.notes
                              : "Click to add notes / requirements..."}
                          </p>
                        </div>
                      </TableCell>

                      {/* Last Contacted */}
                      <TableCell className="align-top py-3 text-xs text-slate-500">
                        {lead.lastContactedAt ? (
                          <div className="flex items-center gap-1 text-slate-600">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {new Date(lead.lastContactedAt).toLocaleDateString(
                                undefined,
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            Never
                          </span>
                        )}
                      </TableCell>

                      {/* Actions: Direct WhatsApp Chat */}
                      <TableCell className="align-top py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => handleOpenWhatsApp(lead)}
                            size="sm"
                            className="bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs h-8 px-3 shadow-sm rounded-lg flex items-center gap-1.5"
                            title="Single-click to open chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            Chat
                          </Button>

                          <button
                            onClick={() => handleDeleteLead(lead)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* MODAL: Import Google Contacts */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-lg">
                📥
              </span>
              Import Contacts from Google Contacts
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Export contacts from Google Contacts (contacts.google.com) as a CSV or vCard, or paste them directly below.
            </DialogDescription>
          </DialogHeader>

          {/* How to export guide banner */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-800 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              How to Export from Google Contacts:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600">
              <li>
                Open{" "}
                <a
                  href="https://contacts.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-medium inline-flex items-center gap-0.5"
                >
                  contacts.google.com <ExternalLink className="w-2.5 h-2.5" />
                </a>{" "}
                on your phone or computer.
              </li>
              <li>
                Click <strong>Export</strong> in the left sidebar (or under settings).
              </li>
              <li>
                Choose <strong>Google CSV</strong> or <strong>vCard</strong> (for iOS/Android), then click Export.
              </li>
              <li>Upload that downloaded file right here!</li>
            </ol>
          </div>

          {/* Import Tabs */}
          <div className="flex border-b border-slate-200 mt-2">
            <button
              onClick={() => setImportTab("file")}
              className={`pb-2.5 px-4 font-semibold text-sm border-b-2 transition-colors ${
                importTab === "file"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Upload CSV or vCard (.vcf)
            </button>
            <button
              onClick={() => setImportTab("paste")}
              className={`pb-2.5 px-4 font-semibold text-sm border-b-2 transition-colors ${
                importTab === "paste"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Paste Numbers / Text
            </button>
          </div>

          {importTab === "file" ? (
            <div className="py-4 space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40 p-8 rounded-xl text-center cursor-pointer transition-all"
              >
                <Upload className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-800 text-sm">
                  Click to select Google Contacts CSV or vCard (.vcf)
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports Google CSV, vCard (.vcf), or any Excel CSV file
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv, .vcf, .vcard, text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) parseGoogleContactsFile(file);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-3">
              <label className="text-xs font-semibold text-slate-700">
                Paste Contact Names &amp; Phone Numbers (one per line):
              </label>
              <Textarea
                rows={5}
                value={importRawText}
                onChange={(e) => setImportRawText(e.target.value)}
                placeholder="Example:&#10;Rahul Sharma, +91 9876543210, India&#10;Aisha Al-Mansoor, +971 501234567, UAE&#10;9829012345"
                className="font-mono text-xs"
              />
              <Button
                type="button"
                onClick={parsePastedText}
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                Parse Pasted Contacts
              </Button>
            </div>
          )}

          {/* Preview of Parsed Contacts */}
          {parsedImportList.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  Ready to Import: {parsedImportList.length} Contacts
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Initial Stage:</span>
                  <Select
                    value={importDefaultStage}
                    onValueChange={(v) =>
                      setImportDefaultStage(v as PipelineStage)
                    }
                  >
                    <SelectTrigger className="h-7 w-[120px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PIPELINE_STAGES.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sample preview table with editable names and removal */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Previewing first {Math.min(parsedImportList.length, 50)} contacts (names can be edited directly):</span>
                <button
                  type="button"
                  onClick={() => setParsedImportList([])}
                  className="text-red-600 hover:text-red-700 underline font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg text-xs">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b text-[11px] text-slate-600 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="p-2 text-left font-semibold">Contact / Buyer Name</th>
                      <th className="p-2 text-left font-semibold">Phone (WhatsApp)</th>
                      <th className="p-2 text-left font-semibold">Country</th>
                      <th className="p-2 text-center font-semibold w-10">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedImportList.slice(0, 50).map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-1.5">
                          <Input
                            className="h-7 text-xs font-medium py-1 px-2 border-slate-200 bg-white"
                            value={c.name}
                            onChange={(e) => {
                              const updated = [...parsedImportList];
                              updated[i] = { ...updated[i], name: e.target.value };
                              setParsedImportList(updated);
                            }}
                          />
                        </td>
                        <td className="p-1.5 font-mono text-slate-700 text-xs">
                          {c.whatsapp}
                        </td>
                        <td className="p-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                            {c.country || "India"}
                          </span>
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            title="Remove from import"
                            onClick={() => {
                              const updated = parsedImportList.filter((_, idx) => idx !== i);
                              setParsedImportList(updated);
                            }}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedImportList.length > 50 && (
                <p className="text-[11px] text-slate-400 text-center font-medium">
                  ...and {parsedImportList.length - 50} more contacts ready for 1-click import.
                </p>
              )}
            </div>
          )}

          <DialogFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsImportModalOpen(false);
                setParsedImportList([]);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={parsedImportList.length === 0 || isImporting}
              onClick={handleExecuteImport}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isImporting
                ? "Importing..."
                : `Confirm Import (${parsedImportList.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Add Single Lead Manually */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Add New WhatsApp Lead
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter buyer contact information to start managing communication.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddLeadSubmit} className="space-y-3.5 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Buyer / Business Name *
              </label>
              <Input
                required
                value={newLeadForm.name}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, name: e.target.value })
                }
                placeholder="e.g. Priya Sharma (Dubai Boutique)"
                className="mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                WhatsApp Phone Number *
              </label>
              <Input
                required
                value={newLeadForm.whatsapp}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, whatsapp: e.target.value })
                }
                placeholder="e.g. +91 9876543210 or 9876543210"
                className="mt-1 h-9 text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                Indian 10-digit numbers automatically formatted to +91.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Country / City
                </label>
                <Input
                  value={newLeadForm.country}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, country: e.target.value })
                  }
                  placeholder="e.g. UAE, USA, India"
                  className="mt-1 h-9 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Lead Source
                </label>
                <Select
                  value={newLeadForm.source}
                  onValueChange={(v) =>
                    setNewLeadForm({ ...newLeadForm, source: v })
                  }
                >
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp Direct">WhatsApp Direct</SelectItem>
                    <SelectItem value="Website Inquiry">Website Inquiry</SelectItem>
                    <SelectItem value="Instagram DM">Instagram DM</SelectItem>
                    <SelectItem value="Google Contacts">Google Contacts</SelectItem>
                    <SelectItem value="Trade Show / Exhibition">Trade Show</SelectItem>
                    <SelectItem value="Phone Referral">Phone Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Initial Pipeline Stage
              </label>
              <Select
                value={newLeadForm.pipelineStage}
                onValueChange={(v) =>
                  setNewLeadForm({
                    ...newLeadForm,
                    pipelineStage: v as PipelineStage,
                  })
                }
              >
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PIPELINE_STAGES.map((st) => (
                    <SelectItem key={st} value={st} className="text-xs">
                      {STAGE_CONFIG[st].icon} {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Jewellery Requirement / Initial Notes
              </label>
              <Textarea
                rows={2}
                value={newLeadForm.requirement}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, requirement: e.target.value })
                }
                placeholder="e.g. Interested in Kundan bridal necklace sets, MOQ 100 pcs"
                className="mt-1 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1A237E] hover:bg-[#111868] text-white"
              >
                Save Lead
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: View / Edit Notes */}
      <Dialog open={isNotesModalOpen} onOpenChange={setIsNotesModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Notes for {activeLeadForNotes?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Log conversation notes, order specifications, or quotation details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {activeLeadForNotes?.requirement && (
              <div className="bg-slate-50 p-2.5 rounded-lg border text-xs">
                <span className="font-semibold text-slate-700">
                  Initial Requirement:
                </span>
                <p className="text-slate-600 mt-0.5">
                  {activeLeadForNotes.requirement}
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700">
                CRM Notes / Follow-up Logs:
              </label>
              <Textarea
                rows={5}
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Write discussion notes here (e.g. Sent sample photos on WhatsApp, agreed on 50 units MOQ, awaiting payment details...)"
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNotesModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveNotes}
              className="bg-[#1A237E] hover:bg-[#111868] text-white"
            >
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Manage Quick WhatsApp Templates */}
      <Dialog
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
      >
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Quick WhatsApp Message Templates
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Customize standard 1-click messages sent to WhatsApp buyers. Use {"{name}"} to auto-fill buyer name.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {templates.map((tpl, idx) => (
              <div
                key={tpl.id}
                className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">
                    {tpl.title}
                  </span>
                  <label className="text-[11px] text-slate-500 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="defaultTemplate"
                      checked={selectedTemplateId === tpl.id}
                      onChange={() => setSelectedTemplateId(tpl.id)}
                    />
                    Default 1-Click Template
                  </label>
                </div>
                <Textarea
                  rows={3}
                  value={tpl.text}
                  onChange={(e) => {
                    const newTpls = [...templates];
                    newTpls[idx].text = e.target.value;
                    setTemplates(newTpls);
                  }}
                  className="bg-white text-xs"
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setIsTemplateModalOpen(false);
                toast.success("Templates updated successfully!");
              }}
              className="bg-[#1A237E] text-white"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
