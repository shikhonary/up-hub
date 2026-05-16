"use client";

import { useTradeLicenseApplicationById } from "@workspace/api-client";
import { TradeLicenseApplicationForm } from "../components/trade-license-application-form";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { 
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

interface EditTradeLicenseApplicationViewProps {
  id: string;
}

export const EditTradeLicenseApplicationView = ({ id }: EditTradeLicenseApplicationViewProps) => {
  const { data, isLoading } = useTradeLicenseApplicationById(id);
  const application = data;

  if (isLoading) {
    return (
      <div className="pb-20 px-4 md:px-8 w-full max-w-5xl mx-auto space-y-12 animate-pulse">
        {/* Skeleton Progress */}
        <div className="flex justify-between items-center mb-12 relative">
           <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3 relative z-10">
              <Skeleton className="w-12 h-12 rounded-2xl bg-slate-200" />
              <Skeleton className="h-2 w-10 bg-slate-200 opacity-60" />
            </div>
          ))}
        </div>
        
        {/* Skeleton Form */}
        <div className="space-y-8 bg-white p-8 rounded-[32px] border border-outline/5 shadow-ambient">
          <div className="flex flex-col gap-4">
             <Skeleton className="h-8 w-1/3 bg-slate-100" />
             <Skeleton className="h-4 w-1/2 bg-slate-100 opacity-60" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="space-y-2">
                 <Skeleton className="h-3 w-20 bg-slate-100" />
                 <Skeleton className="h-12 w-full bg-slate-100 rounded-xl" />
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-[32px] bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
           <ChevronLeft className="w-10 h-10 rotate-45" />
        </div>
        <h3 className="text-xl font-black text-on-surface tracking-tight">আবেদন পাওয়া যায়নি</h3>
        <p className="text-on-surface-variant/60 font-bold mt-2 max-w-xs">
          আপনি যে আবেদনটি এডিট করার চেষ্টা করছেন তা খুঁজে পাওয়া যায়নি অথবা আপনার এটি দেখার অনুমতি নেই।
        </p>
        <Link href="/trade-license/applications" className="mt-8">
           <button className="px-6 py-3 bg-primary text-white font-black rounded-2xl shadow-glow hover:scale-[1.02] transition-all active:scale-[0.98]">
              তালিকায় ফিরে যান
           </button>
        </Link>
      </div>
    );
  }

  return (
    <TradeLicenseApplicationForm id={id} initialData={application as any} />
  );
};
