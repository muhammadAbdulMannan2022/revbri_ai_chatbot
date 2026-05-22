"use client";

import React, { useState } from "react";
import { X, ChevronUp } from "lucide-react";
import Image from "next/image";

interface PromoPosterProps {
  imageSrc?: string;
  alt?: string;
  onClose?: () => void;
}

export default function PromoPoster({
  imageSrc = "https://i.ibb.co.com/SwXkJyXG/Rectangle-34624614.png",
  alt = "Super Sale Promotion",
  onClose,
}: PromoPosterProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [imgError, setImgError] = useState(false);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl min-h-[160px] md:min-h-[220px] flex items-center justify-center animate-in fade-in slide-in-from-top-4 duration-500 group border border-rose-200 bg-linear-to-r from-red-600 via-rose-500 to-red-600">
      {/* Close Banner Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 bg-black/35 hover:bg-black/50 text-white rounded-full p-1.5 transition-all duration-200 active:scale-95 group-hover:rotate-90 cursor-pointer z-20 shadow-md"
        title="Dismiss Offer"
      >
        <X size={16} />
      </button>

      {/* Render Image (if loaded successfully) */}
      {!imgError ? (
        <div className="relative w-full h-40 md:h-55 z-10 select-none">
          <Image
            src={imageSrc}
            alt={alt}
            width={700}
            height={400}
            priority
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      ) : (
        /* Dynamic SVG/CSS Fallback Poster in case image is missing or loading fails */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white select-none">
          {/* Concentric ray design */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150 animate-pulse pointer-events-none" />
          <div className="absolute inset-0 opacity-10 bg-[repeating-conic-gradient(from_0deg,_transparent_0deg_15deg,_white_15deg_30deg)] pointer-events-none" />

          <div className="flex flex-col items-center justify-center gap-2 md:gap-4 relative z-0">
            {/* 3D SUPER SALE Text */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-wider text-yellow-400 drop-shadow-[0_4px_0_#991b1b] md:drop-shadow-[0_6px_0_#7f1d1d] uppercase transition-transform duration-300 group-hover:scale-102">
              Super Sale
            </h1>

            {/* Promo Info */}
            <div className="flex items-center gap-3 md:gap-6 text-xs sm:text-sm md:text-lg font-bold tracking-widest text-white uppercase">
              <span className="bg-yellow-400 text-red-700 px-2 py-0.5 rounded-md shadow-md animate-pulse">
                Save up to 50%
              </span>
              <span className="opacity-50">|</span>
              <span className="text-yellow-200">Limited Time Only</span>
            </div>
          </div>

          <div className="absolute bottom-2 right-4 opacity-50 text-[10px] hidden md:flex items-center gap-1">
            <ChevronUp size={12} />
          </div>
        </div>
      )}
    </div>
  );
}
