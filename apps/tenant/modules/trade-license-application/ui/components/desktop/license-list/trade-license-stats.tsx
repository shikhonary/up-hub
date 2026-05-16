"use client";

import { useTradeLicenseStats } from "@workspace/api-client";
import { 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Banknote,
  ClipboardList
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { enToBnNumber } from "@workspace/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function TradeLicenseStats() {
  const { data: response, isLoading } = useTradeLicenseStats();
  const stats = response?.data;

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
        icon={<ClipboardList className="w-6 h-6" />}
        label="মোট লাইসেন্স"
        value={enToBnNumber(stats?.total) || "০"}
        iconBgClass="bg-primary/10"
        iconTextClass="text-primary"
      />
      <StatCard
        icon={<CheckCircle className="w-6 h-6" />}
        label="পরিশোধিত"
        value={enToBnNumber(stats?.paid) || "০"}
        iconBgClass="bg-emerald-500/10"
        iconTextClass="text-emerald-600"
      />
      <StatCard
        icon={<AlertCircle className="w-6 h-6" />}
        label="অপ্রদত্ত (বকেয়া)"
        value={enToBnNumber(stats?.unpaid) || "০"}
        iconBgClass="bg-amber-500/10"
        iconTextClass="text-amber-600"
      />
      <StatCard
        icon={<Banknote className="w-6 h-6" />}
        label="মোট সংগৃহীত ফি"
        value={`৳${enToBnNumber(stats?.totalRevenue) || "০"}`}
        iconBgClass="bg-blue-500/10"
        iconTextClass="text-blue-600"
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
