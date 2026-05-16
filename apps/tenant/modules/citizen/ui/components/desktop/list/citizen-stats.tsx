"use client";

import { useCitizenStats } from "@workspace/api-client";
import { 
  Users, 
  UserCircle, 
  Map as MapIcon,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { enToBnNumber } from "@workspace/utils";

export function CitizenStats() {
  const { data: stats, isLoading } = useCitizenStats();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatCard
        icon={<Users className="w-6 h-6" />}
        label="মোট নাগরিক"
        value={enToBnNumber(stats?.total) || "০"}
        iconBgClass="bg-primary/10"
        iconTextClass="text-primary"
      />
      <StatCard
        icon={<UserCircle className="w-6 h-6" />}
        label="পুরুষ জনসংখ্যা"
        value={enToBnNumber(stats?.male) || "০"}
        iconBgClass="bg-blue-500/10"
        iconTextClass="text-blue-600"
      />
      <StatCard
        icon={<UserCircle className="w-6 h-6" />}
        label="নারী জনসংখ্যা"
        value={enToBnNumber(stats?.female) || "০"}
        iconBgClass="bg-rose-500/10"
        iconTextClass="text-rose-600"
      />
      <StatCard
        icon={<MapIcon className="w-6 h-6" />}
        label="মোট ওয়ার্ড সংখ্যা"
        value={enToBnNumber(stats?.wardStats?.length) || "০"}
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
