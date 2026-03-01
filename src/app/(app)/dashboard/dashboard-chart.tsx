"use client";

import { ProgressChart } from "@/components/features/ProgressChart";

interface DashboardChartProps {
  data: { label: string; score: number }[];
}

export function DashboardChart({ data }: DashboardChartProps) {
  return <ProgressChart data={data} />;
}
