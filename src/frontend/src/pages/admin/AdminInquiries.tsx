import api from '../../lib/api';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import type { Inquiry } from "../../types";
import { ExternalLink, MessageCircle, User, Globe, Phone, FileText } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  read: "bg-sky-500/20 text-sky-500 border-sky-500/30",
  replied: "bg-green-500/20 text-green-600 border-green-500/30",
};

export default function AdminInquiries() {
  const qc = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const { data: rawInquiries } = useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: () => api.getInquiries(),
    enabled: true,
  });
  const inquiries = Array.isArray(rawInquiries) ? rawInquiries : ((rawInquiries as any)?.items || []);

  const crmMut = useMutation({
    mutationFn: ({ id, data }: { id: bigint; data: Partial<Inquiry> }) =>
      api.updateInquiryCRM(Number(id), data),
    onSuccess: () => {
      toast.success("CRM details updated");
      qc.invalidateQueries({ queryKey: ["inquiries"] });
    },
    onError: () => toast.error("Failed to update CRM"),
  });

  const PIPELINE_STAGES = [
    "New", "Contacted", "Requirement Received", "Catalogue Shared", 
    "Sample Sent", "Negotiation", "Order Won", "Order Lost"
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-primary">CRM / Lead Pipeline</h1>
        <Badge variant="outline" className="text-muted-foreground">
          {inquiries.length} Inquiries
        </Badge>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table className="min-w-[700px]" data-ocid="admin.inquiries_table">
          <TableHeader>
            <TableRow className="bg-slate-50 border-b">
              <TableHead className="w-[180px] text-slate-900 font-bold">Buyer</TableHead>
              <TableHead className="w-[100px] text-slate-900 font-bold">Source</TableHead>
              <TableHead className="w-[150px] text-slate-900 font-bold">Pipeline Stage</TableHead>
              <TableHead className="w-[100px] text-slate-900 font-bold">Qualified</TableHead>
              <TableHead className="text-slate-900 font-bold">Status</TableHead>
              <TableHead className="text-right text-slate-900 font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries?.map((inq, i) => (
              <TableRow 
                key={String(inq.id)} 
                className="hover:bg-slate-50 cursor-pointer transition-colors border-b"
                onClick={() => setSelectedInquiry(inq)}
              >
                <TableCell>
                  <p className="font-bold text-slate-900">{inq.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" /> {inq.country}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600 border-none">
                    {inq.source || 'Website'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={inq.pipelineStage || "New"}
                    onValueChange={(v) => crmMut.mutate({ id: inq.id, data: { pipelineStage: v } })}
                  >
                    <SelectTrigger className="h-7 text-[11px] bg-transparent border-none p-0 focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PIPELINE_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 px-2 text-[10px] ${inq.qualified ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}
                    onClick={(e) => { e.stopPropagation(); crmMut.mutate({ id: inq.id, data: { qualified: !inq.qualified } }); }}
                  >
                    {inq.qualified ? "QUALIFIED" : "UNQUALIFIED"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge className={`${STATUS_COLORS[inq.status] || ""} capitalize text-[10px] font-bold`}>
                    {inq.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <Select
                      value={inq.status}
                      onValueChange={(v) => updateMut.mutate({ id: inq.id, status: v })}
                    >
                      <SelectTrigger className="w-24 h-8 text-xs bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => setSelectedInquiry(inq)}
                    >
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!inquiries || inquiries.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-16"
                  data-ocid="admin.inquiries_table.empty_state"
                >
                  <div className="flex flex-col items-center gap-2">
                    <MessageCircle className="w-8 h-8 opacity-20" />
                    <p>No inquiries yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Popup */}
      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl sm:p-8">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <DialogTitle className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
                  <User className="w-5 h-5 opacity-50" />
                  Lead: {selectedInquiry?.name}
                </DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Received on {selectedInquiry?.createdAt ? new Date(Number(selectedInquiry.createdAt)).toLocaleDateString() : 'Recent'} via {selectedInquiry?.source || 'Website'}
                </DialogDescription>
              </div>
              <Badge className={`${STATUS_COLORS[selectedInquiry?.status || 'new']} capitalize px-3 py-1`}>
                {selectedInquiry?.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Country</p>
                  <p className="font-medium">{selectedInquiry?.country}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">WhatsApp Number</p>
                  <p className="font-mono font-medium">{selectedInquiry?.whatsapp}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Lead Source</p>
                  <Select
                    value={selectedInquiry?.source || "Website"}
                    onValueChange={(v) => selectedInquiry && crmMut.mutate({ id: selectedInquiry.id, data: { source: v } })}
                  >
                    <SelectTrigger className="w-32 h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Website", "WhatsApp", "LinkedIn", "TradeIndia", "Alibaba", "IndiaMART", "Pinterest", "Instagram", "Referral"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pipeline Stage</p>
                  <Select
                    value={selectedInquiry?.pipelineStage || "New"}
                    onValueChange={(v) => selectedInquiry && crmMut.mutate({ id: selectedInquiry.id, data: { pipelineStage: v } })}
                  >
                    <SelectTrigger className="w-48 h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PIPELINE_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Assigned To</p>
                  <Select
                    value={selectedInquiry?.assignedTo || "Admin"}
                    onValueChange={(v) => selectedInquiry && crmMut.mutate({ id: selectedInquiry.id, data: { assignedTo: v } })}
                  >
                    <SelectTrigger className="w-32 h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Admin", "Manager", "Sales Team"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Full Requirement</h3>
            </div>
            <div className="bg-muted/50 rounded-xl p-5 border border-border shadow-inner max-h-[300px] overflow-y-auto">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground italic">
                "{selectedInquiry?.requirement}"
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-12"
              onClick={() => {
                if (!selectedInquiry) return;
                const url = `https://wa.me/${selectedInquiry.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${selectedInquiry.name}, thanks for your inquiry at Gemora Global regarding your requirement: "${selectedInquiry.requirement.slice(0, 50)}..."`)}`;
                window.open(url, '_blank');
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Reply on WhatsApp
            </Button>
            <Button
              variant="outline"
              className="h-12 border-primary text-primary"
              onClick={() => setSelectedInquiry(null)}
            >
              Close Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
