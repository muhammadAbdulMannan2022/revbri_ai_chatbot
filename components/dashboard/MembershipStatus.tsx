"use client";

import React, { useState } from "react";
import { Crown } from "lucide-react";
import {
  useCancelSubscriptionMutation,
  useGetUserCurrentPlanQuery,
} from "@/lib/authApi";
import toast from "react-hot-toast";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export default function MembershipStatus() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [subscriptionCancelled, setSubscriptionCancelled] = useState(false);
  const [cancelSubscription] = useCancelSubscriptionMutation();

  const { data: currentPlan, isLoading: isLoadingCurrentPlan } =
    useGetUserCurrentPlanQuery();

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const res = await cancelSubscription().unwrap();
      toast.success(res?.message || "Subscription cancelled successfully.");
      setShowCancelModal(false);
      setSubscriptionCancelled(true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel subscription.");
    } finally {
      setIsCancelling(false);
    }
  };

  const isPendingCancellation =
    subscriptionCancelled || currentPlan?.status === "pending_cancellation";

  const planName = currentPlan?.plan_details?.name
    ? currentPlan.plan_details.name.charAt(0).toUpperCase() +
      currentPlan.plan_details.name.slice(1).toLowerCase()
    : "Free";

  const getFallbackDate = () => {
    if (currentPlan?.start_date) {
      try {
        const date = new Date(currentPlan.start_date);
        date.setMonth(date.getMonth() + 1);
        return date.toISOString();
      } catch {
        return null;
      }
    }
    return null;
  };

  const validTill = currentPlan?.next_billing_date || currentPlan?.expire_date || getFallbackDate();

  return (
    <>
      <div className="bg-white w-full rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-sans">
              Membership Plan
            </h2>
            {isPendingCancellation && (
              <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 animate-pulse">
                Pending Cancellation
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-base md:text-lg font-semibold text-slate-700 font-sans">
              {isLoadingCurrentPlan
                ? "Loading..."
                : `${planName} member${isPendingCancellation ? "" : " (Current)"}`}
            </span>
            {planName.toLowerCase() !== "free" && validTill && (
              <span className="text-xs md:text-sm text-slate-400 font-sans">
                (Valid Till {formatDate(validTill)})
              </span>
            )}
          </div>
        </div>

        {planName.toLowerCase() !== "free" && (
          <div className="flex flex-col items-end w-full md:w-auto gap-2">
            <span className="text-xs text-slate-400 self-end md:self-auto uppercase tracking-wider font-semibold font-sans">
              Status
            </span>
            {!subscriptionCancelled ? (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full md:w-auto px-5 py-2.5 border border-rose-200 text-rose-500 hover:text-white rounded-xl hover:bg-rose-500 transition-all duration-200 font-semibold text-sm active:scale-98 cursor-pointer shadow-xs font-sans"
              >
                Cancel subscription
              </button>
            ) : (
              <button
                onClick={() => setSubscriptionCancelled(false)}
                className="w-full md:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-200 font-semibold text-sm active:scale-98 cursor-pointer shadow-md font-sans"
              >
                Reactivate Membership
              </button>
            )}
          </div>
        )}
      </div>

      {/* Interactive Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div
            onClick={() => setShowCancelModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Card */}
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="bg-rose-50 text-rose-500 rounded-2xl p-4 mb-4">
              <Crown className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2 font-sans">
              Cancel your {planName} Membership?
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed font-sans">
              If you cancel, you will lose priority support, advanced
              suggestions, and active AI memory when your billing cycle ends on{" "}
              <span className="font-semibold text-slate-700">
                {formatDate(validTill) || "N/A"}
              </span>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                disabled={isCancelling}
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-98 font-sans"
              >
                Keep Membership
              </button>
              <button
                disabled={isCancelling}
                onClick={handleCancelSubscription}
                className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-98 shadow-md shadow-rose-200 flex items-center justify-center gap-2 font-sans"
              >
                {isCancelling ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
