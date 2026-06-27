"use client";

import dynamic from "next/dynamic";
import { Activity, Loader2, UserCheck, UserPlus, UserRound, Users } from "lucide-react";
import { useGetAdminDashboardStatsQuery } from "@/lib/authApi";

const RevenueGrowthChart = dynamic(
  () =>
    import("./_components/AdminCharts").then((mod) => mod.RevenueGrowthChart),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-50/50 rounded-xl" />,
  },
);

const WeeklyEngagementChart = dynamic(
  () =>
    import("./_components/AdminCharts").then(
      (mod) => mod.WeeklyEngagementChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-50/50 rounded-xl" />,
  },
);

const UserDistributionChart = dynamic(
  () =>
    import("./_components/AdminCharts").then(
      (mod) => mod.UserDistributionChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-50/50 rounded-xl" />,
  },
);

export default function AdminPage() {
  const { data: stats, isLoading, isError } = useGetAdminDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#ef5b5e]" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 text-center">
        <p className="text-slate-500 font-semibold">Failed to load admin stats.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-md hover:bg-rose-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: String(stats.total_users),
      note: "All-time registrations",
      icon: Users,
    },
    {
      label: "Active Users",
      value: String(stats.active_users),
      note: `${stats.active_users_percentage}% of total`,
      icon: Activity,
    },
    {
      label: "Inactive Users",
      value: String(stats.inactive_users),
      note: `${stats.inactive_users_percentage}% of total`,
      icon: UserRound,
    },
  ];

  const mappedWeeklyEngagement = stats.weekly_engagement.map((item) => ({
    day: item.day,
    activeUsers: item.users,
  }));

  const mappedUserDistribution = [
    {
      name: "Free Users",
      value: stats.user_distribution.free_users_percentage,
      color: "#d9dde3",
    },
    {
      name: "Paid Subscribers",
      value: stats.user_distribution.paid_subscribers_percentage,
      color: "#ef5b5e",
    },
  ];

  return (
    <>
      <section>
        <h1 className="text-[clamp(25px,1.65vw,29px)] font-extrabold leading-tight tracking-normal text-[#151b26]">
          Dashboard Overview
        </h1>
        <p className="mt-[5px] text-[11px] text-[#4e5b6c]">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>

        <div className="mt-[clamp(22px,1.9vw,34px)] grid gap-[clamp(26px,2vw,36px)] md:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.label}
                className="flex h-[clamp(114px,8.4vw,148px)] items-center justify-between rounded-[10px] border border-[#d9e0e8] bg-white px-[clamp(22px,1.7vw,30px)] shadow-[0_1px_2px_rgba(15,23,42,0.05)] animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div>
                  <p className="text-[10px] font-bold text-[#1f2937]">
                    {card.label}
                  </p>
                  <p className="mt-[9px] text-[clamp(24px,1.6vw,28px)] font-extrabold leading-none text-[#111827]">
                    {card.value}
                  </p>
                  <p
                    className={`mt-[8px] text-[9px] font-semibold ${
                      card.label === "Total Users"
                        ? "text-[#16a34a]"
                        : "text-[#384253]"
                    }`}
                  >
                    {card.note}
                  </p>
                </div>

                <div className="flex h-[clamp(40px,2.85vw,50px)] w-[clamp(40px,2.85vw,50px)] items-center justify-center rounded-lg bg-[#fff1f1] text-[#ef5b5e]">
                  <Icon size={20} strokeWidth={1.9} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-[clamp(22px,1.7vw,30px)] grid gap-[20px] xl:grid-cols-2">
        <article className="h-[clamp(340px,25.4vw,446px)] rounded-[10px] border border-[#d9e0e8] bg-white px-[clamp(22px,1.6vw,28px)] py-[clamp(22px,2vw,35px)] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <h2 className="text-[12px] font-extrabold text-[#111827]">
            Revenue Growth
          </h2>

          <div className="mt-[clamp(17px,1.7vw,30px)] h-[clamp(262px,19.4vw,340px)]">
            <RevenueGrowthChart data={stats.revenue_growth} />
          </div>
        </article>

        <article className="h-[clamp(340px,25.4vw,446px)] rounded-[10px] border border-[#d9e0e8] bg-white px-[clamp(22px,1.6vw,28px)] py-[clamp(22px,2vw,35px)] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <h2 className="text-[12px] font-extrabold text-[#111827]">
            Weekly Engagement
          </h2>

          <div className="mt-[clamp(17px,1.7vw,30px)] h-[clamp(262px,19.4vw,340px)]">
            <WeeklyEngagementChart data={mappedWeeklyEngagement} />
          </div>
        </article>
      </section>

      <section className="mt-[clamp(20px,1.5vw,26px)] grid gap-[20px] xl:grid-cols-[clamp(340px,25.6vw,450px)_minmax(0,1fr)]">
        <article className="h-[clamp(350px,26.3vw,463px)] rounded-[10px] border border-[#d9e0e8] bg-white px-[22px] py-[22px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <h2 className="text-[12px] font-extrabold text-[#111827]">
            User Distribution
          </h2>

          <div className="relative mt-[16px] h-[clamp(250px,17.6vw,310px)]">
            <span className="absolute left-[12px] top-[31px] text-[9px] font-medium text-[#a4abb6]">
              Free Users {stats.user_distribution.free_users_percentage}%
            </span>
            <span className="absolute bottom-[27px] right-[14px] text-[9px] font-medium text-[#ef5b5e]">
              Paid Subscribers {stats.user_distribution.paid_subscribers_percentage}%
            </span>

            <UserDistributionChart data={mappedUserDistribution} />
          </div>

          <div className="flex items-center justify-center gap-[14px]">
            <div className="flex items-center gap-[5px] text-[9px] text-[#6f7885]">
              <span className="h-[8px] w-[12px] bg-[#8f969f]" />
              Free Users
            </div>
            <div className="flex items-center gap-[5px] text-[9px] text-[#ef5b5e]">
              <span className="h-[8px] w-[12px] bg-[#ef5b5e]" />
              Paid Subscribers
            </div>
          </div>
        </article>

        <article className="h-[clamp(350px,26.3vw,463px)] rounded-[10px] border border-[#d9e0e8] bg-white px-[22px] py-[22px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <h2 className="text-[12px] font-extrabold text-[#111827]">
            Recent Activities
          </h2>

          <div className="mt-[13px] overflow-y-auto max-h-[360px] hide-scrollbar">
            {stats.recent_activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[260px] text-slate-400 text-xs gap-2">
                <Users size={24} className="stroke-[1.5]" />
                <p>No recent activity recorded.</p>
              </div>
            ) : (
              stats.recent_activities.map((activity, index) => (
                <div
                  key={`${activity.user}-${activity.time}`}
                  className={`flex items-start gap-[14px] py-[13px] animate-in fade-in duration-200 ${
                    index === stats.recent_activities.length - 1
                      ? ""
                      : "border-b border-[#edf0f4]"
                  }`}
                >
                  <div className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-[#ffb8b8] bg-[#fff6f6] text-[#ef5b5e]">
                    {index % 2 === 0 ? (
                      <UserPlus size={10} strokeWidth={2} />
                    ) : (
                      <UserCheck size={10} strokeWidth={2} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-semibold text-[#1f2937]">
                      <span className="font-extrabold">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="mt-[5px] text-[9px] text-[#687386]">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </>
  );
}
