"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GiFlowerEmblem } from "react-icons/gi";
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiGift } from "react-icons/fi";
import toast from "react-hot-toast";

const COUNTRY_CODES = [
  { code: "+94", label: "🇱🇰 +94" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1",  label: "🇺🇸 +1"  },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+971",label: "🇦🇪 +971"},
  { code: "+65", label: "🇸🇬 +65" },
  { code: "+60", label: "🇲🇾 +60" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [mobileCode, setMobileCode] = useState("+94");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mobile: `${mobileCode} ${form.mobile}` }),
      });
      const data = await res.json();

      if (!res.ok) { toast.error(data.error ?? "Registration failed"); setLoading(false); return; }

      // Auto sign-in after registration
      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      setLoading(false);
      if (signInRes?.ok) {
        toast.success("Account created! Welcome to Glowish 🌸");
        router.push("/");
        router.refresh();
      } else {
        toast.success("Account created! Please sign in.");
        router.push("/auth/login");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <Image 
              src="/images/logo/logo.webp" 
              alt="Glowish Logo" 
              width={160} 
              height={48} 
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className="font-display text-3xl font-normal tracking-wide text-[#333333] mb-1">Create account</h1>
          <p className="text-[#333333]/60 text-sm tracking-wide">Just your name, email and mobile</p>
        </div>

        {/* Perks banner */}
        <div className="bg-pink-50 px-4 py-3 mb-6 flex flex-col items-center gap-1 text-center">
          <FiGift className="text-[#835a71] text-lg" />
          <p className="text-sm text-[#835a71] font-normal tracking-wide">
            Create an account and enjoy member-only offers on every order
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-none py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#333333]/40" />
                <input required type="text" placeholder="Jane Doe" value={form.name} onChange={set("name")}
                  className="w-full bg-[#f7f7f7] rounded-none pl-10 pr-4 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2]" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#333333]/40" />
                <input required type="email" placeholder="you@example.com" value={form.email} onChange={set("email")}
                  className="w-full bg-[#f7f7f7] rounded-none pl-10 pr-4 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2]" />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Mobile number</label>
              <div className="flex">
                <select
                  value={mobileCode}
                  onChange={(e) => setMobileCode(e.target.value)}
                  className="rounded-none px-2 py-3 text-sm bg-[#efefef] text-[#333333] focus:outline-none focus:bg-[#e9e9e9] flex-shrink-0"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#333333]/40" />
                  <input required type="tel" placeholder="71 601 2640" value={form.mobile} onChange={set("mobile")}
                    className="w-full bg-[#f7f7f7] rounded-none pl-10 pr-4 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2]" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#333333]/40" />
                <input required type={showPw ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={set("password")}
                  className="w-full bg-[#f7f7f7] rounded-none pl-10 pr-10 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2]" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#333333]/50 hover:text-[#333333] transition-colors">
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">
              {loading ? "Creating account..." : "Create Account — It's Free"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6 px-2">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#835a71] font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-sm text-[#333333]/50 mt-4">
          <Link href="/checkout" className="hover:text-[#333333] transition-colors">
            Continue as guest →
          </Link>
        </p>
      </div>
    </div>
  );
}
