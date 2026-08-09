"use client";

import {
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { platformLabel, type PlatformKey } from "@/lib/icons";
import { formatRupiah } from "@/lib/format";

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  fontSize: "12px",
  color: "#1e293b",
  boxShadow: "0 10px 25px -5px rgba(166, 175, 195, 0.3)",
};

export function ClickTrendChart({
  data,
}: {
  data: { label: string; clicks: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f1f5f9" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
          width={34}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#0f172a", fontWeight: 700 }}
          cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }}
        />
        <Area
          type="monotone"
          dataKey="clicks"
          name="Klik"
          stroke="#4f46e5"
          strokeWidth={3}
          fill="url(#trendFill)"
          dot={false}
          activeDot={{ r: 5, fill: "#ffffff", stroke: "#4f46e5", strokeWidth: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PlatformBarChart({
  data,
}: {
  data: { platform: PlatformKey; total: number }[];
}) {
  const maxTotal = Math.max(1, ...data.map((d) => d.total));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 4, left: 0, bottom: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="platform"
          tickFormatter={(v: PlatformKey) => platformLabel[v]}
          tick={{ fill: "#1e293b", fontSize: 12, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          width={88}
        />
        <defs>
          <linearGradient id="barSolid" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number) => [formatRupiah(value), "Earnings"]}
          cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
        />
        <Bar
          dataKey="total"
          name="Earnings"
          radius={[0, 8, 8, 0]}
          barSize={24}
          fill="url(#barSolid)"
          maxBarSize={maxTotal}
          label={{
            position: "right",
            fill: "#64748b",
            fontSize: 11,
            fontWeight: 700,
            formatter: (v: number) => (v / 1_000_000).toFixed(1) + "M",
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
