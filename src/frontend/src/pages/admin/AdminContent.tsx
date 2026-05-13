import api from '../../lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import { useStorageUpload } from "../../hooks/useStorageUpload";

// Normalize getContent result (string | null OR [] | [string])
function toStr(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") return v[0];
  return "";
}

const CONTENT_SECTIONS: {
  section: string;
  fields: {
    key: string;
    label: string;
    multiline?: boolean;
    isImage?: boolean;
    placeholder?: string;
    hint?: string;
  }[];
}[] = [
  {
    section: "🏠 Homepage",
    fields: [
      {
        key: "hero_image_1",
        label: "Hero Slider — Slide 1",
        isImage: true,
        hint: "Main banner image — shown first in the hero slider",
      },
      {
        key: "hero_image_2",
        label: "Hero Slider — Slide 2",
        isImage: true,
        hint: "Second banner image in the slider",
      },
      {
        key: "hero_image_3",
        label: "Hero Slider — Slide 3",
        isImage: true,
        hint: "Third banner image in the slider",
      },
      {
        key: "hero_title",
        label: "Hero Title",
        placeholder:
          "India's Leading Imitation Jewellery Manufacturer & Global Exporter",
        hint: "Main headline below the hero slider",
      },
      {
        key: "hero_subtitle",
        label: "Hero Subtitle",
        multiline: true,
        placeholder:
          "Premium handcrafted designs for wholesalers, boutiques & distributors worldwide.",
        hint: "Subtext below the hero headline",
      },
    ],
  },
  {
    section: "🖼 Logo & Branding",
    fields: [
      {
        key: "logo_url",
        label: "Website Logo",
        isImage: true,
        hint: "Upload your logo — shown in the header navigation bar",
      },
      {
        key: "footer_tagline",
        label: "Footer Tagline",
        placeholder: "Global Jewellery. Indian Craftsmanship.",
        hint: "Tagline shown in the website footer",
      },
      {
        key: "footer_about",
        label: "Footer About Text",
        multiline: true,
        placeholder:
          "India's leading imitation jewellery manufacturer & global exporter...",
        hint: "Short description shown in footer",
      },
    ],
  },
  {
    section: "📖 About Page",
    fields: [
      {
        key: "about_hero_image",
        label: "About Page Hero Image",
        isImage: true,
        hint: "Banner image shown at the top of the About page",
      },
      {
        key: "about_story",
        label: "Our Story Text",
        multiline: true,
        placeholder:
          "Gemora Global is India's premier imitation jewellery manufacturer...",
        hint: "Main paragraph on the About page",
      },
      {
        key: "about_export",
        label: "Export Experience Text",
        multiline: true,
        placeholder: "With over a decade of international trade experience...",
        hint: "Export experience section on About page",
      },
    ],
  },
  {
    section: "📦 Products & Wholesale",
    fields: [
      {
        key: "wholesale_hero_image",
        label: "Wholesale Page Hero Image",
        isImage: true,
        hint: "Banner image on the Wholesale & Export page",
      },
      {
        key: "wholesale_intro",
        label: "Wholesale Page Intro",
        multiline: true,
        placeholder: "Gemora Global offers premium wholesale jewellery...",
        hint: "Intro paragraph on the Wholesale & Export page",
      },
      {
        key: "moq_text",
        label: "MOQ Details",
        placeholder: "Minimum Order Quantity: 50 pieces per design",
        hint: "Minimum order quantity shown on wholesale page",
      },
    ],
  },
  {
    section: "🌐 Global Markets",
    fields: [
      {
        key: "global_markets_hero_image",
        label: "Global Markets Page Hero Image",
        isImage: true,
        hint: "Banner image on the Global Markets page",
      },
      {
        key: "global_markets_intro",
        label: "Global Markets Intro",
        multiline: true,
        placeholder: "We export to 20+ countries worldwide...",
        hint: "Intro text on the Global Markets page",
      },
    ],
  },
  {
    section: "📞 Contact Information",
    fields: [
      {
        key: "contact_email",
        label: "Email Address",
        placeholder: "globalgemora@gmail.com",
        hint: "Business email shown on Contact page and footer",
      },
      {
        key: "contact_phone",
        label: "Phone / WhatsApp Number",
        placeholder: "+91 7976341419",
        hint: "Phone number shown on Contact page, footer, and WhatsApp button",
      },
      {
        key: "contact_address",
        label: "Business Address",
        multiline: true,
        placeholder:
          "B 66 MAA Hinglaj Nagar, Gandhi Path West, Vaishali Nagar, Jaipur 302021",
        hint: "Physical address shown on Contact page and footer",
      },
      {
        key: "whatsapp_number",
        label: "WhatsApp Number (digits only, with country code)",
        placeholder: "917976341419",
        hint: "Used for the WhatsApp chat button (no + or spaces)",
      },
    ],
  },
  {
    section: "🌐 SEO Settings",
    fields: [
      {
        key: "seo_home_title",
        label: "Homepage SEO Title",
        placeholder: "Gemora Global | Leading Imitation Jewellery Exporter",
        hint: "Title shown in Google search results (keep under 60 chars)",
      },
      {
        key: "seo_home_description",
        label: "Homepage Meta Description",
        multiline: false,
        placeholder:
          "Premium handcrafted imitation jewellery exporter from India. MOQ-friendly wholesale supply...",
        hint: "Description shown in Google search results (keep under 155 chars)",
      },
      {
        key: "instagram_handle",
        label: "Instagram Handle",
        placeholder: "gemoraglobal",
        hint: "Your Instagram username (without @)",
      },
    ],
  },
];

// ── Image Upload Field ────────────────────────────────────────────────────────

function ImageField({
  contentKey,
  label,
  hint,
}: {
  contentKey: string;
  label: string;
  hint?: string;
}) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const { uploadFileDetailed, uploading, converting } = useStorageUpload();

  const { data } = useQuery({
    queryKey: ["content", contentKey],
    queryFn: () => api.getContent(contentKey),
    enabled: true,
  });

  const currentUrl = toStr(data);

  const saveMutation = useMutation({
    mutationFn: (url: string) => api.setContent(contentKey, url),
    onSuccess: () => {
      toast.success(`${label} updated`);
      qc.invalidateQueries({ queryKey: ["content"] });
      qc.invalidateQueries({ queryKey: ["content-all"] });
    },
    onError: () => toast.error("Failed to save"),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadFileDetailed(file);
      await saveMutation.mutateAsync(result.url);
    } catch {
      toast.error("Upload failed — check your connection and try again");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = async () => {
    await saveMutation.mutateAsync("");
  };

  const active = uploading || converting;

  return (
    <div
      style={{
        background: "#f5f7ff",
        border: "1px solid #c5cae9",
        borderRadius: 10,
        padding: 16,
      }}
      data-ocid={`cms.${contentKey}.card`}
    >
      <p
        style={{
          color: "#1A237E",
          fontSize: 13,
          fontWeight: 600,
          display: "block",
          marginBottom: 2,
        }}
      >
        {label}
      </p>
      {hint && (
        <p style={{ color: "#888", fontSize: 11, marginBottom: 10 }}>{hint}</p>
      )}

      <label
        htmlFor={`img-input-${contentKey}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: `2px dashed ${active ? "#42A5F5" : "#c5cae9"}`,
          borderRadius: 8,
          padding: "14px 12px",
          background: active ? "#e8f4fe" : "#fff",
          cursor: active ? "not-allowed" : "pointer",
          minHeight: 72,
          transition: "all 0.2s",
          gap: 6,
        }}
        data-ocid={`cms.${contentKey}.dropzone`}
      >
        <input
          id={`img-input-${contentKey}`}
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={active}
          onChange={handleUpload}
        />
        {active ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
              style={{ color: "#42A5F5" }}
            />
            <p style={{ color: "#42A5F5", fontSize: 11, fontWeight: 600 }}>
              {converting ? "Converting to WebP..." : "Uploading..."}
            </p>
          </>
        ) : (
          <p style={{ color: "#888", fontSize: 12 }}>
            Click to upload image{currentUrl ? " (replaces current)" : ""}
          </p>
        )}
      </label>

      {currentUrl && (
        <div
          style={{
            marginTop: 10,
            position: "relative",
            display: "inline-block",
          }}
        >
          <img
            src={currentUrl}
            alt={label}
            style={{
              height: 96,
              maxWidth: "100%",
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #c5cae9",
              display: "block",
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: "crimson",
              border: "none",
              borderRadius: "50%",
              width: 20,
              height: 20,
              color: "#fff",
              fontSize: 11,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Remove image"
            data-ocid={`cms.${contentKey}.delete_button`}
          >
            <X size={10} color="#fff" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Text Field ────────────────────────────────────────────────────────────────

function ContentField({
  contentKey,
  label,
  multiline,
  placeholder,
  hint,
}: {
  contentKey: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  const qc = useQueryClient();
  const [value, setValue] = useState("");

  const { data } = useQuery({
    queryKey: ["content", contentKey],
    queryFn: () => api.getContent(contentKey),
    enabled: true,
  });

  useEffect(() => {
    if (data !== undefined) setValue(toStr(data));
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => api.setContent(contentKey, value),
    onSuccess: () => {
      toast.success(
        `${label} saved — changes reflect on the website immediately`,
      );
      qc.invalidateQueries({ queryKey: ["content"] });
      qc.invalidateQueries({ queryKey: ["content-all"] });
    },
    onError: () => toast.error("Failed to save"),
  });

  return (
    <div
      style={{
        background: "#f5f7ff",
        border: "1px solid #c5cae9",
        borderRadius: 10,
        padding: 16,
      }}
      data-ocid={`cms.${contentKey}.card`}
    >
      <div style={{ marginBottom: 6 }}>
        <label
          htmlFor={`field-${contentKey}`}
          style={{
            color: "#1A237E",
            fontSize: 13,
            fontWeight: 600,
            display: "block",
            marginBottom: 2,
          }}
        >
          {label}
        </label>
        {hint && (
          <p style={{ color: "#888", fontSize: 11, marginBottom: 6 }}>{hint}</p>
        )}
      </div>
      {multiline ? (
        <Textarea
          id={`field-${contentKey}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          placeholder={placeholder}
          style={{
            background: "#fff",
            border: "1px solid #c5cae9",
            color: "#1A237E",
          }}
          data-ocid={`cms.${contentKey}.textarea`}
        />
      ) : (
        <Input
          id={`field-${contentKey}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          style={{
            background: "#fff",
            border: "1px solid #c5cae9",
            color: "#1A237E",
          }}
          data-ocid={`cms.${contentKey}.input`}
        />
      )}
      <Button
        size="sm"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        style={{
          background: "#1A237E",
          color: "#fff",
          border: "none",
          fontWeight: 700,
          marginTop: 10,
        }}
        data-ocid={`cms.${contentKey}.save_button`}
      >
        {mutation.isPending ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

// ── Main CMS Page ─────────────────────────────────────────────────────────────

export default function AdminContent() {
  return (
    <AdminLayout>
      <div style={{ maxWidth: 860 }}>
        <h1
          style={{
            color: "#1A237E",
            fontWeight: 700,
            fontSize: 22,
            marginBottom: 6,
          }}
        >
          Page Content Manager
        </h1>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 28 }}>
          Edit text and images for every page of your website. Changes are saved
          to the backend and reflect immediately — no developer needed.
        </p>

        {CONTENT_SECTIONS.map(({ section, fields }) => (
          <div key={section} style={{ marginBottom: 36 }}>
            <h2
              style={{
                color: "#1A237E",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 14,
                borderBottom: "2px solid #c5cae9",
                paddingBottom: 10,
              }}
            >
              {section}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {fields.map((f) =>
                f.isImage ? (
                  <ImageField
                    key={f.key}
                    contentKey={f.key}
                    label={f.label}
                    hint={f.hint}
                  />
                ) : (
                  <ContentField
                    key={f.key}
                    contentKey={f.key}
                    label={f.label}
                    multiline={f.multiline}
                    placeholder={f.placeholder}
                    hint={f.hint}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

