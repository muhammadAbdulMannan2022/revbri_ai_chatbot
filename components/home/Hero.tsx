"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const stats = [
    { value: "500+", label: "Churches Served" },
    { value: "50K+", label: "Leaders Equipped" },
    { value: "2M+", label: "Lives Impacted" },
    { value: "10+", label: "Years Research" },
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#050506] text-white flex flex-col  overflow-hidden font-sans">
      {/* 1. Background Image Wrapper with Atmospheric Dark Overlays */}
      <div className="absolute inset-0 z-0">
        {/* Replace /images/hero-speaker.jpg with your background image asset */}
        <div
          className="w-full h-full bg-cover bg-center lg:bg-[center_right_15%] opacity-100 mix-blend-lightbox"
          style={{ backgroundImage: `url('/images/hero_bg.jpg')` }}
        />
        {/* Radical Dark Gradient Overlay to isolate text layout on the left side */}
        {/*  */}
      </div>

      {/* 2. Main Hero Content Layout */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-28  px-4 sm:px-6 lg:px-8 ">
        {/* Left Typography Branding Matrix */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left max-w-2xl">
          <span className="text-xs sm:text-sm font-medium  text-[#E86161] uppercase">
            Black Church Leader
          </span>

          {/* Main Headline with Accent Left Border Bar */}
          <div className="space-y-2">
            {/* 1. Upper Section: Text with Left Accent Bar */}
            <div className="relative flex items-stretch gap-4 sm:gap-6">
              {/* Left Border Accent Bar Block */}
              <div className="w-[4px] sm:w-[6px] bg-[#E56363] rounded-full shrink-0" />

              {/* Upper Headline Typography */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-nunito text-white leading-[1.1] tracking-tight">
                Lead Your <br />
                Church With
              </h1>
            </div>

            <div className="pl-[20px] sm:pl-[30px]">
              <span className="text-[#E86161] text-4xl sm:text-5xl md:text-7xl font-bold font-nunito  block">
                Clarity.
              </span>
            </div>
          </div>

          {/* Core Core Values Tagline */}
          <div className="space-y-3 pt-2">
            <h4 className="text-base sm:text-lg md:text-[24px] font-semibold font-inter  text-[#D1D5DC]">
              Insight. Strategy. Implementation.
            </h4>
            <p className="text-sm sm:text-[18px] text-[#99A1AF] font-normal  max-w-lg">
              BCL is the leadership intelligence and implementation platform
              built for today's church leaders.
            </p>
          </div>

          {/* Interactive Call to Action Button */}
          <div className="pt-4">
            <button
              onClick={() => router.push("/auth/register")}
              className="bg-[#E86161] hover:bg-[#DC4F4F] text-white font-bold text-[16px] font-inter cursor-pointer py-4 px-8 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:translate-x-1 active:scale-95 shadow-xl shadow-red-950/40"
            >
              Start Free
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
          {/* 3. Bottom Row Footer Metrics Panel */}
      <div className="relative z-10 w-full bg-gradient-to-t from-black/80 to-transparent border-t border-gray-900/40 py-8 ">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 items-center justify-between text-left">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col pl-2 sm:pl-4 "
            >
              <span className="text-2xl sm:text-3xl  font-bold text-[#FAA333]  font-inter">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs font-normal   text-[#6A7282] mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
        </div>

        {/* Right Dashboard Mockups Column */}
        <div className="lg:mt-[350px] lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end pt-18 lg:pt-0">
          <div className="relative w-full max-w-[480px] lg:max-w-none aspect-[4/3] pointer-events-none group">
            {/* Replace /images/hero-devices.png with your compiled dashboard product mockup image */}
            <div
              className="w-full h-full bg-contain bg-no-repeat bg-center lg:bg-right drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-[1.02]"
              style={{ backgroundImage: `url('/images/devices.png')` }}
            />
          </div>
        </div>
      </div>

      
    </section>
  );
}
