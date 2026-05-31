"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll be in touch soon.");
    setForm({ name: "", email: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="lg:col-span-7 border border-[#333333]/10 p-6 sm:p-8 bg-white rounded-none shadow-sm">
      <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-2">Send a message</p>
      <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-wide text-[#333333] mb-6">Write to us</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Your Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-[#f7f7f7] rounded-none px-4 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2]"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Email Address</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full bg-[#f7f7f7] rounded-none px-4 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2]"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label className="text-xs font-normal text-[#333333]/70 tracking-widest uppercase block mb-2">Message</label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full bg-[#f7f7f7] rounded-none px-4 py-3 text-sm text-[#333333] placeholder:text-[#333333]/40 focus:outline-none focus:bg-[#f2f2f2] resize-none"
            placeholder="How can we help you?"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
