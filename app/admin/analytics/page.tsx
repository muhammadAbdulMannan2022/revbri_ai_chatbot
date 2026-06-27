"use client";

import dynamic from "next/dynamic";
import {
  Bot,
  DollarSign,
  Loader2,
  TrendingDown,
  Users,
} from "lucide-react";
import { useGetAdvancedAnalyticsQuery } from "@/lib/authApi";

const RevenueUserGrowthChart = dynamic(
  () =>
    import("../_components/AnalyticsCharts").then(
      (mod) => mod.RevenueUserGrowthChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  },
);

const AiQueryVolumeChart = dynamic(
  () =>
    import("../_components/AnalyticsCharts").then(
      (mod) => mod.AiQueryVolumeChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  },
);

const HourlyQueryDistributionChart = dynamic(
  () =>
    import("../_components/AnalyticsCharts").then(
      (mod) => mod.HourlyQueryDistributionChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  },
);

const summaryCards = [
  { key: "total_revenue" as const, label: "Total Revenue (MRR)", icon: DollarSign, bg: "bg-[#eafaf1]", accent: "text-[#16a34a]" },
  { key: "user_growth" as const, label: "User Growth", icon: Users, bg: "bg-[#eef4ff]", accent: "text-[#2563eb]" },
  { key: "ai_queries" as const, label: "AI Queries (MQ)", icon: Bot, bg: "bg-[#f4efff]", accent: "text-[#8b5cf6]" },
  { key: "churn_rate" as const, label: "Churn Rate", icon: TrendingDown, bg: "bg-[#fff1f1]", accent: "text-[#ef5b5e]" },
];

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useGetAdvancedAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center bg-slate-50/50">
        <Loader2 size={32} className="animate-spin text-[#ef5b5e]" />
      </div>
    );
  }

  return (
    <>
      <section>
        <h1 className="text-[clamp(25px,1.65vw,29px)] font-extrabold leading-tight tracking-normal text-[#151b26]">
          Advanced Analytics
        </h1>
        <p className="mt-[6px] text-[11px] text-[#4e5b6c]">
          Deep insights into your platform performance
        </p>
      </section>

      <section className="mt-[24px]">
        <p className="text-[11px] font-semibold text-[#4e5b6c]">
          Performance On A Monthly Basis
        </p>

        <div className="mt-[13px] grid gap-[16px] md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const item = analytics?.summary?.[card.key];
            const Icon = card.icon;
            const trendIsUp = item?.is_positive ?? true;

            return (
              <article
                key={card.key}
                className="flex h-[111px] items-center justify-between rounded-[9px] border border-[#d9e0e8] bg-white px-[19px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
              >
                <div>
                  <div
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-[8px] ${card.bg} ${card.accent}`}
                  >
                    <Icon size={15} strokeWidth={2} />
                  </div>
                  <p className="mt-[10px] text-[10px] font-semibold text-[#647084]">
                    {card.label}
                  </p>
                  <p className="mt-[3px] text-[20px] font-extrabold leading-none text-[#111827]">
                    {item?.value ?? "—"}
                  </p>
                </div>

                <div
                  className={`mt-[1px] flex self-start pt-[17px] text-[9px] font-extrabold ${
                    trendIsUp ? "text-[#16a34a]" : "text-[#ef4444]"
                  }`}
                >
                  {item?.trend ?? "—"}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-[20px] grid gap-[20px] xl:grid-cols-2">
        <article className="h-[274px] rounded-[10px] border border-[#d9e0e8] bg-white px-[20px] py-[20px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <h2 className="text-[12px] font-extrabold text-[#111827]">
            Revenue & User Growth
          </h2>

          <div className="mt-[18px] h-[197px]">
            <RevenueUserGrowthChart data={analytics?.revenue_user_growth_chart ?? []} />
          </div>

          <div className="flex justify-center text-[9px] font-medium text-[#ef5b5e]">
            <span className="mr-[5px] mt-[5px] h-[2px] w-[10px] bg-[#ef5b5e]" />
            Revenue ($)
          </div>
        </article>

        <article className="h-[274px] rounded-[10px] border border-[#d9e0e8] bg-white px-[20px] py-[20px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <h2 className="text-[12px] font-extrabold text-[#111827]">
            AI Query Volume by Month
          </h2>

          <div className="mt-[18px] h-[213px]">
            <AiQueryVolumeChart data={analytics?.ai_query_volume_chart ?? []} />
          </div>
        </article>
      </section>

      <section className="mt-[20px] rounded-[10px] border border-[#d9e0e8] bg-white px-[20px] py-[20px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <h2 className="text-[12px] font-extrabold text-[#111827]">
          Hourly Query Distribution
        </h2>
        <p className="mt-[4px] text-[9px] text-[#7a8493]">Today</p>

        <div className="mt-[10px] h-[210px]">
          <HourlyQueryDistributionChart data={analytics?.hourly_query_distribution ?? []} />
        </div>
      </section>

      <section className="mt-[20px] rounded-[10px] border border-[#d9e0e8] bg-white px-[20px] py-[20px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <h2 className="text-[12px] font-extrabold text-[#111827]">
          User Retention Cohort Analysis
        </h2>

        <div className="mt-[17px] overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="bg-[#fafbfc] text-[9px] uppercase text-[#6d7480]">
                <th className="px-[18px] py-[13px] font-extrabold">Cohort</th>
                <th className="px-[18px] py-[13px] text-center font-extrabold">Week 0</th>
                <th className="px-[18px] py-[13px] text-center font-extrabold">Week 1</th>
                <th className="px-[18px] py-[13px] text-center font-extrabold">Week 2</th>
                <th className="px-[18px] py-[13px] text-center font-extrabold">Week 3</th>
                <th className="px-[18px] py-[13px] text-center font-extrabold">Week 4</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#edf0f4] text-[10px] last:border-b-0">
                <td className="px-[18px] py-[12px] font-extrabold text-[#172033]" colSpan={6}>
                  <div className="flex items-center justify-center py-6 text-[#7a8493]">
                    Cohort data not available from API
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
