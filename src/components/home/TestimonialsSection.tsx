import Image from "next/image";
import { FiUser } from "react-icons/fi";
import type { Review } from "@/types";

interface TestimonialsSectionProps {
  reviews: Review[];
}

export function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  // If no reviews, don't show the section or show a fallback
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-14">
          <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-semibold mb-2">Reviews</p>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#333333]">
            Real Glow. Real People.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="relative bg-white border border-[#333333]/10 rounded-none p-5 sm:p-7 hover:-translate-y-1 transition-transform duration-300 shadow-sm"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-5 sm:top-5 sm:right-6 text-5xl sm:text-6xl text-gray-100 font-display leading-none select-none">"</div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3 sm:mb-4">
                {[...Array(5)].map((_, s) => (
                  <span 
                    key={s} 
                    className={`text-xs sm:text-sm ${s < r.rating ? "text-[#333333]" : "text-gray-200"}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 sm:mb-6 relative z-10">
                "{r.comment}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-none bg-[#f7f7f7] border border-[#333333]/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {r.userImage ? (
                    <Image 
                      src={r.userImage.url} 
                      alt={r.name} 
                      width={48} 
                      height={48} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-[#333333]/30 text-xl" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[#333333] text-sm">{r.name}</p>
                  {r.product && (
                    <p className="text-gray-500 text-[10px] tracking-wide uppercase">{r.product.name}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

