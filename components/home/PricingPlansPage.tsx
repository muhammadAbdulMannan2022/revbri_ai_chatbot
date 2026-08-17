"use client";

import React from "react";
import { Check, Loader2 } from "lucide-react";
import { useGetPlansQuery } from "@/lib/authApi";

export default function PricingPlansPage() {
  const { data: plans, isLoading } = useGetPlansQuery();

  const activePlans = plans?.filter((p) => p.is_active);

  const resolveFeatures = (features: any) =>
    Array.isArray(features)
      ? features.map((f: any) => (typeof f === "string" ? f : f.name || ""))
      : [];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-[#09090A]">
        <Loader2 size={32} className="animate-spin text-[#ef5b5e]" />
      </div>
    );
  }

  return (
    <section className="bg-[#09090A] py-16 border-t border-gray-800/40 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
            Pricing Plans
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-medium">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch w-full">
          {activePlans?.map((plan) => {
            const isBuilder = plan.plantype.toLowerCase() === "builder";
            const features = resolveFeatures(plan.features);

            return (
              <div
                key={plan.id}
                className={`bg-[#18181C] rounded-3xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative ${
                  isBuilder
                    ? "border-[#ef5b5e] ring-1 ring-[#ef5b5e]/40"
                    : "border-gray-800/60"
                }`}
              >
                {isBuilder && (
                  <div className="w-full bg-[#ef5b5e] text-white text-[10px] font-black text-center py-2 uppercase tracking-widest">
                    Most Popular
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="text-xl font-extrabold text-white uppercase tracking-wide">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline text-white mb-6">
                    <span className="text-3xl font-black">${plan.price}</span>
                    <span className="text-xs font-semibold text-gray-400 ml-1">
                      /{plan.billing_cycle?.toLowerCase() || "monthly"}
                    </span>
                  </div>

                  <div className="bg-[#141417] border border-gray-800/60 rounded-2xl p-4 mb-6 text-left">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide block mb-1">
                      AI Query Limit
                    </span>
                    <div className="text-sm font-medium text-gray-300">
                      <span className="text-lg font-black text-[#ef5b5e] mr-1">
                        {plan.questions_per_month === -1
                          ? "Unlimited"
                          : plan.questions_per_month}
                      </span>
                      / month
                    </div>
                  </div>

                  <ul className="space-y-3.5 mb-8 text-left flex-1">
                    {features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-gray-300 font-medium leading-normal"
                      >
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3.5]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-8 pb-8 pt-2">
                  <button
                    type="button"
                    className="w-full bg-[#ef5b5e] hover:bg-[#de4f52] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
