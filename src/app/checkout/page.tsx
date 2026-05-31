"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { lkr, usdLabel } from "@/lib/currency";
import { FiGift } from "react-icons/fi";

const MEMBER_DISCOUNT = 0.05;

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

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", notes: "" });
  const [phoneCode, setPhoneCode] = useState("+94");
  const [loading, setLoading] = useState(false);

  // Pre-fill from session when it loads
  useEffect(() => {
    if (session?.user) {
      const mobile = session.user.mobile ?? "";
      const match = mobile.match(/^(\+\d{1,3})\s*(.*)$/);
      setForm((f) => ({
        ...f,
        customerName: session.user.name ?? f.customerName,
        phone: match ? match[2] : mobile,
      }));
      if (match) setPhoneCode(match[1]);
    }
  }, [session]);

  const subtotal = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0);
  const discountAmount = session ? subtotal * MEMBER_DISCOUNT : 0;
  const total = subtotal - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty!"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: `${phoneCode} ${form.phone}`,
          productIds: items.map((i) => i.product.id),
          customerEmail: session?.user?.email ?? undefined,
          discountApplied: discountAmount > 0 ? MEMBER_DISCOUNT * 100 : undefined,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      clearCart();
      toast.success("Order placed successfully! We'll contact you soon.");
      router.push("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-[#f7f7f7] rounded-none px-4 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2]";

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero */}
      <section className="py-16 sm:py-20 border-b border-[#333333]/10 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-3">Checkout</p>
          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-[#333333] mb-4">Complete Your Order</h1>
          <p className="text-[#333333]/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            Please provide your delivery details below to finalize your purchase. 
            All orders are processed with care and shipped within 1-2 business days.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            <div className="border border-[#333333]/10 p-6 sm:p-8 bg-white rounded-none">
              <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-2">Details</p>
              <h2 className="font-display text-2xl font-normal tracking-wide text-[#333333] mb-6 flex items-center gap-2">
                Your Delivery Information
                {session && <span className="text-[10px] uppercase tracking-widest font-normal text-[#835a71] bg-pink-50 px-2 py-0.5">(Pre-filled)</span>}
              </h2>

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Doe"
                    value={form.customerName}
                    onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                {/* Phone with country code */}
                <div>
                  <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Phone Number</label>
                  <div className="flex">
                    <select
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="bg-[#eee] border-r border-white rounded-none px-2 py-3 text-xs tracking-wider text-[#333333] focus:outline-none flex-shrink-0"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                    <input
                      required
                      type="tel"
                      placeholder="71 601 2640"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="flex-1 bg-[#f7f7f7] rounded-none px-4 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2] min-w-0"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Delivery Address</label>
                  <input
                    required
                    type="text"
                    placeholder="123 Main St, City, Country"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Order Notes (optional)</label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-[#f7f7f7] rounded-none px-4 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2] resize-none"
                    placeholder="Any special requests or delivery instructions?"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full mt-8 disabled:opacity-60">
                {loading ? "Processing Order..." : "Place Your Order"}
              </button>
              <p className="text-[11px] text-[#333333]/50 text-center mt-4 tracking-wide uppercase">
                By placing an order, you agree to our <Link href="/terms" className="underline hover:text-[#835a71]">Terms of Service</Link>
              </p>
            </div>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Guest discount banner */}
            {!session && (
              <div className="border border-[#333333]/10 bg-[#f8f8f8] p-5 flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white text-[#835a71] shrink-0 border border-[#333333]/10">
                  <FiGift className="text-xl" />
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-[#333333]/60 mb-1">Member Benefit</p>
                  <p className="text-sm text-[#333333] leading-relaxed">
                    <Link href="/auth/login" className="font-medium underline hover:text-[#835a71]">Sign in</Link>{" "}
                    to get <span className="font-bold">5% off</span> your order automatically.
                  </p>
                </div>
              </div>
            )}

            <div className="border border-[#333333]/10 p-6 sm:p-8 bg-white rounded-none shadow-sm">
              <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-2">Summary</p>
              <h2 className="font-display text-2xl font-normal tracking-wide text-[#333333] mb-6">Your Basket</h2>

              {items.length === 0 ? (
                <div className="py-12 text-center text-[#333333]/40">
                  <p className="text-sm">Your basket is empty</p>
                  <Link href="/shop" className="text-xs uppercase tracking-widest underline mt-4 block">Return to shop</Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-none overflow-hidden bg-[#f7f7f7] flex-shrink-0 border border-[#333333]/5">
                          {product.image ? (
                            <Image src={product.image.url} alt={product.name} fill className="object-cover" sizes="64px" />
                          ) : (
                            <span className="flex items-center justify-center h-full text-2xl">🌸</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#333333] truncate tracking-wide">{product.name}</p>
                          <p className="text-xs text-[#333333]/50 font-light mt-0.5">Quantity: {quantity}</p>
                        </div>
                        {product.price && (
                          <p className="text-sm font-normal text-[#333333]">
                            {lkr(product.price * quantity)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#333333]/10 pt-6 space-y-3">
                    <div className="flex justify-between text-xs tracking-widest uppercase text-[#333333]/60">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#333333]">{lkr(subtotal)}</span>
                    </div>
                    {session && discountAmount > 0 && (
                      <div className="flex justify-between text-xs tracking-widest uppercase text-[#835a71]">
                        <span>Member discount (5%)</span>
                        <span className="font-medium">−{lkr(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline pt-4 border-t border-[#333333]/10 mt-4">
                      <span className="font-display text-lg font-normal tracking-wide text-[#333333]">Total</span>
                      <div className="text-right">
                        <p className="font-display text-2xl text-[#333333]">{lkr(total)}</p>
                        <p className="text-xs text-[#333333]/40 font-light mt-1">{usdLabel(total)} USD</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
