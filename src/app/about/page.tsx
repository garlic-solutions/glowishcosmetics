import Image from "next/image";
import { FiDroplet, FiGlobe, FiShield } from "react-icons/fi";

const VALUES = [
  {
    icon: FiDroplet,
    title: "Skin-First Formulas",
    desc: "Inspired by Korean skincare rituals, our range focuses on hydration, barrier support, and daily glow.",
  },
  {
    icon: FiGlobe,
    title: "K-Beauty Standards",
    desc: "We curate trends and ingredients shaped by the Korean cosmetics industry and adapt them for everyday use.",
  },
  {
    icon: FiShield,
    title: "Quality and Trust",
    desc: "Every launch is selected with a quality-first mindset, so you get effective beauty without compromise.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-16 sm:py-20 border-b border-[#333333]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-3">About Glowish</p>
          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-[#333333] mb-4">Rooted in K-Beauty Rituals</h1>
          <p className="text-[#333333]/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Glowish is built around the innovation and care of the Korean cosmetics industry, blending modern formulas with
            timeless skincare rituals for healthy, radiant skin.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16 grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="order-2 md:order-1">
          <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-3">Who We Are</p>
          <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-wide text-[#333333] mb-4">Beauty That Feels Intentional</h2>
          <p className="text-[#333333]/75 leading-relaxed mb-4 text-sm sm:text-base">
            We started Glowish with one clear mission: make high-performing skincare and makeup inspired by Korean beauty
            principles more accessible for everyday routines.
          </p>
          <p className="text-[#333333]/75 leading-relaxed mb-4 text-sm sm:text-base">
            From lightweight hydration layers to glow-enhancing essentials, each product is selected to deliver practical
            results while staying gentle on skin.
          </p>
          <p className="text-[#333333]/75 leading-relaxed text-sm sm:text-base">
            We believe consistency, quality ingredients, and thoughtful textures are the key to long-term skin confidence.
          </p>
        </div>

        <div className="order-1 md:order-2 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="relative min-h-[180px] sm:min-h-[220px] border border-[#333333]/10 overflow-hidden">
            <Image src="/images/carousel/slide1.png" alt="K-beauty skincare products" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
          </div>
          <div className="relative min-h-[180px] sm:min-h-[220px] border border-[#333333]/10 overflow-hidden">
            <Image src="/images/carousel/slide2.png" alt="Korean cosmetics textures and shades" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-16 border-t border-[#333333]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-10">
            <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-3">Our Values</p>
            <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-wide text-[#333333]">Craft, Care, and Consistency</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {VALUES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="border border-[#333333]/10 p-6 sm:p-7 bg-pink-50">
                  <div className="w-11 h-11 mb-4 flex items-center justify-center bg-[#835a71] text-white">
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="font-display font-normal tracking-wide text-[#333333] text-xl mb-2">{item.title}</h3>
                  <p className="text-[#333333]/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
