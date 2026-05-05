import api from '../lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageContent } from "../hooks/usePageContent";
import { usePageSEO } from "../hooks/usePageSEO";
import { useCanonical } from '../hooks/useCanonical';

export default function Contact() {
  useCanonical();
  const { content: pageContent } = usePageContent("contact");

  usePageSEO({
    title: "Wholesale Jewellery Enquiry India — Contact Gemora Global",
    description:
      "Send a wholesale jewellery enquiry to Gemora Global India. Get pricing, MOQ details & catalogue for imitation jewellery export. Response within 24 hours.",
    canonical: "https://www.gemoraglobal.co/contact",
    ogTitle: "Contact Gemora Global — Wholesale Jewellery Enquiry India",
    ogDescription:
      "Get wholesale imitation jewellery pricing, MOQ details & export catalogue from Gemora Global, Jaipur. We respond within 24 hours.",
    ogImage: "https://www.gemoraglobal.co/images/og-banner.jpg",
    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Gemora Global",
      telephone: "+91-7976341419",
      email: "globalgemora@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "B 66 MAA Hinglaj Nagar",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        postalCode: "302021",
        addressCountry: "IN",
      },
      openingHours: "Mo-Sa 09:00-19:00",
      priceRange: "$$",
    },
  });
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    country: "",
    whatsapp: "",
    requirement: "",
  });

  useEffect(() => {
    // usePageSEO handles all meta — keep this effect minimal for cleanup only
    return () => {};
  }, []);

  const mutation = useMutation({
    mutationFn: () => {
      // Append optional company name and email into the requirement field
      const extraInfo = [
        form.companyName ? `Company: ${form.companyName}` : "",
        form.email ? `Email: ${form.email}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
      const fullRequirement = extraInfo
        ? `${form.requirement}\n\n[${extraInfo}]`
        : form.requirement;
      return api.submitInquiry({name:
        form.name,country:
        form.country,whatsapp:
        form.whatsapp,requirement:
        fullRequirement}) : null,
      );
    },
    onSuccess: () => {
      toast.success("Inquiry sent! We'll contact you shortly.");
      setForm({
        name: "",
        companyName: "",
        email: "",
        country: "",
        whatsapp: "",
        requirement: "",
      });
    },
    onError: () => toast.error("Failed to send inquiry. Please try WhatsApp."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.info("Connecting to server, please try again in a moment.");
      return;
    }
    mutation.mutate();
  };

  const isConnecting = isFetching && !actor;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-card border-b border-border py-8 md:py-12 px-4">
          <div className="container px-0">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
              {pageContent.page_title ||
                "Contact Us — Wholesale Enquiries Answered Within 24 Hours"}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Whether you are placing your first order or scaling an existing
              buying relationship, our team is ready to assist. Browse our{" "}
              <Link to="/products" className="text-primary hover:underline">
                product range
              </Link>{" "}
              or{" "}
              <Link to="/gallery" className="text-primary hover:underline">
                download our catalogue
              </Link>{" "}
              before reaching out. We respond to all{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                wholesale enquiries
              </Link>{" "}
              within one business day.
            </p>
          </div>
        </div>

        <div className="container py-8 md:py-12 px-4">
          {/* Two-column on desktop, single column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Form — form fields full width, proper spacing */}
            <div>
              <h2 className="font-serif text-xl md:text-2xl font-bold mb-2">
                Send an Enquiry
              </h2>
              <p className="text-muted-foreground text-sm mb-5 md:mb-6">
                To help us give you the best quote quickly, please include: the
                product categories you are interested in, your target quantity
                per design, your destination country, your preferred delivery
                timeline, and any specific design requirements.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <Label htmlFor="name" className="text-sm mb-1.5 block">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your full name"
                    required
                    data-ocid="inquiry.input"
                    className="w-full min-h-[44px]"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName" className="text-sm mb-1.5 block">
                    Company / Business Name
                  </Label>
                  <Input
                    id="companyName"
                    value={form.companyName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, companyName: e.target.value }))
                    }
                    placeholder="Your company or store name (optional)"
                    data-ocid="inquiry.company_input"
                    className="w-full min-h-[44px]"
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-sm mb-1.5 block">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, country: e.target.value }))
                    }
                    placeholder="Your country"
                    required
                    className="w-full min-h-[44px]"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm mb-1.5 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="your@email.com (optional)"
                    data-ocid="inquiry.email_input"
                    className="w-full min-h-[44px]"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp" className="text-sm mb-1.5 block">
                    WhatsApp Number *
                  </Label>
                  <Input
                    id="whatsapp"
                    value={form.whatsapp}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, whatsapp: e.target.value }))
                    }
                    placeholder="+1 234 567 8900"
                    required
                    className="w-full min-h-[44px]"
                  />
                </div>
                <div>
                  <Label htmlFor="requirement" className="text-sm mb-1.5 block">
                    Your Requirement *
                  </Label>
                  <Textarea
                    id="requirement"
                    value={form.requirement}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, requirement: e.target.value }))
                    }
                    placeholder="Describe what you're looking for (product type, quantity, budget, etc.)"
                    rows={4}
                    required
                    data-ocid="inquiry.textarea"
                    className="w-full resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 min-h-[48px] text-base"
                  data-ocid="inquiry.submit_button"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Send Inquiry"
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info — stacked cards on mobile */}
            <div className="space-y-5 md:space-y-6">
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-bold mb-5 md:mb-6">
                  Contact Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
                  {[
                    {
                      icon: "📍",
                      label: "Address",
                      value:
                        pageContent.address ||
                        pageContent.contact_address ||
                        "B 66 MAA Hinglaj Nagar, Gandhi Path West, Vaishali Nagar, Jaipur 302021",
                    },
                    {
                      icon: "📧",
                      label: "Email",
                      value:
                        pageContent.email ||
                        pageContent.contact_email ||
                        "globalgemora@gmail.com",
                    },
                    {
                      icon: "📱",
                      label: "Phone / WhatsApp",
                      value:
                        pageContent.phone ||
                        pageContent.contact_phone ||
                        "+91 7976341419",
                    },
                    {
                      icon: "🕐",
                      label: "Business Hours",
                      value: "Mon–Sat: 10:00 AM – 6:30 PM IST",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex gap-3 p-3 bg-card border border-border rounded-lg"
                    >
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium break-words">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-card border border-border rounded-xl">
                  <h3 className="font-semibold text-sm mb-2">
                    What to Include in Your Message
                  </h3>
                  <ul className="space-y-1.5">
                    {[
                      "Product categories you are interested in",
                      "Target quantity per design",
                      "Destination country",
                      "Preferred delivery timeline",
                      "Any specific design requirements",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <span className="text-primary mt-0.5 flex-shrink-0">
                          •
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* WhatsApp CTA — full width, large touch target */}
              <a
                href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20wholesale%20jewellery."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-3.5 rounded-lg transition-colors w-full min-h-[48px] font-medium"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-white flex-shrink-0"
                  role="img"
                  aria-label="WhatsApp"
                >
                  <title>WhatsApp</title>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>

              {/* Map — full width, proper height */}
              <div className="rounded-xl overflow-hidden border border-border w-full">
                <iframe
                  src="https://maps.google.com/maps?q=Maa+Hinglaj+Nagar+Jaipur+Rajasthan+302021+India&output=embed"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Gemora Global Location - Vaishali Nagar, Jaipur"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
