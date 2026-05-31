import Link from "next/link";
import Image from "next/image";
import { FiDroplet, FiStar, FiWind, FiFeather } from "react-icons/fi";

const CATEGORIES = [
  {
    label: "Skin Care",
    category: "SkinCare",
    icon: FiDroplet,
    desc: "Serums, moisturizers & more",
    image: "/images/categories/skin_care.png",
  },
  {
    label: "Makeup",
    category: "Makeup",
    icon: FiStar,
    desc: "Lips, eyes & face",
    image: "/images/categories/makeup.png",
  },
  {
    label: "Fragrance",
    category: "Fragrance",
    icon: FiWind,
    desc: "Perfumes & body mists",
    image: "/images/categories/fragrance.png",
  },
  {
    label: "Hair",
    category: "Hair",
    icon: FiFeather,
    desc: "Oils, masks & treatments",
    image: "/images/categories/hair.png",
  },
];

export function CategorySection() {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-2">Categories</p>
            <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-wide text-[#333333]">Shop by Ritual</h2>
          </div>
          <Link href="/shop" className="flex items-center gap-2 text-[#333333] font-normal tracking-widest uppercase text-xs hover:gap-3 transition-all">
            View All <span>→</span>
          </Link>
        </div>

        {/* Grid — equal cards on all screen sizes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.category}
                href={`/shop?category=${cat.category}`}
                className="group relative rounded-none border border-[#333333]/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                <div className="relative p-4 sm:p-6 flex flex-col min-h-[140px] sm:min-h-[170px] z-10 h-full">
                  {/* Icon */}
                  <div className="text-3xl sm:text-4xl mb-auto group-hover:scale-110 transition-transform duration-300 text-white drop-shadow-md origin-left">
                    <Icon />
                  </div>

                  <div className="mt-6 sm:mt-8">
                    <h3 className="font-display font-normal tracking-wide text-white text-base sm:text-xl mb-0.5">{cat.label}</h3>
                    <p className="text-white/80 font-light text-xs sm:text-sm hidden sm:block">{cat.desc}</p>
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-none bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs sm:text-sm shadow-sm border border-white/20">
                    →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
