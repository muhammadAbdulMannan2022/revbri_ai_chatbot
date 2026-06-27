"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  month?: string;
  hour?: string;
  time?: string;
  revenue?: number;
  queries?: number;
}

const tooltipStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
  fontSize: 11,
};

export function RevenueUserGrowthChart({
  data,
}: {
  data: Array<{ month: string; revenue: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 8, left: -12, bottom: 0 }}
      >
        <defs>
          <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#ef5b5e" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#ef5b5e" stopOpacity={0.08} />
          </linearGradient>
        </defs>
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
          width={46}
        />
        <Tooltip
          cursor={{ stroke: "#f8b4b4", strokeDasharray: "3 3" }}
          contentStyle={tooltipStyle}
          formatter={(value) => {
            const amount = typeof value === "number" ? value : Number(value);
            return [`$${amount.toLocaleString()}`, "Revenue"];
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue ($)"
          stroke="#ef5b5e"
          strokeWidth={2}
          fill="url(#revenueFill)"
          isAnimationActive={false}
          activeDot={{ r: 4, fill: "#ef5b5e", stroke: "white" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AiQueryVolumeChart({
  data,
}: {
  data: Array<{ month: string; queries: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart
        data={data}
        margin={{ top: 6, right: 6, left: -10, bottom: 0 }}
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
          width={44}
        />
        <Tooltip
          cursor={{ fill: "rgba(167,139,250,0.08)" }}
          contentStyle={tooltipStyle}
          formatter={(value) => {
            const count = typeof value === "number" ? value : Number(value);
            return [count.toLocaleString(), "AI Queries"];
          }}
        />
        <Bar
          dataKey="queries"
          name="AI Query Volume"
          fill="#b59af5"
          radius={[6, 6, 0, 0]}
          barSize={34}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HourlyQueryDistributionChart({
  data,
}: {
  data: Array<{ time: string; queries: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <LineChart
        data={data}
        margin={{ top: 6, right: 18, left: -8, bottom: 0 }}
      >
        <CartesianGrid stroke="#edf0f4" strokeDasharray="3 3" vertical />
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#7a8493" }}
          dy={9}
          interval={0}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: "#7a8493" }}
          domain={[0, "auto"]}
          width={42}
        />
        <Tooltip
          cursor={{ stroke: "#f8b4b4", strokeDasharray: "3 3" }}
          contentStyle={tooltipStyle}
          formatter={(value) => {
            const count = typeof value === "number" ? value : Number(value);
            return [count.toLocaleString(), "Queries"];
          }}
        />
        <Line
          type="monotone"
          dataKey="queries"
          name="Queries"
          stroke="#ef5b5e"
          strokeWidth={2}
          dot={{ r: 3, fill: "#ef5b5e", stroke: "white", strokeWidth: 1 }}
          isAnimationActive={false}
          activeDot={{ r: 4, fill: "#ef5b5e", stroke: "white" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
