"use client";

import React from "react";
import { useHoldingTaxStats } from "@workspace/api-client";
import { 
  Banknote, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Receipt
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { enToBnNumber } from "@workspace/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function HoldingTaxStats() {
  const { data: stats, isLoading } = useHoldingTaxStats();

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline/10 p-6 rounded-2xl shadow-ambient flex items-center gap-5">
            <Skeleton className="w-12 h-12 rounded-xl bg-surface-container" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 bg-surface-container opacity-60" />
              <Skeleton className="h-6 w-24 bg-surface-container" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <StatCard
        icon={<Receipt className="w-6 h-6" />}
        label="মোট ধার্যকৃত ট্যাক্স"
        value={`৳${enToBnNumber(stats?.totalAmount || 0)}`}
        iconBgClass="bg-blue-500/10"
        iconTextClass="text-blue-600"
      />
      <StatCard
        icon={<CheckCircle2 className="w-6 h-6" />}
        label="মোট আদায়কৃত"
        value={`৳${enToBnNumber(stats?.paidAmount || 0)}`}
        iconBgClass="bg-emerald-500/10"
        iconTextClass="text-emerald-600"
      />
      <StatCard
        icon={<AlertCircle className="w-6 h-6" />}
        label="মোট বকেয়া"
        value={`৳${enToBnNumber(stats?.dueAmount || 0)}`}
        iconBgClass="bg-rose-500/10"
        iconTextClass="text-rose-600"
      />
      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="আদায়ের হার"
        value={`${enToBnNumber(Math.round(((stats?.paidAmount || 0) / (stats?.totalAmount || 1)) * 100))}%`}
        iconBgClass="bg-amber-500/10"
        iconTextClass="text-amber-600"
      />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  iconBgClass,
  iconTextClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBgClass: string;
  iconTextClass: string;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline/10 p-6 rounded-2xl shadow-ambient flex items-center gap-5 transition-all hover:shadow-ambient-double">
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
          iconBgClass,
          iconTextClass
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">
          {label}
        </p>
        <p className="text-2xl font-black text-on-surface tracking-tight leading-none mt-1">{value}</p>
      </div>
    </div>
  );
}
