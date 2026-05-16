"use client";

import { UseFormReturn } from "@workspace/ui/components/form";
import {
  User,
  MapPin,
  ClipboardList,
  Calculator,
  CheckCircle2,
} from "lucide-react";
import { AssessmentApplicationFormValues } from "@workspace/schema";
import { enToBnNumber } from "@workspace/utils";
import { cn } from "@workspace/ui/lib/utils";

interface ReviewStepProps {
  form: UseFormReturn<AssessmentApplicationFormValues>;
}

export const ReviewStep = ({ form }: ReviewStepProps) => {
  const values = form.getValues();

  interface DataItem {
    label: string;
    value: string;
    highlight?: boolean;
  }

  interface Section {
    title: string;
    icon: any;
    isPrimary?: boolean;
    data: DataItem[];
  }

  const sections: Section[] = [
    {
      title: "ব্যক্তিগত তথ্য",
      icon: User,
      data: [
        { label: "নাম", value: values.fullNameBn },
        { label: "লিঙ্গ", value: values.genderBn },
        { label: "বৈবাহিক অবস্থা", value: values.maritalStatusBn },
        {
          label: "এনআইডি",
          value: enToBnNumber(values.nid) || "প্রদান করা হয়নি",
        },
      ],
    },
    {
      title: "ঠিকানা ও হোল্ডিং",
      icon: MapPin,
      data: [
        { label: "হোল্ডিং নং", value: values.holdingNo },
        { label: "ওয়ার্ড নং", value: `ওয়ার্ড - ${enToBnNumber(values.wardNo)}` },
        { label: "গ্রাম", value: values.villageBn },
        { label: "ডাকঘর", value: values.postOfficeBn },
      ],
    },
    {
      title: "জরিপ তথ্য",
      icon: ClipboardList,
      data: [
        { label: "পুরুষ", value: enToBnNumber(values.maleCount) },
        { label: "মহিলা", value: enToBnNumber(values.femaleCount) },
        {
          label: "উপার্জনক্ষম",
          value: enToBnNumber(values.earningMembers) || "০",
        },
        { label: "নিজস্ব নলকূপ", value: values.hasTubewell ? "আছে" : "নেই" },
      ],
    },
    {
      title: "কর নির্ধারণ",
      icon: Calculator,
      isPrimary: true,
      data: [
        {
          label: "বার্ষিক মূল্যায়ন",
          value: `৳${enToBnNumber(values.annualValuation)}`,
        },
        { label: "করের হার", value: `${enToBnNumber(values.taxRatePercent)}%` },
        {
          label: "মোট কর",
          value: `৳${enToBnNumber(values.totalTax)}`,
          highlight: true,
        },
      ],
    },
  ];

  return (
    <section className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8 flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-black text-emerald-900 tracking-tight">সব কিছু ঠিক আছে তো?</h2>
          <p className="text-sm text-emerald-700/80 font-medium">আবেদন জমা দেওয়ার আগে আপনার সকল তথ্য একবার যাচাই করে নিন।</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={cn(
              "bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 relative overflow-hidden",
              section.isPrimary && "border-primary/20 bg-primary/[0.01]"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                section.isPrimary ? "bg-primary text-white" : "bg-primary/10 text-primary"
              )}>
                <section.icon className="w-5 h-5" />
              </div>
              <h3 className="font-black text-on-surface uppercase tracking-wider text-sm">{section.title}</h3>
            </div>

            <div className="space-y-4">
              {section.data.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <span className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">{item.label}</span>
                  <span className={cn(
                    "text-sm font-black text-on-surface",
                    item.highlight && "text-primary text-lg"
                  )}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {section.isPrimary && (
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Calculator className="w-24 h-24 rotate-12" />
              </div>
            )}
          </div>
        ))}
      </div>

      {values.remarks && (
        <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
          <h3 className="text-xs font-black text-on-surface-variant opacity-60 uppercase tracking-widest mb-4">অতিরিক্ত মন্তব্য</h3>
          <p className="text-sm font-bold text-on-surface leading-relaxed italic">&quot;{values.remarks}&quot;</p>
        </div>
      )}
    </section>
  );
};
