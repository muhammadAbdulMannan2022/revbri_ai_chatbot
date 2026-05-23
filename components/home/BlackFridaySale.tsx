import React from 'react';

export default function BlackFridayBanner() {
  return (
    <section className="relative w-full bg-black select-none overflow-hidden group">
      
      {/* 1. Pure Full Banner Image Element */}
      <img 
        src="/images/black.jpg" 
        alt="Black Friday Sale Banner"
        className="w-full h-auto block object-contain transition-transform duration-700 ease-out group-hover:scale-[1.01]"
      />

      {/* 2. Full-Surface Clickable Anchor Overlay */}
      <a 
        href="#"
        className="absolute inset-0 z-10 block cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFCD38] focus:ring-inset"
        aria-label="Shop Black Friday Sale"
      />

    </section>
  );
}