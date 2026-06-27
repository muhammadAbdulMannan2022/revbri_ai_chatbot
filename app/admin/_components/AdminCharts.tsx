"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 66000 },
  { month: "Jul", revenue: 72000 },
  { month: "Aug", revenue: 67000 },
  { month: "Sep", revenue: 80000 },
  { month: "Oct", revenue: 87500 },
  { month: "Nov", revenue: 94000 },
  { month: "Dec", revenue: 100000 },
];

const engagementData = [
  { day: "Mon", activeUsers: 2500 },
  { day: "Tue", activeUsers: 1500 },
  { day: "Wed", activeUsers: 10000 },
  { day: "Thu", activeUsers: 3900 },
  { day: "Fri", activeUsers: 4750 },
  { day: "Sat", activeUsers: 3700 },
  { day: "Sun", activeUsers: 4300 },
];

const userDistributionData = [
  { name: "Free Users", value: 67, color: "#d9dde3" },
  { name: "Paid Subscribers", value: 33, color: "#ef5b5e" },
];

const chartTooltipStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
  fontSize: 11,
};

export function RevenueGrowthChart({ data }: { data?: Array<{ month: string; revenue: number }> }) {
  const chartData = data && data.length > 0 ? data : revenueData;
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <LineChart
        data={chartData}
        margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="#edf0f4" strokeDasharray="3 3" vertical />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#7a8493" }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#7a8493" }}
          domain={[0, "auto"]}
          width={50}
        />
        <Tooltip
          cursor={{ stroke: "#f8b4b4", strokeDasharray: "3 3" }}
          contentStyle={chartTooltipStyle}
          formatter={(value) => {
            const amount = typeof value === "number" ? value : Number(value);

            return [`$${amount.toLocaleString()}`, "Revenue"];
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#ef5b5e"
          strokeWidth={2.4}
          dot={false}
          isAnimationActive={false}
          activeDot={{ r: 4, fill: "#ef5b5e", stroke: "white" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function WeeklyEngagementChart({ data }: { data?: Array<{ day: string; activeUsers: number }> }) {
  const chartData = data && data.length > 0 ? data : engagementData;
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart
        data={chartData}
        margin={{ top: 3, right: 4, left: -10, bottom: 0 }}
      >
        <CartesianGrid stroke="#edf0f4" strokeDasharray="3 3" vertical />
        <XAxis
          dataKey="day"
          axisLine={{ stroke: "#9aa3af" }}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#7a8493" }}
          dy={7}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#7a8493" }}
          domain={[0, "auto"]}
          width={42}
        />
        <Tooltip
          cursor={{ fill: "rgba(239,91,94,0.06)" }}
          contentStyle={chartTooltipStyle}
          formatter={(value) => {
            const count = typeof value === "number" ? value : Number(value);

            return [count.toLocaleString(), "Active Users"];
          }}
        />
        <Legend
          align="center"
          verticalAlign="bottom"
          iconType="square"
          wrapperStyle={{
            color: "#ef5b5e",
            fontSize: 10,
            paddingTop: 8,
          }}
        />
        <Bar
          dataKey="activeUsers"
          name="Active Users"
          fill="#ff9c99"
          radius={[7, 7, 0, 0]}
          barSize={22}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function UserDistributionChart({ data }: { data?: Array<{ name: string; value: number; color: string }> }) {
  const chartData = data && data.length > 0 ? data : userDistributionData;
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="58%"
          dataKey="value"
          innerRadius={0}
          outerRadius="74%"
          paddingAngle={0}
          stroke="none"
          startAngle={0}
          endAngle={360}
          isAnimationActive={false}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value, name) => {
            const percentage =
              typeof value === "number" ? value : Number(value);

            return [`${percentage}%`, name];
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
