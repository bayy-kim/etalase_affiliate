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
  backgroundColor: "#1b1c1e",
  border: "1px solid #2a2b2d",
  borderRadius: 12,
  fontSize: 12,
  color: "#ffffff",
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
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#2a2b2d" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#a1a1aa", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
          width={34}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#ffffff", fontWeight: 600 }}
          cursor={{ stroke: "#2a2b2d" }}
        />
        <Area
          type="monotone"
          dataKey="clicks"
          name="Klik"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#trendFill)"
          dot={false}
          activeDot={{ r: 4, fill: "#111214", stroke: "#22c55e", strokeWidth: 2 }}
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
          tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          width={88}
        />
        <defs>
          <linearGradient id="barSolid" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number) => [formatRupiah(value), "Earnings"]}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar
          dataKey="total"
          name="Earnings"
          radius={[0, 4, 4, 0]}
          barSize={22}
          fill="url(#barSolid)"
          maxBarSize={maxTotal}
          label={{
            position: "right",
            fill: "#a1a1aa",
            fontSize: 11,
            fontWeight: 600,
            formatter: (v: number) => (v / 1_000_000).toFixed(1) + "M",
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
