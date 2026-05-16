"use client";

import { useTradeLicenseApplicationStats } from "@workspace/api-client";
import { 
  Users, 
  Building2, 
  FileCheck,
  TrendingUp,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { enToBnNumber } from "@workspace/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function TradeLicenseApplicationStats() {
  const { data: stats, isLoading } = useTradeLicenseApplicationStats();

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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatCard
        icon={<Users className="w-6 h-6" />}
        label="মোট আবেদন"
        value={enToBnNumber(stats?.total) || "০"}
        iconBgClass="bg-primary/10"
        iconTextClass="text-primary"
      />
      <StatCard
        icon={<Building2 className="w-6 h-6" />}
        label="অনুমোদিত আবেদন"
        value={enToBnNumber(stats?.approved) || "০"}
        iconBgClass="bg-emerald-500/10"
        iconTextClass="text-emerald-600"
      />
      <StatCard
        icon={<FileCheck className="w-6 h-6" />}
        label="অপেক্ষমান আবেদন"
        value={enToBnNumber(stats?.pending) || "০"}
        iconBgClass="bg-amber-500/10"
        iconTextClass="text-amber-600"
      />
      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="বাতিলকৃত আবেদন"
        value={enToBnNumber(stats?.rejected) || "০"}
        iconBgClass="bg-rose-500/10"
        iconTextClass="text-rose-600"
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
