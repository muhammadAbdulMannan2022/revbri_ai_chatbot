import React from "react";
import { Check, Crown } from "lucide-react";
import PromoPoster from "@/components/dashboard/PromoPoster";
import MembershipStatus from "@/components/dashboard/MembershipStatus";

// Metadata for the plan page (good for SEO/SSR)
export const metadata = {
  title: "Membership Plans | Black Millennial Café Dashboard",
  description: "View and manage your membership plan tiers. Black Millennial Café offers Silver, Gold, and Platinum premium access tiers.",
};

export default function PlanPage() {
  const features = [
    "Unlimited AI Recommendations",
    "Advanced & Personalized Suggestions",
    "Full Conversation History",
    "Priority Affiliate Deals",
    "AI Memory & Preferences",
    "Priority Support",
  ];

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-2 md:px-6 font-sans text-slate-800 flex flex-col gap-8 pb-20">
      
      {/* Reusable Poster Component (Client dynamic features contained inside) */}
      <PromoPoster imageSrc="/super_sale_banner.png" alt="Super Sale Promo Banner" />

      {/* Interactive Status Segment (Uses client component for modals/actions) */}
      <MembershipStatus />

      {/* Pricing Cards (Statically Rendered via Server-Side Rendering) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full">
        
        {/* Tier 1: Silver Plan */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group">
          <div className="bg-slate-100/80 p-8 flex flex-col items-center justify-center text-center relative border-b border-slate-100/50">
            <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-1">Silver Plan</h3>
            <div className="flex items-baseline justify-center gap-1 text-slate-800">
              <span className="text-4xl md:text-5xl font-extrabold">$49</span>
              <span className="text-sm font-semibold text-slate-500">/Per Month</span>
            </div>
          </div>

          <div className="p-8 flex flex-col flex-1 gap-6">
            <ul className="flex flex-col gap-4">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="bg-indigo-50 text-indigo-600 rounded-full p-1 mt-0.5 shrink-0">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 flex flex-col gap-6">
              <p className="text-xs text-center text-slate-400 leading-relaxed px-4">
                The Silver Plan offers standard entry tools with AI automation, perfect for individual cafe members starting out.
              </p>
              <button className="w-full py-3.5 px-6 rounded-full border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-800 hover:text-white hover:border-slate-800 font-bold text-sm tracking-wide transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-98">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Gold Plan (Highlighted & Prominent) */}
        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 relative scale-100 lg:scale-[1.03] z-10 group">
          
          <div className="absolute top-4 right-4 bg-yellow-400 text-slate-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md animate-pulse">
            Best Value
          </div>

          {/* Black header segment with Gold Crown Badge */}
          <div className="bg-slate-950 p-8 flex flex-col items-center justify-center text-center relative border-b border-slate-900">
            <h3 className="text-lg font-bold text-yellow-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              Gold Plan
            </h3>
            
            <div className="flex items-center gap-4 justify-center mt-2">
              <div className="flex items-baseline text-white">
                <span className="text-4xl md:text-5xl font-black">$100</span>
                <span className="text-sm font-semibold text-slate-400">/Per Month</span>
              </div>
              
              <div className="relative bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 p-2 rounded-xl shadow-lg border border-yellow-200 transition-transform duration-300 group-hover:rotate-6">
                <Crown className="w-6 h-6 text-slate-900 stroke-[2.5]" />
              </div>
            </div>
          </div>

          <div className="p-8 flex flex-col flex-1 gap-6">
            <ul className="flex flex-col gap-4">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="bg-emerald-50 text-emerald-600 rounded-full p-1 mt-0.5 shrink-0">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 flex flex-col gap-6">
              <p className="text-xs text-center text-slate-400 leading-relaxed px-4">
                The Gold Plan Offers The Best Value With AI Automation, Seamless Integrations, And Priority Support.
              </p>
              <button className="w-full py-4 px-6 rounded-full bg-[#FD6E6E] hover:bg-[#e05656] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg shadow-rose-200 cursor-pointer active:scale-98">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Tier 3: Platinum Plan */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group">
          <div className="bg-slate-100/80 p-8 flex flex-col items-center justify-center text-center relative border-b border-slate-100/50">
            <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-1">Platinum Plan</h3>
            <div className="flex items-baseline justify-center gap-1 text-slate-800">
              <span className="text-4xl md:text-5xl font-extrabold">$199</span>
              <span className="text-sm font-semibold text-slate-500">/Per Month</span>
            </div>
          </div>

          <div className="p-8 flex flex-col flex-1 gap-6">
            <ul className="flex flex-col gap-4">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="bg-indigo-50 text-indigo-600 rounded-full p-1 mt-0.5 shrink-0">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 flex flex-col gap-6">
              <p className="text-xs text-center text-slate-400 leading-relaxed px-4">
                The Professional Plan Offers The Best Value With AI Automation, Seamless Integrations, And Priority Support.
              </p>
              <button className="w-full py-3.5 px-6 rounded-full border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-800 hover:text-white hover:border-slate-800 font-bold text-sm tracking-wide transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-98">
                Get Started
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
