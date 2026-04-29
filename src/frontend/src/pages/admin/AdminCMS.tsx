import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import { useActor } from "../../hooks/useActor";

const PAGES = [
  {
    id: "homepage",
    label: "Homepage",
    fields: [
      { key: "hero_title", label: "Hero Title", type: "text" },
      { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
      { key: "seo_description", label: "SEO Description", type: "textarea" },
    ],
  },
  {
    id: "about",
    label: "About Page",
    fields: [
      { key: "title", label: "Page Title", type: "text" },
      { key: "intro", label: "Introduction", type: "textarea" },
      { key: "mission", label: "Mission Statement", type: "textarea" },
    ],
  },
  {
    id: "wholesale",
    label: "Wholesale Page",
    fields: [
      { key: "title", label: "Page Title", type: "text" },
      { key: "intro", label: "Introduction", type: "textarea" },
      { key: "moq_info", label: "MOQ Information", type: "textarea" },
    ],
  },
  {
    id: "contact",
    label: "Contact Page",
    fields: [
      { key: "title", label: "Page Title", type: "text" },
      { key: "address", label: "Business Address", type: "textarea" },
      { key: "phone", label: "Phone Number", type: "text" },
      { key: "email", label: "Email Address", type: "text" },
    ],
  },
];

export default function AdminCMS() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [selectedPageId, setSelectedPageId] = useState(PAGES[0].id);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const selectedPage = PAGES.find((p) => p.id === selectedPageId)!;

  const { data: pageContent, isLoading } = useQuery({
    queryKey: ["page-content", selectedPageId],
    queryFn: async () => {
      const result = await actor!.getPageContent(selectedPageId);
      // getPageContent returns Array<[string, string]>
      const map: Record<string, string> = {};
      if (Array.isArray(result)) {
        for (const entry of result) {
          if (Array.isArray(entry) && entry.length === 2) {
            map[entry[0]] = entry[1];
          }
        }
      }
      return map;
    },
    enabled: !!actor,
  });

  // Populate form when data loads
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (pageContent) {
      setFieldValues(pageContent);
      setIsDirty(false);
    }
  }, [pageContent, selectedPageId]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const fields: [string, string][] = Object.entries(fieldValues).filter(
        ([, v]) => v !== "",
      );
      await actor!.setPageContent(selectedPageId, fields);
    },
    onSuccess: () => {
      toast.success("Page content saved successfully");
      qc.invalidateQueries({ queryKey: ["page-content", selectedPageId] });
      setIsDirty(false);
    },
    onError: () => toast.error("Failed to save content"),
  });

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handlePageSelect = (pageId: string) => {
    if (isDirty) {
      if (!confirm("You have unsaved changes. Switch pages anyway?")) return;
    }
    setSelectedPageId(pageId);
    setFieldValues({});
    setIsDirty(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">
            Page Content Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit text content for any page — changes reflect immediately on the
            website.
          </p>
        </div>
        {isDirty && (
          <Button
            className="bg-primary text-primary-foreground w-full sm:w-auto"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            data-ocid="admin.cms.save_button"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Page list */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-3 border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pages
              </p>
            </div>
            <nav className="flex flex-col">
              {PAGES.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => handlePageSelect(page.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium text-left transition-colors border-l-2 min-h-[44px] ${
                    selectedPageId === page.id
                      ? "bg-primary/10 text-primary border-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-transparent"
                  }`}
                  data-ocid={`admin.cms.page_tab.${page.id}`}
                >
                  <Edit2 className="w-3.5 h-3.5 shrink-0" />
                  {page.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-serif text-lg font-bold mb-1">
              {selectedPage.label}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Edit the text fields below. Changes are saved when you click "Save
              Changes".
            </p>

            {isLoading ? (
              <div className="space-y-4">
                {selectedPage.fields.map((f) => (
                  <div key={f.key} className="animate-pulse">
                    <div className="h-4 w-1/4 bg-muted rounded mb-2" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {selectedPage.fields.map((field) => (
                  <div key={field.key}>
                    <Label className="text-sm font-medium mb-1.5 block">
                      {field.label}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={fieldValues[field.key] ?? ""}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value)
                        }
                        rows={4}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        data-ocid={`admin.cms.${field.key}_textarea`}
                      />
                    ) : (
                      <Input
                        value={fieldValues[field.key] ?? ""}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value)
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        data-ocid={`admin.cms.${field.key}_input`}
                      />
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    {isDirty ? "⚠️ Unsaved changes" : "✓ All changes saved"}
                  </p>
                  <Button
                    className="bg-primary text-primary-foreground"
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending || !isDirty}
                    data-ocid="admin.cms.submit_button"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saveMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
