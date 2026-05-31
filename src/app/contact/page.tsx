import Image from "next/image";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { hygraphClient, hygraphSafeRequest } from "@/lib/hygraph";
import { GET_WEBSITE_SETTINGS } from "@/lib/queries";
import type { WebsiteSettings } from "@/types";
import { ContactForm } from "@/components/contact/ContactForm";

export const revalidate = 3600;

async function getSettings(): Promise<WebsiteSettings | null> {
  try {
    const data = await hygraphSafeRequest<any>(GET_WEBSITE_SETTINGS);
    return data.websiteSettings?.[0] || data.websiteSetting || null;
  } catch (err) {
    console.error("Contact settings fetch failed:", err);
    return null;
  }
}

export default async function ContactPage() {
  const settings = await getSettings();

  const CONTACT_ITEMS = [
    { 
      icon: FiMail, 
      label: "Email", 
      value: settings?.contactEmail || "info@glowishcosmetics.com" 
    },
    { 
      icon: FiPhone, 
      label: "Phone", 
      value: settings?.contactPhone || "+1 (555) 123-4567" 
    },
    { 
      icon: FiMapPin, 
      label: "Address", 
      value: settings?.contactAddress || "123 Beauty Lane, Bloom City, BC 12345" 
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-16 sm:py-20 border-b border-[#333333]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-3">Contact</p>
          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-[#333333] mb-4">We Would Love to Hear From You</h1>
          <p className="text-[#333333]/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Questions about products, orders, or K-beauty routines? Reach out anytime and our team will get back as soon as we can.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 grid lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Info column */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-3">Get in Touch</p>
            <h2 className="font-display text-3xl font-normal tracking-wide text-[#333333] mb-4">Glowish Cosmetics</h2>
            <p className="text-[#333333]/75 text-sm leading-relaxed">
              Prefer email or a quick call? Use the details below. For order updates, please include your order reference in your message.
            </p>
          </div>

          <div className="space-y-4">
            {CONTACT_ITEMS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 border border-[#333333]/10 p-4 sm:p-5 bg-white">
                <div className="w-11 h-11 flex items-center justify-center bg-[#f7f7f7] text-[#835a71] shrink-0">
                  <Icon className="text-lg" />
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-[#333333]/60 mb-1">{label}</p>
                  <p className="text-sm text-[#333333] leading-relaxed">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-4 border border-[#333333]/10 p-4 sm:p-5 bg-[#f8f8f8]">
            <div className="w-11 h-11 flex items-center justify-center bg-white text-[#835a71] shrink-0 border border-[#333333]/10">
              <FiClock className="text-lg" />
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-[#333333]/60 mb-1">Response time</p>
              <p className="text-sm text-[#333333]/80 leading-relaxed">
                We typically reply within 1–2 business days.
              </p>
            </div>
          </div>

          <div className="relative min-h-[200px] border border-[#333333]/10 overflow-hidden">
            <Image
              src="/images/carousel/slide3.png"
              alt="Glowish beauty and skincare"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* Form */}
        <ContactForm />
      </section>
    </div>
  );
}
