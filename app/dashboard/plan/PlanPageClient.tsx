"use client";

import React, { useState } from "react";
import { Check, Crown, Loader2, Star, Shield, Zap } from "lucide-react";
import PromoPoster from "@/components/dashboard/PromoPoster";
import MembershipStatus from "@/components/dashboard/MembershipStatus";
import {
  useGetPlansQuery,
  useCreateCheckoutSessionMutation,
  useGetProfileQuery,
} from "@/lib/authApi";
import toast from "react-hot-toast";

// Helper to format queries/questions count to 10k, 12M, etc.
const formatLimit = (num: number) => {
  if (num === -1) return "Unlimited";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return String(num);
};

export default function PlanPageClient() {
  const {
    data: plans,
    isLoading: isPlansLoading,
    isError: isPlansError,
  } = useGetPlansQuery();
  const { data: profile } = useGetProfileQuery();
  const [createCheckoutSession, { isLoading: isCheckoutLoading }] =
    useCreateCheckoutSessionMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

  const currentPlanType =
    profile?.data?.pricing_plan?.plan_type?.toLowerCase() || "";

  const handleCheckout = async (planId: number) => {
    setLoadingPlanId(planId);
    try {
      const successUrl = `${window.location.origin}/dashboard/success`;
      const cancelUrl = `${window.location.origin}/dashboard/plan`;

      const response = await createCheckoutSession({
        plan_id: planId,
        success_url: successUrl,
        cancel_url: cancelUrl,
      }).unwrap();

      // Redirect user to Stripe Checkout
      const url = response.checkout_url || (response as any).data?.checkout_url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to retrieve checkout URL.");
      }
    } catch (err: any) {
      const errMsg =
        err?.data?.message || err?.message || "Failed to initiate checkout.";
      toast.error(errMsg);
    } finally {
      setLoadingPlanId(null);
    }
  };

  const getPlanIcon = (plantype: string) => {
    switch (plantype.toLowerCase()) {
      case "free":
        return <Shield className="w-5 h-5 text-slate-400" />;
      case "core":
        return <Star className="w-5 h-5 text-indigo-500" />;
      case "builder":
        return <Zap className="w-5 h-5 text-rose-500" />;
      case "anchor":
        return <Crown className="w-5 h-5 text-amber-500" />;
      default:
        return <Star className="w-5 h-5 text-slate-500" />;
    }
  };

  const getPlanTheme = (plantype: string) => {
    const isBuilder = plantype.toLowerCase() === "builder";
    const isAnchor = plantype.toLowerCase() === "anchor";

    if (isBuilder) {
      return {
        cardBg:
          "bg-white border-2 border-slate-900 shadow-lg scale-100 lg:scale-[1.03] z-10",
        headerBg: "bg-slate-950 text-white border-b border-slate-900",
        buttonStyle:
          "bg-[#FD6E6E] hover:bg-[#e05656] text-white shadow-rose-200",
        tag: "Best Value",
        checkBg: "bg-emerald-50 text-emerald-600",
        badge: "bg-yellow-400 text-slate-900",
      };
    }

    if (isAnchor) {
      return {
        cardBg:
          "bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1",
        headerBg:
          "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-b border-amber-600",
        buttonStyle:
          "bg-slate-900 hover:bg-slate-800 text-white shadow-amber-200",
        tag: "Premium",
        checkBg: "bg-amber-50 text-amber-600",
        badge: "bg-white text-amber-700 border border-amber-200",
      };
    }

    return {
      cardBg:
        "bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1",
      headerBg: "bg-slate-100/80 text-slate-800 border-b border-slate-100/50",
      buttonStyle:
        "bg-slate-50 hover:bg-slate-800 hover:text-white border border-slate-200 text-slate-600",
      tag: null,
      checkBg: "bg-indigo-50 text-indigo-600",
      badge: "bg-slate-200 text-slate-700",
    };
  };

  const resolveFeatures = (features: any) =>
    Array.isArray(features)
      ? features.map((f: any) => (typeof f === "string" ? f : f.name || ""))
      : [];

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-2 md:px-6 font-sans text-slate-800 flex flex-col gap-8 pb-20">
      {/* Reusable Poster Component */}
      <PromoPoster
        imageSrc="/super_sale_banner.png"
        alt="Super Sale Promo Banner"
      />

      {/* Interactive Status Segment */}
      <MembershipStatus />

      {/* Pricing Tiers */}
      {isPlansLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch w-full py-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-100 p-8 flex flex-col gap-6 animate-pulse shadow-sm"
            >
              <div className="h-20 bg-slate-100 rounded-2xl w-full" />
              <div className="h-6 bg-slate-100 rounded-md w-3/4" />
              <div className="space-y-3 flex-1 mt-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-4 bg-slate-100 rounded-md w-full" />
                ))}
              </div>
              <div className="h-12 bg-slate-100 rounded-full w-full mt-6" />
            </div>
          ))}
        </div>
      ) : isPlansError ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-semibold mb-3">
            Failed to load membership plans.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-md hover:bg-rose-600 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 w-full items-stretch justify-center">
          {plans
            ?.filter((p) => p.is_active)
            .map((plan, _, activePlans) => {
              const theme = getPlanTheme(plan.plantype);
              const isCurrentPlan =
                currentPlanType === plan.plantype.toLowerCase();
              const isPending = loadingPlanId === plan.id;
              const widthPercentage = Math.floor(100 / activePlans.length) - 3;

              return (
                <div
                  key={plan.id}
                  style={{ width: `${widthPercentage}%` }}
                  className={`rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 relative group ${theme.cardBg}`}
                >
                  {theme.tag && (
                    <div
                      className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${theme.badge}`}
                    >
                      {theme.tag}
                    </div>
                  )}

                  {/* Header segment */}
                  <div
                    className={`p-8 flex flex-col items-center justify-center text-center relative ${theme.headerBg}`}
                  >
                    <h3 className="text-sm font-black uppercase tracking-widest mb-1 flex items-center gap-1.5 opacity-90">
                      {getPlanIcon(plan.plantype)}
                      {plan.name} Plan
                    </h3>

                    <div className="flex items-center gap-4 justify-center mt-2">
                      <div className="flex items-baseline">
                        <span className="text-4xl md:text-5xl font-black">
                          ${plan.price}
                        </span>
                        <span className="text-xs font-semibold opacity-70 ml-1">
                          /{plan.billing_cycle || "Month"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features & Action area */}
                  <div className="p-8 flex flex-col flex-1 gap-6">
                    {/* Monthly queries count badge */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        Monthly Limit
                      </span>
                      <span className="text-lg font-extrabold text-slate-700">
                        {formatLimit(plan.questions_per_month)} Queries
                      </span>
                    </div>

                    <ul className="flex flex-col gap-4 flex-1">
                      {resolveFeatures(plan.features).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div
                            className={`rounded-full p-1 mt-0.5 shrink-0 ${theme.checkBg}`}
                          >
                            <Check size={14} className="stroke-[3]" />
                          </div>
                          <span className="text-sm font-medium text-slate-600 leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-6 flex flex-col gap-6">
                      <button
                        disabled={isCurrentPlan || isPending}
                        onClick={() => handleCheckout(plan.id)}
                        className={`w-full py-3.5 px-6 rounded-full font-bold text-sm tracking-wide transition-all duration-200 active:scale-98 shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${theme.buttonStyle}`}
                      >
                        {isPending ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Processing...
                          </>
                        ) : isCurrentPlan ? (
                          "Current Plan"
                        ) : (
                          "Get Started"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
