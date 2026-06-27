"use client";

import React, { useState } from "react";
import {
  Check,
  Edit3,
  Loader2,
  Users,
  DollarSign,
  Award,
  X,
  Trash,
  Plus,
} from "lucide-react";
import {
  useGetPlansQuery,
  useUpdatePlanMutation,
  useGetAdminDashboardStatsQuery,
  useGetUsersQuery,
} from "@/lib/authApi";
import toast from "react-hot-toast";

export default function PricingPlansAdminPage() {
  const {
    data: plans,
    isLoading: isPlansLoading,
    refetch: refetchPlans,
  } = useGetPlansQuery();
  const { data: stats } = useGetAdminDashboardStatsQuery();
  const { data: apiUsers } = useGetUsersQuery();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editPlantype, setEditPlantype] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editBillingCycle, setEditBillingCycle] = useState("");
  const [editLimit, setEditLimit] = useState(0);
  const [editBadgeLabel, setEditBadgeLabel] = useState("");
  const [editFeatures, setEditFeatures] = useState<string[]>([]);

  // 1. Safe extraction of users list for stats computation
  const userList = Array.isArray(apiUsers)
    ? apiUsers
    : apiUsers && Array.isArray(apiUsers.results)
      ? apiUsers.results
      : apiUsers && Array.isArray(apiUsers.data)
        ? apiUsers.data
        : [];

  const totalUsers = userList.length || stats?.total_users || 0;

  // 2. Count users by package dynamically
  const getCountByPkg = (pkgName: string) => {
    return userList.filter(
      (u: any) => (u.package || "Free").toLowerCase() === pkgName.toLowerCase(),
    ).length;
  };

  const freeCount = getCountByPkg("free");
  const coreCount = getCountByPkg("core");
  const builderCount = getCountByPkg("builder");
  const anchorCount = getCountByPkg("anchor");

  const paidCount = totalUsers - freeCount;

  // 3. Compute dynamic revenue metrics based on plan pricing and active users
  const getPlanPrice = (pkgName: string, fallback: number) => {
    const p = plans?.find(
      (pl) => pl.plantype.toLowerCase() === pkgName.toLowerCase(),
    );
    return p ? p.price : fallback;
  };

  const corePrice = getPlanPrice("core", 29);
  const builderPrice = getPlanPrice("builder", 79);
  const anchorPrice = getPlanPrice("anchor", 149);

  const coreRevenue = coreCount * corePrice;
  const builderRevenue = builderCount * builderPrice;
  const anchorRevenue = anchorCount * anchorPrice;

  const totalRevenue = coreRevenue + builderRevenue + anchorRevenue;

  // percentages
  const freePercent =
    totalUsers > 0 ? Math.round((freeCount / totalUsers) * 100) : 0;
  const paidPercent =
    totalUsers > 0 ? Math.round((paidCount / totalUsers) * 100) : 0;

  const handleToggleActive = async (planId: number, currentStatus: boolean) => {
    try {
      await updatePlan({
        id: planId,
        body: { is_active: !currentStatus },
      }).unwrap();
      toast.success("Plan status updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update plan status.");
    }
  };

  const getPlanFeatures = (plantype: string) => {
    switch (plantype.toLowerCase()) {
      case "free":
        return ["Basic support", "Community access", "Email updates"];
      default:
        return [
          "Priority AI suggestions",
          "Custom dashboard integrations",
          "Advanced conversation memory",
          "Dedicated priority support",
          "Weekly email analytics reports",
        ];
    }
  };

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan);
    setEditName(plan.name);
    setEditPlantype(plan.plantype || "");
    setEditPrice(plan.price);
    setEditBillingCycle(plan.billing_cycle || "Monthly");
    setEditLimit(plan.questions_per_month);
    setEditBadgeLabel(plan.badge_label || "");

    const rawFeatures = plan.features || [];
    const initialFeatures = rawFeatures.map((f: any) =>
      typeof f === "string" ? f : f.name || "",
    );
    setEditFeatures(
      initialFeatures.length > 0
        ? initialFeatures
        : getPlanFeatures(plan.plantype),
    );
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      await updatePlan({
        id: editingPlan.id,
        body: {
          name: editName,
          price: editPrice,
          billing_cycle: editBillingCycle,
          questions_per_month: editLimit,
          badge_label: editBadgeLabel,
          features: editFeatures.map((f) => ({ name: f, is_active: true })),
        },
      }).unwrap();
      toast.success("Plan updated successfully!");
      setEditingPlan(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save plan changes.");
    }
  };

  if (isPlansLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center bg-slate-50/50">
        <Loader2 size={32} className="animate-spin text-[#ef5b5e]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 flex flex-col gap-10 pb-20">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold leading-tight tracking-normal text-[#151b26]">
          Pricing Plans
        </h1>
        <p className="mt-[5px] text-xs text-[#6d7480]">
          Manage and edit your subscription plans
        </p>
      </div>

      {/* Plans Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch w-full">
        {plans?.map((plan) => {
          const isBuilder = plan.plantype.toLowerCase() === "builder";
          const features = getPlanFeatures(plan.plantype);

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative ${
                isBuilder
                  ? "border-[#ef5b5e] ring-1 ring-[#ef5b5e]/20"
                  : "border-slate-100"
              }`}
            >
              {isBuilder && (
                <div className="w-full bg-[#ef5b5e] text-white text-[10px] font-black text-center py-2 uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              {/* Card Main Info */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className="text-xl font-extrabold text-[#111827] uppercase tracking-wide">
                    {plan.name}
                  </h3>

                  {/* Status Toggle switch */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">
                      Active
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleActive(plan.id, plan.is_active)
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                        plan.is_active ? "bg-[#ef5b5e]" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          plan.is_active ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline text-slate-900 mb-6">
                  <span className="text-3xl font-black">${plan.price}</span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">
                    /monthly
                  </span>
                </div>

                {/* AI Query Limit Highlight */}
                <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 mb-6 text-left">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide block mb-1">
                    AI Query Limit
                  </span>
                  <div className="text-sm font-medium text-slate-700">
                    <span className="text-lg font-black text-[#ef5b5e] mr-1">
                      {plan.questions_per_month === -1
                        ? "Unlimited"
                        : plan.questions_per_month}
                    </span>
                    / month
                  </div>
                </div>

                {/* Bullet Feature checklist */}
                <ul className="space-y-3.5 mb-8 text-left flex-1">
                  {features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-600 font-medium leading-normal"
                    >
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3.5]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Edit button footer */}
              <div className="px-8 pb-8 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(plan)}
                  className="w-full bg-[#ef5b5e] hover:bg-[#de4f52] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow"
                >
                  <Edit3 size={14} />
                  Edit Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Analytics Title */}
      <div className="border-t border-slate-100 pt-10">
        <h2 className="text-xl font-extrabold tracking-normal text-[#151b26] mb-6">
          Plan Analytics
        </h2>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Free Users
              </span>
              <p className="text-2xl font-black text-slate-800">
                {freeCount.toLocaleString()}
              </p>
              <span className="text-[10px] font-bold text-blue-500">
                {freePercent}% of total users
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Paid Users
              </span>
              <p className="text-2xl font-black text-slate-800">
                {paidCount.toLocaleString()}
              </p>
              <span className="text-[10px] font-bold text-emerald-500">
                {paidPercent}% of total users
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Revenue
              </span>
              <p className="text-2xl font-black text-slate-800">
                ${totalRevenue.toLocaleString()}
              </p>
              <span className="text-[10px] font-bold text-rose-500">
                Monthly recurring revenue
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Users & Revenue progress dashboard */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 md:p-8">
          <h3 className="text-sm font-black text-[#1f2937] uppercase tracking-wider mb-6">
            Users & Revenue by Package
          </h3>

          <div className="space-y-6">
            {/* Free tier progress row */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs font-bold">
                <span className="text-slate-700">
                  Free Plan ({freeCount} users)
                </span>
                <span className="text-slate-400">
                  $0{" "}
                  <span className="font-medium text-[10px] lowercase text-slate-400">
                    Monthly revenue
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-300 rounded-full"
                  style={{
                    width: `${totalUsers > 0 ? (freeCount / totalUsers) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Core progress row */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs font-bold">
                <span className="text-slate-700">
                  Core Plan ({coreCount} users)
                </span>
                <span className="text-slate-700">
                  ${coreRevenue.toLocaleString()}{" "}
                  <span className="font-medium text-[10px] lowercase text-slate-400">
                    Monthly revenue
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ef5b5e] rounded-full"
                  style={{
                    width: `${totalUsers > 0 ? (coreCount / totalUsers) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Builder progress row */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs font-bold">
                <span className="text-slate-700">
                  Builder Plan ({builderCount} users)
                </span>
                <span className="text-slate-700">
                  ${builderRevenue.toLocaleString()}{" "}
                  <span className="font-medium text-[10px] lowercase text-slate-400">
                    Monthly revenue
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${totalUsers > 0 ? (builderCount / totalUsers) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Anchor progress row */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs font-bold">
                <span className="text-slate-700">
                  Anchor Plan ({anchorCount} users)
                </span>
                <span className="text-slate-700">
                  ${anchorRevenue.toLocaleString()}{" "}
                  <span className="font-medium text-[10px] lowercase text-slate-400">
                    Monthly revenue
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{
                    width: `${totalUsers > 0 ? (anchorCount / totalUsers) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal popup */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setEditingPlan(null)}
          />

          <form
            onSubmit={handleSaveChanges}
            className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-800">
                Edit {editingPlan.name} Plan
              </h3>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Plan Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Billing Cycle
                  </label>
                  <select
                    required
                    value={editBillingCycle}
                    onChange={(e) => setEditBillingCycle(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-semibold text-slate-800 bg-white"
                  >
                    <option value="" disabled>
                      Select a cycle
                    </option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  AI Query Limit (per month)
                </label>
                <input
                  type="number"
                  required
                  min={-1}
                  value={editLimit}
                  onChange={(e) => setEditLimit(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Badge/Label Name
                </label>
                <input
                  type="text"
                  value={editBadgeLabel}
                  onChange={(e) => setEditBadgeLabel(e.target.value)}
                  placeholder="e.g. Most Popular, Best Value"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Features
                </label>

                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {editFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={feature}
                        onChange={(e) => {
                          const updated = [...editFeatures];
                          updated[idx] = e.target.value;
                          setEditFeatures(updated);
                        }}
                        placeholder="Feature item"
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs font-semibold text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditFeatures(
                            editFeatures.filter((_, i) => i !== idx),
                          )
                        }
                        className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer shrink-0"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setEditFeatures([...editFeatures, ""])}
                  className="text-xs font-bold text-[#ef5b5e] hover:text-[#de4f52] flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <Plus size={14} />
                  Add Feature Item
                </button>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="flex-1 py-3 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-sm transition duration-200 active:scale-98 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 py-3 px-4 bg-[#ef5b5e] hover:bg-[#de4f52] text-white font-bold rounded-xl text-sm transition duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-100 disabled:opacity-60"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
