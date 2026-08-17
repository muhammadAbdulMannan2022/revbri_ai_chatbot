"use client";

import React, { useMemo } from "react";
import { Star, UserCheck } from "lucide-react";
import { useGetFeedbackListQuery, FeedbackItem } from "@/lib/authApi";

export default function TrustInsightSection() {
  const { data: feedbackData, isLoading } = useGetFeedbackListQuery();

  const feedbacks: FeedbackItem[] = useMemo(() => {
    if (!feedbackData) return [];
    if (Array.isArray(feedbackData)) return feedbackData;
    if (Array.isArray(feedbackData.results)) return feedbackData.results;
    if (Array.isArray(feedbackData.data)) return feedbackData.data;
    return [];
  }, [feedbackData]);

  const bulletStats = [
    "10+ Years of Research",
    "200+ Reports",
    "Nationwide Data",
    "Real Impact",
  ];

  const defaultFeedback: FeedbackItem[] = [
    {
      id: 9991,
      rating: 5,
      message: "The AI responses are super fast and accurate!",
      full_name: "Verified User",
      created_at: undefined,
    },
    {
      id: 9992,
      rating: 5,
      message:
        "BCL Inside keeps me informed on what's happening in the Church and helps me lead proactively.",
      full_name: "Pastor J. Carter",
      created_at: undefined,
    },
    {
      id: 9993,
      rating: 5,
      message:
        "An indispensable tool for our organizational intelligence and real-time analytics.",
      full_name: "Sarah M.",
      created_at: undefined,
    },
  ];

  const displayList = feedbacks.length > 0 ? feedbacks : defaultFeedback;

  return (
    <section className="w-full bg-[#09090A] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-900/40 border-t border-gray-800/40">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Main Banner Heading Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-inter text-center text-white mb-6 uppercase max-w-5xl px-2 leading-tight tracking-tight">
          Research. Insight. Authority You Can Trust.
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mb-16 text-sm sm:text-base">
          Discover how our platform empowers leaders with instant AI insights and community feedback.
        </p>

        {/* Asymmetric Content Matrix Grid Container */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch mb-16">
          {/* Column 1: Bullet Stat Metrics Column */}
          <div className="lg:col-span-3 flex flex-col justify-center py-4 lg:pr-4">
            <ul className="space-y-6">
              {bulletStats.map((stat, idx) => (
                <li key={idx} className="flex items-center gap-3 text-base font-normal text-[#D1D5DC]">
                  <span className="w-2 h-2 rounded-full bg-[#E56363] flex-shrink-0" />
                  <span>{stat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Recent Intelligence Brief Card */}
          <div className="lg:col-span-3 bg-[#18181C] border border-gray-800/40 rounded-[20px] p-8 flex flex-col justify-between shadow-xl min-h-[320px] hover:border-[#E56363]/40 transition-colors">
            <div>
              <span className="text-xs font-bold text-[#FAA333] block mb-4 tracking-wider uppercase">
                Recent Intelligence Brief
              </span>
              <h3 className="text-2xl font-bold text-white mb-3">
                The Silent Exodus
              </h3>
              <p className="text-sm text-[#99A1AF] font-normal">
                Why churches are losing people (and what to do about it).
              </p>
            </div>

            <div className="pt-6">
              <a
                href="#"
                className="inline-flex items-center text-sm font-bold text-[#E86161] hover:text-red-400 transition-colors group"
              >
                Read the Brief
                <span className="inline-block transform transition-transform duration-200 group-hover:translate-x-1 ml-1.5">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Column 3: Trend Spotlight Card */}
          <div className="lg:col-span-3 bg-[#18181C] border border-gray-800/40 rounded-[20px] p-8 flex flex-col justify-between shadow-xl min-h-[320px] hover:border-[#E56363]/40 transition-colors">
            <div>
              <span className="text-xs font-bold text-[#E86161] block mb-4 tracking-wider uppercase">
                Trend Spotlight
              </span>
              <h3 className="text-xl md:text-[20px] font-bold text-white">
                Engagement is down.
                <br />
                Connection is up.
              </h3>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className="w-16 h-16 rounded-full bg-[#E8616126] flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-[#E86161]">62%</span>
              </div>
              <p className="text-xs text-[#99A1AF] font-normal flex-1">
                of churchgoers say relationships keep them coming back.
              </p>
            </div>
          </div>

          {/* Column 4: Testimonial Highlight Card */}
          <div className="lg:col-span-3 bg-[#18181C] border border-gray-800/40 rounded-[20px] p-8 flex flex-col justify-between shadow-xl min-h-[320px] hover:border-[#E56363]/40 transition-colors">
            <div>
              <span className="text-xs font-bold text-[#6A7282] uppercase block mb-4 tracking-wider">
                What Leaders Are Saying
              </span>

              <div className="flex gap-1 mb-5">
                <div className="w-1.5 h-4 bg-[#E56363] rounded-sm opacity-80" />
                <div className="w-1.5 h-4 bg-[#E56363] rounded-sm opacity-80" />
              </div>

              <p className="text-base text-[#D1D5DC] font-normal italic">
                "BCL Inside keeps me informed on what's happening in the Church and helps me lead proactively."
              </p>
            </div>

            <div className="pt-4 text-sm font-medium">
              <span className="text-gray-400">Pastor J. Carter </span>
              <span className="text-[#F97316]">— Atlanta, GA</span>
            </div>
          </div>
        </div>

        {/* Dynamic User Feedback Section */}
        <div className="w-full mt-6">
          <div className="flex flex-col items-center mb-10">
            <span className="px-3 py-1 bg-[#E86161]/10 text-[#E86161] text-xs font-semibold rounded-full uppercase tracking-widest mb-3 border border-[#E86161]/20">
              Community Voices
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center">
              User Reviews & Feedback
            </h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E86161] border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayList.slice(0, 6).map((item, idx) => {
                const rating = Math.min(Math.max(item.rating || 5, 1), 5);
                const name =
                  item.full_name ||
                  item.user_name ||
                  (typeof item.user === "object" && item.user?.full_name) ||
                  "Verified User";
                const rawDate = item.created_at;
                let dateText = "";
                if (rawDate && !isNaN(Date.parse(rawDate))) {
                  dateText = new Date(rawDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }

                return (
                  <div
                    key={item.id ?? idx}
                    className="bg-[#141417] border border-gray-800/80 hover:border-[#E86161]/50 transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between shadow-lg group hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-600"
                              }
                            />
                          ))}
                        </div>
                        {dateText && (
                          <span className="text-xs text-gray-500 font-medium">
                            {dateText}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-300 font-normal leading-relaxed mb-6 italic">
                        "{item.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-800/60">
                      <div className="w-9 h-9 rounded-full bg-[#E86161]/20 flex items-center justify-center text-[#E86161] font-bold text-sm">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-[#E86161] transition-colors">
                          {name}
                        </p>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <UserCheck size={12} className="text-emerald-500" />
                          Verified Feedback
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}