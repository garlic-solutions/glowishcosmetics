import Link from "next/link";
import Image from "next/image";
import { GiFlowerEmblem } from "react-icons/gi";
import { FiInstagram, FiFacebook } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";
import type { WebsiteSettings } from "@/types";

interface FooterProps {
  settings?: WebsiteSettings | null;
}

export function Footer({ settings }: FooterProps) {
  const socialLinks = [
    { Icon: FiFacebook, url: settings?.fburl || "#" },
    { Icon: FiInstagram, url: settings?.instaUrl || "#" },
    { Icon: FaTiktok, url: settings?.tiktokUrl || "#" },
  ];

  return (
    <footer className="bg-white border-t border-[#333333]/10">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center mb-4">
            <Image
              src="/images/logo/logo.webp"
              alt="Glowish Logo"
              width={120}
              height={54}
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium cosmetics crafted with love. Beauty that blooms with every use.
          </p>
          <div className="flex gap-4 mt-4">
            {socialLinks.map(({ Icon, url }, i) => (
              <a 
                key={i} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#333333] hover:text-[#835a71] transition-colors"
              >
                <Icon className="text-xl" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-[#333333] mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            {[["Home", "/"], ["Shop", "/shop"], ["About Us", "/about"], ["Contact", "/contact"], ["Terms of Service", "/terms"]].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="hover:text-[#333333] transition-colors">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-[#333333] mb-3">Get in Touch</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>{settings?.contactEmail || "info@glowishcosmetics.com"}</li>
            <li>{settings?.contactPhone || "+1 (555) 123-4567"}</li>
            <li>{settings?.contactAddress || "123 Beauty Lane, Bloom City"}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#333333]/10 py-8 text-[10px] tracking-widest uppercase text-gray-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>© {new Date().getFullYear()} Glowish Cosmetics. All rights reserved.</p>
          <p className="md:text-right">Solution by <a href="#" target="_blank" rel="noopener noreferrer" className="text-[#333333] hover:text-[#835a71] transition-colors font-medium">Rangers</a></p>
        </div>
      </div>
    </footer>
  );
}
