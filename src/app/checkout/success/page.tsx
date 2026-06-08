"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { lkr, usdLabel } from "@/lib/currency";
import { FiCheckCircle, FiCopy, FiCheck, FiMapPin, FiPhone, FiMail, FiUser, FiInfo, FiCreditCard } from "react-icons/fi";
import { hygraphClient } from "@/lib/hygraph";
import { GET_BANK_ACCOUNTS } from "@/lib/queries";
import type { BankAccount } from "@/types";
import toast from "react-hot-toast";

interface OrderSummaryItem {
  name: string;
  quantity: number;
  price?: number;
  code: string;
  image?: string;
}

interface OrderSummaryData {
  orderNumber: number;
  orderId: string;
  customerName: string;
  customerEmail?: string;
  phone: string;
  address: string;
  paymentMethod: "cod" | "bank_transfer";
  notes?: string;
  total: number;
  discountApplied: number;
  items: OrderSummaryItem[];
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderSummaryData | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("latestOrder");
    if (!data) {
      toast.error("No recent order found.");
      router.push("/shop");
      return;
    }
    try {
      setOrder(JSON.parse(data));
    } catch {
      router.push("/shop");
    }
  }, [router]);

  useEffect(() => {
    if (order?.paymentMethod === "bank_transfer") {
      const fetchBankAccounts = async () => {
        try {
          const result = await hygraphClient.request<{ websiteSettings: { bankAccounts?: BankAccount[] }[] }>(GET_BANK_ACCOUNTS);
          const accounts = result?.websiteSettings?.[0]?.bankAccounts;
          if (accounts && Array.isArray(accounts)) {
            setBankAccounts(accounts);
          }
        } catch (err) {
          console.error("Failed to fetch bank accounts from Hygraph:", err);
        }
      };
      fetchBankAccounts();
    }
  }, [order]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Account number copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[#333333]/60 animate-pulse text-sm uppercase tracking-widest">Loading order details...</p>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

  const renderBankTransfer = (isMobile: boolean) => {
    if (order.paymentMethod !== "bank_transfer") return null;
    return (
      <div className={`border border-[#835a71]/30 p-6 sm:p-8 bg-pink-50/20 relative overflow-hidden ${isMobile ? "md:hidden mb-8" : "hidden md:block mb-10"}`}>
        <div className="absolute top-0 left-0 w-2 h-full bg-[#835a71]" />
        <h2 className="font-display text-2xl font-normal text-[#835a71] tracking-wide mb-3">Direct Bank Transfer Details</h2>
        <p className="text-sm text-[#333333]/80 leading-relaxed mb-6 font-light">
          Please make your payment directly into our bank account. Use your Order Number{" "}
          <strong className="text-[#835a71]">#{order.orderNumber}</strong> as the payment reference.
          Note that we will not process or ship the order until the funds have cleared in our account.
        </p>

        {bankAccounts.length > 0 ? (
          <div className="space-y-6">
            {bankAccounts.map((acc, index) => (
              <div key={index} className="p-4 bg-white border border-[#333333]/10 rounded-none shadow-sm space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#333333]/40 font-semibold">Bank Name</p>
                    <p className="text-sm font-semibold text-[#333333] mt-0.5">{acc.bank}</p>
                  </div>
                  <span className="text-[10px] bg-pink-50 text-[#835a71] px-2 py-0.5 uppercase tracking-widest font-semibold">Account {index + 1}</span>
                </div>

                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 border-t border-[#333333]/5 pt-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#333333]/40">Account Name</p>
                    <p className="text-xs font-medium text-[#333333] mt-0.5">{acc.nameInAccount}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#333333]/40">Account Number</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-sm font-bold text-[#835a71]">{acc.accNumber}</span>
                      <button
                        onClick={() => handleCopy(acc.accNumber, index)}
                        className="text-gray-400 hover:text-[#835a71] transition-colors p-1"
                        title="Copy Account Number"
                      >
                        {copiedIndex === index ? <FiCheck className="text-green-600 text-xs" /> : <FiCopy className="text-xs" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-2 border-t border-[#333333]/5 pt-3 text-[11px]">
                  <div>
                    <p className="text-[#333333]/40 uppercase tracking-widest">Branch</p>
                    <p className="font-medium text-[#333333]/80 mt-0.5 truncate" title={acc.branch}>{acc.branch}</p>
                  </div>
                  {acc.branchCode && (
                    <div>
                      <p className="text-[#333333]/40 uppercase tracking-widest">Branch Code</p>
                      <p className="font-medium text-[#333333]/80 mt-0.5">{acc.branchCode}</p>
                    </div>
                  )}
                  {acc.swiftCode && (
                    <div>
                      <p className="text-[#333333]/40 uppercase tracking-widest">SWIFT</p>
                      <p className="font-medium text-[#333333]/80 mt-0.5">{acc.swiftCode}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-white border border-[#333333]/10 rounded-none shadow-sm text-sm text-[#333333]/80 leading-relaxed">
            We will contact you and share bank account details.
          </div>
        )}
      </div>
    );
  };

  const renderOrderTotalNote = (isMobile: boolean) => {
    if (!order.items.some((i) => !i.price || i.price === 0)) return null;
    return (
      <div className={`border border-amber-200 p-6 sm:p-8 bg-amber-50/30 relative overflow-hidden ${isMobile ? "md:hidden mb-8" : "hidden md:block mb-10"}`}>
        <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
        <h2 className="font-display text-lg font-normal text-amber-800 tracking-wide mb-2">⚠️ Order Total Note</h2>
        <p className="text-sm text-[#333333]/80 leading-relaxed font-light">
          There is one or more products in your basket with no fixed price set. We will contact you with the final price and invoice for the relevant payment method.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24 font-sans text-[#333333]">
      {/* Banner */}
      <section className="bg-pink-50/40 py-16 sm:py-20 border-b border-[#333333]/10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-[#835a71] mb-6 animate-bounce">
            <FiCheckCircle className="text-3xl" />
          </div>
          <p className="text-[#835a71] tracking-widest uppercase text-xs font-semibold mb-2">Order Confirmed</p>
          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-[#333333] mb-4">
            Thank you, {order.customerName}!
          </h1>
          <p className="text-[#333333]/70 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
            Your order has been placed successfully. We have sent a confirmation email to{" "}
            <span className="font-medium text-[#333333]">{order.customerEmail || "your email"}</span>.
          </p>
          <div className="mt-6 inline-block bg-white px-6 py-2.5 border border-[#333333]/10 text-sm uppercase tracking-widest">
            Order Number: <span className="font-bold text-[#835a71]">#{order.orderNumber}</span>
          </div>
        </div>
      </section>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-16">
        {/* Mobile-only section: Bank Transfer & Order Total Note on top of basket summary */}
        <div className="md:hidden">
          {renderBankTransfer(true)}
          {renderOrderTotalNote(true)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start w-full">
          
          {/* Main Info */}
          <div className="md:col-span-7 order-2 md:order-1">
            {renderBankTransfer(false)}
            {renderOrderTotalNote(false)}


            {/* Delivery & Shipping Info */}
            <div className="border border-[#333333]/10 p-6 sm:p-8 space-y-6">
              <h2 className="font-display text-2xl font-normal tracking-wide text-[#333333] border-b border-[#333333]/10 pb-4">
                Delivery Details
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiUser className="text-[#835a71] mt-0.5 text-base shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#333333]/40 font-semibold">Recipient</p>
                      <p className="font-medium mt-0.5">{order.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiPhone className="text-[#835a71] mt-0.5 text-base shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#333333]/40 font-semibold">Phone Number</p>
                      <p className="font-medium mt-0.5">{order.phone}</p>
                    </div>
                  </div>

                  {order.customerEmail && (
                    <div className="flex items-start gap-3">
                      <FiMail className="text-[#835a71] mt-0.5 text-base shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#333333]/40 font-semibold">Email Address</p>
                        <p className="font-medium mt-0.5 truncate">{order.customerEmail}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-[#835a71] mt-0.5 text-base shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#333333]/40 font-semibold">Shipping Address</p>
                      <p className="font-medium mt-0.5 leading-relaxed">{order.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiCreditCard className="text-[#835a71] mt-0.5 text-base shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#333333]/40 font-semibold">Payment Method</p>
                      <p className="font-semibold text-[#835a71] mt-0.5">
                        {order.paymentMethod === "bank_transfer" ? "Direct Bank Transfer" : "Cash on Delivery"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="flex items-start gap-3 bg-[#f9f9f9] p-4 text-xs leading-relaxed border-l-2 border-[#333333]/20">
                  <FiInfo className="text-gray-400 mt-0.5 text-sm shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-500 uppercase tracking-widest text-[9px] block mb-1">Order Notes</span>
                    <p className="text-gray-600 font-light italic">"{order.notes}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Basket Summary */}
          <div className="md:col-span-5 border border-[#333333]/10 p-6 sm:p-8 bg-white order-1 md:order-2">
            <h2 className="font-display text-2xl font-normal tracking-wide text-[#333333] mb-6 pb-4 border-b border-[#333333]/10">
              Basket Summary
            </h2>
            
            <div className="divide-y divide-[#333333]/5 space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 pt-4 first:pt-0">
                  <div className="relative w-14 h-14 rounded-none overflow-hidden bg-[#f7f7f7] border border-[#333333]/5 shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    ) : (
                      <span className="flex items-center justify-center h-full text-xl">🌸</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#333333] truncate tracking-wide">{item.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">SKU: {item.code}</p>
                    <p className="text-xs text-[#333333]/60 font-light mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  {item.price && (
                    <p className="text-xs font-semibold text-[#333333] shrink-0">
                      {lkr(item.price * item.quantity)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-[#333333]/10 mt-6 pt-6 space-y-3 text-xs uppercase tracking-widest text-[#333333]/60">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#333333]">{lkr(subtotal)}</span>
              </div>
              {order.discountApplied > 0 && (
                <div className="flex justify-between text-[#835a71]">
                  <span>Discount ({order.discountApplied}%)</span>
                  <span className="font-medium">−{lkr(subtotal * (order.discountApplied / 100))}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-4 border-t border-[#333333]/10 mt-4">
                <span className="font-display text-sm font-normal text-[#333333] tracking-wide">Total</span>
                <div className="text-right">
                  <p className="font-display text-xl text-[#333333]">{lkr(order.total)}</p>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5 normal-case">{usdLabel(order.total)} USD</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/shop" className="btn-primary w-full text-center block text-xs py-3.5 tracking-widest">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
