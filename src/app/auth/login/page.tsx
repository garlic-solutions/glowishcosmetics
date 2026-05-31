"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GiFlowerEmblem } from "react-icons/gi";
import { FiMail, FiLock, FiEye, FiEyeOff, FiGift } from "react-icons/fi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (res?.ok) {
      toast.success("Welcome back! 🌸");
      router.push("/");
      router.refresh();
    } else {
      toast.error("Invalid email or password.");
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
          <h1 className="font-display text-3xl font-normal tracking-wide text-[#333333] mb-1">Welcome back</h1>
          <p className="text-[#333333]/60 text-sm tracking-wide">Sign in to access your member discounts</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-none p-8">
          {/* Discount callout */}
          <div className="bg-pink-50 px-4 py-3 mb-10 flex flex-col items-center gap-1 text-center">
            <FiGift className="text-[#835a71] text-lg" />
            <p className="text-sm text-[#835a71] font-normal tracking-wide">
              All the Registered Members enjoy <span className="font-bold">5% off</span> for every orders
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#333333]/40 text-base" />
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-[#f7f7f7] rounded-none pl-10 pr-4 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#333333]/40 text-base" />
                <input
                  required
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full bg-[#f7f7f7] rounded-none pl-10 pr-10 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2]"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#333333]/50 hover:text-[#333333] transition-colors">
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-[#835a71] font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-[#333333]/50 mt-4">
          <Link href="/shop" className="hover:text-[#333333] transition-colors">
            Continue browsing without account →
          </Link>
        </p>
      </div>
    </div>
  );
}
