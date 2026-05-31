"use client";

const ITEMS = [
  "✦ Clean Beauty",
  "✦ Cruelty Free",
  "✦ Dermatologist Tested",
  "✦ Vegan Formula",
  "✦ Skin Loving",
  "✦ Premium Quality",
  "✦ Free Delivery",
  "✦ Made with Love",
];

export function MarqueeStrip({ dark = false }: { dark?: boolean }) {
  const text = [...ITEMS, ...ITEMS];

  return (
    <div
      className={`overflow-hidden py-4 ${dark ? "bg-[#333333] text-white" : "bg-white text-[#333333]"}`}
    >
      <div className="flex gap-0 whitespace-nowrap animate-marquee">
        {text.map((item, i) => (
          <span key={i} className="inline-block px-6 text-sm font-semibold tracking-wide">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
