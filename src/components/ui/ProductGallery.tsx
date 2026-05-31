"use client";
import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/types";

interface Props {
  thumbnail?: ProductImage;
  gallery?: ProductImage[];
  productName: string;
}

export function ProductGallery({ thumbnail, gallery = [], productName }: Props) {
  const allImages = [];
  if (thumbnail) allImages.push(thumbnail);
  if (gallery && gallery.length > 0) {
    // avoid duplicates if they accidentally added the thumbnail to the gallery
    const uniqueGallery = gallery.filter(g => g.url !== thumbnail?.url);
    allImages.push(...uniqueGallery);
  }

  const [activeIndex, setActiveIndex] = useState(0);

  // If no images at all
  if (allImages.length === 0) {
    return (
      <div className="relative h-72 md:h-auto bg-gray-50 min-h-[320px] w-full flex items-center justify-center text-8xl">
        🌸
      </div>
    );
  }

  const mainImage = allImages[activeIndex];

  return (
    <div className="flex flex-col w-full h-full">
      {/* Main Large Image */}
      <div className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] bg-gray-50 overflow-hidden">
        <Image
          src={mainImage.url}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex flex-wrap gap-2 p-4 bg-white border-t border-[#333333]/10">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 overflow-hidden border-2 transition-colors ${
                index === activeIndex ? "border-[#835a71]" : "border-transparent hover:border-[#333333]/20"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
