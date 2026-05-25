"use client";

import React, { useState } from "react";
import { Check, Edit3 } from "lucide-react";

export default function ThreePillarsSection() {
  const [cards, setCards] = useState([
    {
      id: "intelligence",
      badge: "BCL INSIDE™",
      title: "INTELLIGENCE",
      queryLimit: "100",
      isActive: true,
      features: [
        "Monthly Intelligence Briefs",
        "Trend & Analysis Reports",
        "Research Summaries",
        "Future Forecasts",
      ],
    },
    {
      id: "strategy",
      badge: "BCL AI™",
      title: "STRATEGY",
      queryLimit: "100",
      isPopular: true,
      isActive: true,
      features: [
        "Ask Leadership Questions",
        "Ministry Planning Support",
        "Discipleship Guidance",
        "Programming Ideas",
      ],
    },
    {
      id: "implementation",
      badge: "BCL LABS™",
      title: "IMPLEMENTATION",
      queryLimit: "1000",
      isActive: true,
      features: [
        "Monthly Webinars & Replays",
        "Tools & Templates",
        "CEBA Journey™ Access",
        "Vision Year Lab™ Tools",
      ],
    },
    {
      id: "implementation plus",
      badge: "BCL LABS™",
      title: "IMP PLUS",
      queryLimit: "1000",
      isActive: true,
      features: [
        "Monthly Webinars & Replays",
        "Tools & Templates",
        "CEBA Journey™ Access",
        "Vision Year Lab™ Tools",
      ],
    },
  ]);

  const handleToggleActive = (id: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isActive: !card.isActive } : card,
      ),
    );
  };

  return (
    <section className="w-full bg-[#09090A] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-950/40">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-inter text-[#FAA333] uppercase tracking-wider block">
            Three Pillars. One Purpose.
          </span>
          <h2 className="text-2xl md:text-[24px] font-normal leading-relaxed text-[#D1D5DC] px-2">
            Everything you need to lead with clarity,
            <br className="hidden sm:inline" />
            make better decisions, and create lasting impact.
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative bg-[#131316] rounded-2xl border text-white flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 ${
                card.isPopular
                  ? "border-[#E56363] ring-1 ring-[#E56363]/30 pt-0 translate-y-[-4px]"
                  : "border-white/[0.06] pt-6 hover:border-white/[0.12] hover:translate-y-[-4px]"
              }`}
            >
              {/* Most Popular Banner Header */}
              {card.isPopular && (
                <div className="w-full bg-[#E56363] text-white text-xs font-bold text-center py-2.5 uppercase tracking-wider mb-6">
                  Most Popular
                </div>
              )}

              {/* Upper Content Block */}
              <div
                className={`px-6 md:px-8 flex-1 flex flex-col ${card.isPopular ? "pt-0" : "pt-2"}`}
              >
                {/* Title and Active Toggle Row */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-2xl font-black tracking-tight text-white font-inter">
                    {card.title}
                  </h3>
                </div>

                {/* Subtitle / Badge String */}
                <span className="text-xs font-bold uppercase tracking-wider text-[#E56363] mb-6 block">
                  {card.badge}
                </span>

                {/* AI Query Limit Highlight Box */}
                <div className="bg-black/40 border border-white/[0.03] rounded-xl p-4 mb-6 text-left">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    AI Query Limit
                  </span>
                  <div className="text-sm font-medium text-gray-300">
                    <span className="text-xl font-bold text-[#E56363] mr-0.5">
                      {card.queryLimit}
                    </span>{" "}
                    / month
                  </div>
                </div>

                {/* Features Bullet Checklist */}
                <ul className="space-y-3.5 mb-8 text-left flex-1">
                  {card.features.map((feature, featureIdx) => (
                    <li
                      key={featureIdx}
                      className="flex items-start gap-3 text-sm text-gray-300 font-medium"
                    >
                      <Check
                        className="w-4 h-4 text-[#4DD98C] shrink-0 mt-0.5"
                        strokeWidth={3}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button Footer */}
              <div className="px-6 md:px-8 pb-6 pt-2">
                <button className="w-full bg-[#E56363] hover:bg-[#DC4F4F] text-white text-xs font-bold uppercase tracking-wider py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 active:scale-[0.98] shadow-lg shadow-black/40">
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
