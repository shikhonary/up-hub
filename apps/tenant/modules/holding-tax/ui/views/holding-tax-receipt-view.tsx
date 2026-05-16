"use client";

import { useHoldingTaxById } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Printer, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { enToBnNumber } from "@workspace/utils";
import Link from "next/link";

interface HoldingTaxReceiptViewProps {
  id: string;
}

export const HoldingTaxReceiptView = ({ id }: HoldingTaxReceiptViewProps) => {
  const { data: tax, isLoading } = useHoldingTaxById(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-2xl animate-pulse space-y-8">
          <div className="flex justify-between border-b pb-8">
             <Skeleton className="h-12 w-48" />
             <Skeleton className="h-12 w-32" />
          </div>
          <div className="space-y-4">
             <Skeleton className="h-6 w-full" />
             <Skeleton className="h-6 w-3/4" />
             <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="grid grid-cols-2 gap-8">
             <Skeleton className="h-32 w-full rounded-2xl" />
             <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!tax || tax.status !== "PAID") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="bg-white p-12 rounded-[40px] shadow-ambient text-center max-w-md">
           <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-6">
              <ShieldCheck size={40} />
           </div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">রশিদ পাওয়া যায়নি</h1>
           <p className="text-slate-500 mb-8 font-medium">রশিদ শুধুমাত্র পরিশোধিত ট্যাক্স রেকর্ডের জন্য তৈরি করা সম্ভব।</p>
           <Link href="/holding-tax/records">
             <Button variant="outline" className="rounded-2xl h-12 px-8 font-black">
                ফিরে যান
             </Button>
           </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/50 print:bg-white py-12 print:py-0">
      {/* Action Bar - Hidden on print */}
      <div className="max-w-[800px] mx-auto mb-8 flex justify-between items-center px-6 print:hidden">
         <Link href="/holding-tax/records">
           <Button 
             variant="ghost" 
             className="rounded-2xl font-bold text-slate-600 hover:text-primary transition-all"
           >
             <ArrowLeft size={18} className="mr-2" /> ফিরে যান
           </Button>
         </Link>
         <Button 
           onClick={handlePrint}
           className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-2xl shadow-glow transition-all active:scale-95"
         >
           <Printer size={18} className="mr-2" /> প্রিন্ট করুন
         </Button>
      </div>

      {/* Receipt Content */}
      <div className="max-w-[800px] mx-auto bg-white print:shadow-none shadow-ambient rounded-[40px] print:rounded-none overflow-hidden relative isolate">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -mr-32 -mt-32 print:hidden" />
        
        <div className="p-12 print:p-8">
           {/* Header */}
           <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                       <CheckCircle2 size={32} strokeWidth={3} />
                    </div>
                    <div>
                       <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-1">ইউনিয়ন পরিষদ</h1>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest opacity-60">হোল্ডিং ট্যাক্স রশিদ</p>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">রশিদ নম্বর</p>
                    <p className="text-base font-mono font-black text-primary">#{tax?.id?.split("-")[0]?.toUpperCase() ?? "—"}</p>
                 </div>
              </div>

              <div className="text-right space-y-6">
                 <div className="bg-emerald-50 text-emerald-700 px-5 py-2 rounded-2xl border border-emerald-100 inline-flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">পরিশোধিত</span>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">তারিখ</p>
                    <p className="text-sm font-black text-slate-700">
                       {tax?.paidAt ? enToBnNumber(format(new Date(tax.paidAt), "dd MMMM, yyyy", { locale: bn })) : enToBnNumber(format(new Date(), "dd MMMM, yyyy", { locale: bn }))}
                    </p>
                 </div>
              </div>
           </div>

           {/* Content Grid */}
           <div className="grid grid-cols-2 gap-12 mb-16">
              <div className="space-y-8">
                 <Section label="করদাতার তথ্য">
                    <div className="space-y-4">
                       <InfoItem label="নাম" value={tax?.assessment?.fullNameBn} />
                       <InfoItem label="পিতা/স্বামী" value={tax?.assessment?.fatherNameBn} />
                       <InfoItem label="মোবাইল" value={enToBnNumber(tax?.assessment?.mobile)} />
                    </div>
                 </Section>

                 <Section label="হোল্ডিং তথ্য">
                    <div className="space-y-4">
                       <InfoItem label="হোল্ডিং নম্বর" value={enToBnNumber(tax?.assessment?.holdingNo)} />
                       <InfoItem label="ওয়ার্ড নম্বর" value={enToBnNumber(tax?.assessment?.wardNo)} />
                       <InfoItem label="গ্রাম/মহল্লা" value={tax?.assessment?.villageBn} />
                    </div>
                 </Section>
              </div>

              <div className="space-y-8">
                 <Section label="পেমেন্ট বিবরণ">
                    <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
                       <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-500">অর্থবছর</span>
                          <span className="font-black text-slate-900">{tax?.fiscalYear?.nameBn}</span>
                       </div>
                       <div className="h-px bg-slate-200/50" />
                       <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-500">ধার্যকৃত কর</span>
                          <span className="font-black text-slate-900">৳{enToBnNumber(tax?.totalAmount ?? 0)}</span>
                       </div>
                       <div className="h-px bg-slate-200/50" />
                       <div className="flex justify-between items-center text-sm text-emerald-600">
                          <span className="font-black">পরিশোধিত</span>
                          <span className="font-black">৳{enToBnNumber(tax?.paidAmount ?? 0)}</span>
                       </div>
                    </div>
                 </Section>

                 <div className="bg-primary/5 rounded-[32px] p-8 border border-primary/10 text-center space-y-2">
                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">মোট আদায়কৃত টাকা</p>
                    <h2 className="text-4xl font-black text-primary tracking-tighter">৳{enToBnNumber(tax?.paidAmount ?? 0)}</h2>
                    <p className="text-[10px] font-bold text-primary/60 italic border-t border-primary/10 pt-2 mt-2">
                       কথায়: {tax?.paidAmount ? "টাকা মাত্র" : "—"}
                    </p>
                 </div>
              </div>
           </div>

           {/* Footer */}
           <div className="grid grid-cols-2 gap-20 pt-20">
              <div className="text-center space-y-4">
                 <div className="h-px bg-slate-200 w-full" />
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">আদায়কারীর স্বাক্ষর</p>
              </div>
              <div className="text-center space-y-4">
                 <div className="h-px bg-slate-200 w-full" />
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">সচিব/চেয়ারম্যানের স্বাক্ষর</p>
              </div>
           </div>

           <div className="mt-20 text-center opacity-20 flex flex-col items-center gap-2">
              <div className="w-12 h-1 bg-slate-300 rounded-full" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-900">
                 Generated by Upazila Hub
              </p>
           </div>
        </div>
      </div>

    </div>
  );
};

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] border-l-4 border-primary pl-3">
      {label}
    </h3>
    {children}
  </div>
);

const InfoItem = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex justify-between items-end gap-4 group">
    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0 mb-0.5">
      {label}
    </span>
    <div className="h-px bg-slate-100 group-hover:bg-primary/20 flex-grow transition-colors" />
    <span className="text-sm font-black text-slate-700 tracking-tight">
      {value || "—"}
    </span>
  </div>
);
