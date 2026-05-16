"use client";

import { useCitizenApplicationStats } from "@workspace/api-client";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { enToBnNumber } from "@workspace/utils";

export function CitizenApplicationStats() {
  const { data: stats } = useCitizenApplicationStats();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<FileText className="w-6 h-6" />}
        label="মোট আবেদন"
        value={enToBnNumber(stats?.total) || "০"}
        iconBgClass="bg-primary/10"
        iconTextClass="text-primary"
      />
      <StatCard
        icon={<Clock className="w-6 h-6" />}
        label="অপেক্ষমান"
        value={enToBnNumber(stats?.pending) || "০"}
        iconBgClass="bg-amber-500/10"
        iconTextClass="text-amber-600"
      />
      <StatCard
        icon={<CheckCircle2 className="w-6 h-6" />}
        label="অনুমোদিত"
        value={enToBnNumber(stats?.approved) || "০"}
        iconBgClass="bg-emerald-500/10"
        iconTextClass="text-emerald-600"
      />
      <StatCard
        icon={<XCircle className="w-6 h-6" />}
        label="প্রত্যাখ্যাত"
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
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass} ${iconTextClass} shadow-sm`}
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
