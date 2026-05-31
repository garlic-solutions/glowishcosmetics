import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="py-10 sm:py-16 bg-[#fff0f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-none overflow-hidden bg-gradient-to-r from-[#333333] via-[#444444] to-[#333333] px-6 sm:px-8 py-12 sm:py-20 text-center">
          {/* Decorative circles */}
          <div className="absolute -top-12 -left-12 w-40 sm:w-48 h-40 sm:h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-8 w-52 sm:w-64 h-52 sm:h-64 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-white/5" />

          <div className="relative z-10">
            <p className="text-[#fff0f5] tracking-widest uppercase text-xs font-normal mb-3 sm:mb-4">
              ✦ Limited Time ✦
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-white mb-3 sm:mb-4 leading-tight">
              Your Glow Awaits.
            </h2>
            <p className="text-[#fff0f5] text-base sm:text-lg font-light max-w-md mx-auto mb-8 sm:mb-10">
              Order today and experience beauty that lasts. Delivered to your door with care.
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
              <Link
                href="/shop"
                className="bg-white text-[#333333] font-normal px-6 sm:px-8 py-3 sm:py-4 rounded-none text-xs sm:text-sm tracking-widest uppercase hover:bg-gray-100 transition-colors shadow-sm"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="border border-white/60 text-white font-normal px-6 sm:px-8 py-3 sm:py-4 rounded-none text-xs sm:text-sm tracking-widest uppercase hover:bg-white/10 transition-colors"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
