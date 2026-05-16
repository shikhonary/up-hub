"use client";

import { useHoldingTaxById } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  User,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  Edit,
  Info,
  Banknote,
  Receipt,
  Calculator,
  UserCircle,
  Hash,
  ArrowLeft,
  Printer
} from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@workspace/ui/lib/utils";
import { enToBnNumber } from "@workspace/utils";
import Link from "next/link";
import { useState } from "react";
import { CollectTaxModal } from "../components/collect-tax-modal";

interface HoldingTaxDetailsViewProps {
  id: string;
}

export const HoldingTaxDetailsView = ({ id }: HoldingTaxDetailsViewProps) => {
  const { data: tax, isLoading } = useHoldingTaxById(id);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-5 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!tax) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <XCircle className="w-16 h-16 text-rose-500/20 mb-4" />
        <h3 className="text-xl font-black text-slate-900 tracking-tight">ট্যাক্স রেকর্ড পাওয়া যায়নি</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">আপনি যে ট্যাক্স রেকর্ড খুঁজছেন তা সিস্টেমে বিদ্যমান নেই অথবা মুছে ফেলা হয়েছে।</p>
        <Link href="/holding-tax/records" className="mt-6">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> ফিরে যান
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-xs uppercase tracking-widest py-1.5 px-4 rounded-xl shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> পরিশোধিত
          </Badge>
        );
      case "PARTIAL":
        return (
          <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-black text-xs uppercase tracking-widest py-1.5 px-4 rounded-xl shadow-sm">
            <Clock className="w-3.5 h-3.5 mr-1.5" /> আংশিক
          </Badge>
        );
      default:
        return (
          <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-black text-xs uppercase tracking-widest py-1.5 px-4 rounded-xl shadow-sm">
            <XCircle className="w-3.5 h-3.5 mr-1.5" /> বকেয়া
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 p-8 pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-outline/5 pb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-[28px] bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <Receipt className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tighter leading-none mb-2">
              ট্যাক্স রেকর্ড বিস্তারিত
            </h2>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary/40" />
              <p className="text-sm font-bold text-primary/60 uppercase tracking-[0.1em]">
                অর্থবছর: {tax.fiscalYear?.nameBn}
              </p>
            </div>
            <div className="mt-4">
              {getStatusBadge(tax.status)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {tax.status !== "PAID" && (
            <Button
              onClick={() => setIsCollectModalOpen(true)}
              className="flex-1 md:flex-none h-12 px-8 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 shadow-glow transition-all active:scale-[0.98] border-none"
            >
              <Banknote className="w-4 h-4 mr-2" /> ট্যাক্স সংগ্রহ করুন
            </Button>
          )}
          <Link href={`/holding-tax/records/${tax?.id}/receipt`}>
            <Button
              disabled={tax?.status !== "PAID"}
              variant="outline"
              className="flex-1 md:flex-none h-12 px-8 rounded-2xl font-black border-outline/10 hover:bg-surface-container transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Printer className="w-4 h-4 mr-2" /> রশিদ প্রিন্ট
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tax Information */}
          <SectionCard
            icon={<Calculator className="w-5 h-5 text-primary" />}
            title="ট্যাক্স ও আর্থিক বিবরণ"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-6">
                <InfoItem
                  label="ধার্যকৃত মোট ট্যাক্স"
                  value={`৳${enToBnNumber(tax?.totalAmount ?? 0)}`}
                  bold
                  className="text-2xl text-on-surface"
                />
                <InfoItem
                  label="পরিশোধিত টাকা"
                  value={`৳${enToBnNumber(tax?.paidAmount ?? 0)}`}
                  className="text-emerald-600"
                />
                <InfoItem
                  label="বকেয়া টাকা"
                  value={`৳${enToBnNumber(tax?.dueAmount ?? 0)}`}
                  className="text-rose-600"
                  bold
                />
              </div>

              <div className="space-y-6">
                <InfoItem
                  label="বার্ষিক মূল্যায়ন"
                  value={`৳${enToBnNumber(tax.assessment?.annualValuation)}`}
                />
                <InfoItem
                  label="ট্যাক্স হার (%)"
                  value={`${enToBnNumber(tax.assessment?.taxRatePercent)}%`}
                />
                <InfoItem
                  label="ট্যাক্স আইডি"
                  value={tax?.id?.slice(0, 8).toUpperCase() ?? "—"}
                  className="font-mono"
                />
              </div>

              <div className="h-px bg-outline/5 sm:col-span-2" />

              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <InfoItem
                  label="সর্বশেষ পেমেন্টের তারিখ"
                  value={tax?.paidAt ? enToBnNumber(format(new Date(tax.paidAt), "dd MMMM yyyy", { locale: bn })) : "প্রযোজ্য নয়"}
                />
                <InfoItem
                  label="সংগ্রহ করেছেন"
                  value={tax.collectedByName || "প্রযোজ্য নয়"}
                />
              </div>
            </div>
          </SectionCard>

          {/* Holding & Owner Information */}
          <SectionCard
            icon={<UserCircle className="w-5 h-5 text-emerald-600" />}
            title="মালিক ও হোল্ডিং তথ্য"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 border-b border-emerald-100 pb-2">মালিকের তথ্য</h4>
                <div className="grid grid-cols-1 gap-6">
                  <InfoItem label="মালিকের নাম" value={tax.assessment?.fullNameBn} bold />
                  <InfoItem label="পিতার নাম" value={tax.assessment?.fatherNameBn} />
                  <InfoItem label="মোবাইল নম্বর" value={tax.assessment?.mobile ? enToBnNumber(tax.assessment?.mobile) : "—"} />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2">হোল্ডিং ঠিকানা</h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="ওয়ার্ড নং" value={enToBnNumber(tax.assessment?.wardNo)} />
                    <InfoItem label="হোল্ডিং নং" value={enToBnNumber(tax.assessment?.holdingNo)} />
                  </div>
                  <InfoItem label="গ্রাম/মহল্লা" value={tax.assessment?.villageBn} />
                  <InfoItem label="উপজেলা" value={tax.assessment?.upazilaBn} />
                  <InfoItem label="জেলা" value={tax.assessment?.districtBn} />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar area */}
        <div className="space-y-8">
          {/* Assessment Summary */}
          <SectionCard
            icon={<FileText className="w-5 h-5 text-amber-600" />}
            title="এসেসমেন্ট সারসংক্ষেপ"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="পুরুষ সদস্য" value={enToBnNumber(tax.assessment?.maleCount)} />
                <InfoItem label="মহিলা সদস্য" value={enToBnNumber(tax.assessment?.femaleCount)} />
              </div>
              <InfoItem label="বাসিন্দার ধরণ" value={tax.assessment?.residentType || "—"} />

              <div className="h-px bg-outline/5" />

              <div className="space-y-4">
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider opacity-60">গৃহের ধরণ</span>
                <div className="flex flex-wrap gap-2">
                  {(tax.assessment?.pakaBuildingCount ?? 0) > 0 && <Badge variant="secondary" className="rounded-lg">পাকা ({enToBnNumber(tax.assessment?.pakaBuildingCount ?? 0)})</Badge>}
                  {(tax.assessment?.semiPakaBuildingCount ?? 0) > 0 && <Badge variant="secondary" className="rounded-lg">আধা-পাকা ({enToBnNumber(tax.assessment?.semiPakaBuildingCount ?? 0)})</Badge>}
                  {(tax.assessment?.tinShedCount ?? 0) > 0 && <Badge variant="secondary" className="rounded-lg">টিনশেড ({enToBnNumber(tax.assessment?.tinShedCount ?? 0)})</Badge>}
                  {(tax.assessment?.kachaHouseCount ?? 0) > 0 && <Badge variant="secondary" className="rounded-lg">কাঁচা ঘর ({enToBnNumber(tax.assessment?.kachaHouseCount ?? 0)})</Badge>}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* System Info */}
          <div className="bg-gradient-to-br from-primary/5 to-primary-container/5 rounded-[32px] p-8 border border-primary/10">
            <div className="flex items-center gap-3 mb-6 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-tight">সিস্টেম অডিট</span>
            </div>
            <div className="space-y-4">
              <AuditItem
                label="রেকর্ড তৈরি"
                value={enToBnNumber(format(new Date(tax?.createdAt ?? new Date()), "dd MMM, yyyy", { locale: bn }))}
              />
              <AuditItem
                label="শেষ আপডেট"
                value={enToBnNumber(format(new Date(tax?.updatedAt ?? new Date()), "dd MMM, yyyy", { locale: bn }))}
              />
              <AuditItem
                label="এসেসমেন্ট আইডি"
                value={tax?.assessmentId?.slice(0, 8).toUpperCase() ?? "—"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CollectTaxModal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        taxRecord={tax}
      />
    </div>
  );
};

const SectionCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-black text-on-surface tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoItem = ({ label, value, bold = false, icon, className }: { label: string, value?: string | number | null, bold?: boolean, icon?: React.ReactNode, className?: string }) => (
  <div className="space-y-1 group">
    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
      {label}
    </span>
    <div className="flex items-center gap-2">
      {icon}
      <span className={cn(
        "text-sm tracking-tight transition-colors",
        bold ? "font-black" : "font-bold",
        "text-on-surface",
        className
      )}>
        {value || "—"}
      </span>
    </div>
  </div>
);

const AuditItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center gap-4">
    <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{label}</span>
    <span className="text-[11px] font-black text-primary/80">{value}</span>
  </div>
);
