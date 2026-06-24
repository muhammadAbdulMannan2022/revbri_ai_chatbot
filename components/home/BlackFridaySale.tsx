"use client";
import { Banner, useGetPostersQuery } from "@/lib/authApi";
import React from "react";
// Import Swiper React components and required styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function BlackFridayBanner() {
  const { data: responseData, isLoading, isError } = useGetPostersQuery();

  // Extract the results array safely from your API structure
  const posters = responseData?.results;

  // 1. Fallback / Default State (Loading or Error or No Data inside results)
  const hasPosters =
    !isLoading && !isError && Array.isArray(posters) && posters.length > 0;

  if (!hasPosters) {
    return (
      <section className="relative w-full bg-black select-none overflow-hidden group">
        {/* Default Static Banner */}
        <img
          src="/images/black.jpg"
          alt="Black Friday Sale Banner Default"
          className="w-full h-auto block object-contain transition-transform duration-700 ease-out group-hover:scale-[1.01]"
        />
        <a
          href="#"
          className="absolute inset-0 z-10 block cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFCD38] focus:ring-inset"
          aria-label="Shop Black Friday Sale"
        />
      </section>
    );
  }

  // 2. Single Poster State (No slider needed)
  if (posters.length === 1) {
    const poster = posters[0];
    return (
      <section className="relative w-full bg-black select-none overflow-hidden group">
        <img
          src={poster.image}
          alt={poster.title || "Black Friday Sale Banner"}
          className="w-full h-auto block object-contain transition-transform duration-700 ease-out group-hover:scale-[1.01]"
        />
        <a
          href="#"
          className="absolute inset-0 z-10 block cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFCD38] focus:ring-inset"
          aria-label={poster.title || "Shop Black Friday Sale"}
        />
      </section>
    );
  }

  // 3. Multiple Posters State (Swiper Slider)
  return (
    <section className="relative w-full bg-black select-none overflow-hidden group">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="w-full h-auto"
      >
        {posters.map((poster: Banner) => (
          <SwiperSlide key={poster.id} className="relative">
            {/* Banner Image */}
            <img
              src={poster.image}
              alt={poster.title}
              className="w-full h-auto block object-contain transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            />
            {/* Clickable Area Overlapping This Specific Slide */}
            <a
              href="#"
              className="absolute inset-0 z-10 block cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFCD38] focus:ring-inset"
              aria-label={poster.title}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
