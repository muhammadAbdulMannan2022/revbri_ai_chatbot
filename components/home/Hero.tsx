import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import herobg from "@/assets/main/herobg.png";
import heroRight from "@/assets/main/heroRight.png";

export default function HomeHero() {
  return (
    <section className="relative w-full min-h-150 md:min-h-175 flex items-center justify-center overflow-hidden  px-6 md:px-12 lg:px-24 border border-amber-300">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={herobg}
          alt="Black Millennial Café Conference Background"
          fill
          priority
          placeholder="blur"
          className="object-cover object-center"
        />

        <div
          className="absolute inset-0 z-10"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        />
      </div>

      {/* Main Container */}
      <div className="relative min-h-150 md:min-h-175 z-20 mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-end border border-green-400">
        {/* Left Content Column with Liquid Glass Background */}
        <div className="lg:col-span-7 flex flex-col items-start self-center py-12 lg:py-16">
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-4xl p-6 sm:p-10 md:p-12 shadow-2xl w-full flex flex-col gap-6 animate-in fade-in slide-in-from-left-6 duration-700">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-extrabold tracking-tight leading-tight font-sans text-white">
                Building Stronger <br />
                <span className="text-white">Black Voices With AI</span>
              </h1>

              <p className="text-base md:text-lg text-gray-200 italic font-medium leading-relaxed font-sans">
                <span className="font-bold">
                  ...was birthed from the work we do
                </span>
                , supported by groundbreaking research (detailed below) and
                proclaimed through our merchandise.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 bg-[#E86160] hover:bg-[#d85554] text-white pl-6 pr-2.5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-lg active:scale-95 group"
              >
                Start a Trail
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white transition-transform duration-300 group-hover:translate-x-1">
                  <FaArrowRight size={14} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Image Column - Aligned to bottom edge */}
        <div className="relative lg:col-span-5 h-full flex  z-20 border border-blue-400">
          <Image
            src={heroRight}
            alt="Man using AI assistant avatar"
            fill
            priority
            className="border absolute bottom-0 w-full h-auto object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
