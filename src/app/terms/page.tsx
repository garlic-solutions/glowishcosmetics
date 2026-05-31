import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Glowish Cosmetics, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      title: "2. Product Information",
      content: "We strive to provide the most accurate descriptions and images of our cosmetic products. However, we do not warrant that product descriptions or other content are error-free. Colors may vary slightly depending on your screen settings."
    },
    {
      title: "3. Orders and Payments",
      content: "All orders are subject to acceptance and availability. We reserve the right to refuse any order. Prices are subject to change without notice. Payment must be made in full at the time of ordering or upon delivery if Cash on Delivery is selected."
    },
    {
      title: "4. Shipping and Delivery",
      content: "We aim to process and ship all orders within 1-2 business days. Delivery times may vary based on your location and the shipping method selected. Glowish Cosmetics is not responsible for delays caused by third-party shipping carriers."
    },
    {
      title: "5. Returns and Exchanges",
      content: "Due to the hygienic nature of cosmetic products, we can only accept returns or exchanges for items that are damaged or defective upon receipt. Please contact us within 48 hours of delivery with photos of the damaged items."
    },
    {
      title: "6. User Accounts",
      content: "If you create an account at Glowish Cosmetics, you are responsible for maintaining the confidentiality of your account and password. Registered members enjoy a 5% discount on all orders, which is applied automatically at checkout."
    },
    {
      title: "7. Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of Sri Lanka and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 border-b border-[#333333]/10 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-3">Legal</p>
          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-[#333333] mb-4">Terms of Service</h1>
          <p className="text-[#333333]/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            Please read these terms carefully before placing an order with Glowish Cosmetics. 
            By using our services, you agree to these conditions.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="space-y-12">
          {sections.map((section, index) => (
            <div key={index} className="border-b border-[#333333]/5 pb-8 last:border-0">
              <h2 className="font-display text-xl sm:text-2xl font-normal tracking-wide text-[#333333] mb-4">
                {section.title}
              </h2>
              <p className="text-[#333333]/75 text-sm sm:text-base leading-relaxed font-light">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-[#f8f8f8] border border-[#333333]/10 text-center">
          <h3 className="font-display text-xl text-[#333333] mb-2">Have Questions?</h3>
          <p className="text-sm text-[#333333]/60 mb-6">If you have any questions regarding our terms, please feel free to reach out.</p>
          <Link href="/contact" className="btn-primary inline-block px-10">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
