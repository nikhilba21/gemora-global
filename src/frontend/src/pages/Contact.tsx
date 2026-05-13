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
    return () => {};
  }, []);

  // ✅ FIXED MUTATION
  const mutation = useMutation({
    mutationFn: async () => {
      const extraInfo = [
        form.companyName ? `Company: ${form.companyName}` : "",
        form.email ? `Email: ${form.email}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const fullRequirement = extraInfo
        ? `${form.requirement}\n\n[${extraInfo}]`
        : form.requirement;

      return api.submitInquiry({
        name: form.name,
        country: form.country,
        whatsapp: form.whatsapp,
        requirement: fullRequirement,
      });
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

    onError: () => {
      toast.error("Failed to send inquiry. Please try WhatsApp.");
    },
  });

  // ✅ FIXED SUBMIT (removed actor bug)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const isConnecting = false;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        <div className="bg-card border-b border-border py-10 px-4">
          <div className="container">
            <h1 className="text-3xl font-bold mb-2">
              Contact Us
            </h1>
            <p className="text-muted-foreground">
              Send us your wholesale jewellery inquiry and we’ll respond within 24 hours.
            </p>
          </div>
        </div>

        <div className="container py-10 px-4 grid md:grid-cols-2 gap-10">

          {/* FORM */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">

              <Input
                placeholder="Your Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <Input
                placeholder="Company Name"
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
              />

              <Input
                placeholder="Country"
                value={form.country}
                onChange={(e) =>
                  setForm({ ...form, country: e.target.value })
                }
                required
              />

              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <Input
                placeholder="WhatsApp Number"
                value={form.whatsapp}
                onChange={(e) =>
                  setForm({ ...form, whatsapp: e.target.value })
                }
                required
              />

              <Textarea
                placeholder="Your Requirement"
                value={form.requirement}
                onChange={(e) =>
                  setForm({ ...form, requirement: e.target.value })
                }
                required
              />

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Inquiry"
                )}
              </Button>
            </form>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-4">
            <p><strong>Email:</strong> globalgemora@gmail.com</p>
            <p><strong>Phone:</strong> +91 7976341419</p>
            <p><strong>Location:</strong> Jaipur, India</p>

            <a
              href="https://wa.me/917976341419"
              target="_blank"
              className="block bg-green-500 text-white p-3 rounded text-center"
            >
              Chat on WhatsApp
            </a>

            <div className="mt-8 h-[300px] w-full rounded-lg overflow-hidden border border-border">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113896.790518386!2d75.713915124016!3d26.88514169018449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1715525000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

