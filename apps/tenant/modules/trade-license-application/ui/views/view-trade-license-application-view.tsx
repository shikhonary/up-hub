"use client";

import React, { useState } from "react";
import { useTradeLicenseApplicationById, useDeleteTradeLicenseApplication, useUpdateTradeLicenseApplicationStatus } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Clock,
  Briefcase,
  Calendar,
  CheckCircle2,
  Edit,
  MapPin,
  ShieldCheck,
  Trash2,
  XCircle,
  Building2,
  Fingerprint,
  FileText,
  Printer,
  Scale,
  Phone,
  ClipboardList,
  Mail,
  Banknote,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@workspace/ui/lib/utils";
import { enToBnNumber } from "@workspace/utils";
import Link from "next/link";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { useRouter } from "next/navigation";
import { GenerateTradeLicenseModal } from "../components/generate-trade-license-modal";
import { RejectTradeLicenseApplicationModal } from "../components/reject-trade-license-application-modal";
import { CollectPaymentModal } from "../components/collect-payment-modal";

interface ViewTradeLicenseApplicationViewProps {
  id: string;
}

export const ViewTradeLicenseApplicationView = ({ id }: ViewTradeLicenseApplicationViewProps) => {
  const router = useRouter();
  const { data: application, isLoading } = useTradeLicenseApplicationById(id);
  const { mutateAsync: deleteApplication } = useDeleteTradeLicenseApplication();
  const { mutateAsync: updateStatus } = useUpdateTradeLicenseApplicationStatus();
  const { openDeleteModal } = useDeleteModal();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCollectPaymentModalOpen, setIsCollectPaymentModalOpen] = useState(false);



  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-black text-[10px] uppercase tracking-widest gap-1.5 px-3 py-1.5 rounded-xl shadow-sm">
            <Clock className="w-3.5 h-3.5" /> অপেক্ষমান
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] uppercase tracking-widest gap-1.5 px-3 py-1.5 rounded-xl shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> অনুমোদিত
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-black text-[10px] uppercase tracking-widest gap-1.5 px-3 py-1.5 rounded-xl shadow-sm">
            <XCircle className="w-3.5 h-3.5" /> বাতিলকৃত
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-50 text-slate-600 border-slate-100 font-black text-[10px] uppercase tracking-widest gap-1.5 px-3 py-1.5 rounded-xl shadow-sm">
            {status}
          </Badge>
        );
    }
  };

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

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <XCircle className="w-16 h-16 text-rose-500/20 mb-4" />
        <h3 className="text-xl font-black text-on-surface tracking-tight">আবেদন পাওয়া যায়নি</h3>
        <p className="text-on-surface-variant/60 max-w-xs mx-auto mt-2">আপনি যে আবেদনটি খুঁজছেন তা সিস্টেমে বিদ্যমান নেই অথবা মুছে ফেলা হয়েছে।</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-8 pb-20 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      {/* 1. Enhanced Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 bg-white/40 backdrop-blur-md p-8 rounded-[40px] border border-white/20 shadow-ambient relative group transition-all duration-500 hover:shadow-glow/5">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white shadow-glow relative z-10 group-hover:scale-105 transition-transform duration-500">
              <Briefcase className="w-12 h-12" />
            </div>
            <div className="absolute -inset-2 bg-primary/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">ট্রেড লাইসেন্স আবেদনপত্র</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight drop-shadow-sm">
                {application.orgNameBn}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                <Fingerprint className="w-3.5 h-3.5" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  ট্র্যাকিং নং: <span className="text-slate-600 font-black">{enToBnNumber(application.trackingId || application.id.slice(0, 10).toUpperCase())}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 bg-slate-100/50 px-4 py-2 rounded-2xl border border-slate-200/50">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                  {application.tradeLicenseCategory?.typeBn}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100/50 px-4 py-2 rounded-2xl border border-slate-200/50">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                  ওয়ার্ড {enToBnNumber(application.businessWardNo)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              {getStatusBadge(application.status)}
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">{application.fiscalYear?.nameBn}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <Link href={`/trade-license/applications/view/${id}/print`} className="flex-1 lg:flex-none">
            <Button
              variant="outline"
              className="w-full h-14 px-8 rounded-2xl border-2 border-slate-200 text-slate-600 font-black hover:bg-slate-50 transition-all active:scale-95 gap-3"
            >
              <Printer className="w-5 h-5" /> প্রিন্ট করুন
            </Button>
          </Link>

          {application.status === "APPROVED" && application.tradeLicense?.paymentStatus === "UNPAID" && (
            <Button
              onClick={() => setIsCollectPaymentModalOpen(true)}
              className="flex-1 h-14 px-8 rounded-2xl bg-amber-500 text-white font-black hover:bg-amber-600 shadow-lg shadow-amber-100 transition-all active:scale-95 gap-3 border-none"
            >
              <Banknote className="w-5 h-5" /> পেমেন্ট সংগ্রহ
            </Button>
          )}
          
          {application.status === "APPROVED" && application.tradeLicense?.paymentStatus === "PAID" && (
            <div className="flex items-center gap-4 flex-1 lg:flex-none">
              <Link href={`/trade-license/applications/view/${id}/invoice`} className="flex-1 lg:flex-none">
                <Button
                  className="w-full h-14 px-8 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 gap-3 border-none"
                >
                  <FileText className="w-5 h-5" /> ইনভয়েস প্রিন্ট
                </Button>
              </Link>
              <Link href={`/trade-license/applications/view/${id}/certificate`} className="flex-1 lg:flex-none">
                <Button
                  className="w-full h-14 px-8 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 shadow-glow transition-all active:scale-95 gap-3 border-none"
                >
                  <ShieldCheck className="w-5 h-5" /> সনদ প্রিন্ট করুন
                </Button>
              </Link>
            </div>
          )}

          {application.status === "PENDING" && (
            <div className="flex items-center gap-3 flex-1 lg:flex-none">
              <Button
                onClick={() => setIsGenerateModalOpen(true)}
                className="flex-1 h-14 px-10 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 shadow-glow transition-all active:scale-95 border-none gap-3"
              >
                <CheckCircle2 className="w-5 h-5" /> অনুমোদন করুন
              </Button>
              <Button
                variant="outline"
                onClick={handleReject}
                className="flex-1 h-14 px-8 rounded-2xl border-2 border-rose-100 text-rose-500 font-black hover:bg-rose-50 transition-all active:scale-95 gap-3"
              >
                <XCircle className="w-5 h-5" /> বাতিল করুন
              </Button>
            </div>
          )}
        </div>
      </div>

      <GenerateTradeLicenseModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        application={application}
      />

      <RejectTradeLicenseApplicationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        application={application}
      />

      <CollectPaymentModal
        isOpen={isCollectPaymentModalOpen}
        onClose={() => setIsCollectPaymentModalOpen(false)}
        application={application}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">

          {/* Organization & Ownership Section */}
          <SectionCard
            icon={<Building2 className="w-6 h-6 text-primary" />}
            title="প্রতিষ্ঠানের তথ্য"
            subtitle="প্রতিষ্ঠানের নাম, মালিকানা ও ব্যবসার ধরন"
            className="bg-white/60 backdrop-blur-sm border-primary/10 shadow-primary/5 overflow-hidden group"
          >
            {/* Decorative side bar */}
            <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-10">
                <InfoItem label="প্রতিষ্ঠানের নাম (বাংলা)" value={application.orgNameBn} bold className="text-xl" />
                <InfoItem label="প্রতিষ্ঠানের নাম (ইংরেজি)" value={application.orgNameEn} className="text-lg opacity-80" />
                <InfoItem label="মালিকানার ধরন" value={application.ownershipTypeBn} bold icon={<Scale className="w-4 h-4 text-primary/40" />} />
              </div>

              <div className="space-y-10 bg-slate-50/50 p-8 rounded-[32px] border border-slate-100">
                <InfoItem label="ব্যবসার ধরন (ক্যাটাগরি)" value={application.tradeLicenseCategory?.typeBn} bold className="text-primary" />
                <div className="h-px bg-slate-200/50 w-full" />
                <div className="grid grid-cols-1 gap-6">
                  <InfoRowItem label="TIN নম্বর" value={enToBnNumber(application.tinBn)} />
                  <InfoRowItem label="BIN নম্বর" value={enToBnNumber(application.binBn)} />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Owner Identity Section */}
          <SectionCard
            icon={<User className="w-6 h-6 text-indigo-600" />}
            title="মালিকের বিস্তারিত তথ্য"
            subtitle="পরিচয়, পরিচয়পত্র ও যোগাযোগ তথ্য"
            className="bg-white/60 backdrop-blur-sm group"
          >
            <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              <div className="space-y-8">
                <InfoItem label="মালিকের নাম (বাংলা)" value={application.fullNameBn} bold className="text-lg" />
                <InfoItem label="মালিকের নাম (ইংরেজি)" value={application.fullNameEn} className="opacity-70" />
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="পিতার নাম" value={application.fatherNameBn} />
                  <InfoItem label="মাতার নাম" value={application.motherNameBn} />
                </div>
              </div>

              <div className="space-y-8 bg-indigo-50/30 p-8 rounded-[32px] border border-indigo-100/50">
                <div className="grid grid-cols-1 gap-6">
                  <InfoRowItem label="এনআইডি নম্বর" value={enToBnNumber(application.nidBn)} bold icon={<Fingerprint className="w-4 h-4 text-indigo-400" />} />
                  <InfoRowItem label="মোবাইল নম্বর" value={enToBnNumber(application.mobileBn)} bold icon={<Phone className="w-4 h-4 text-indigo-400" />} />
                  <InfoRowItem label="জন্ম নিবন্ধন নং" value={enToBnNumber(application.birthRegistrationBn)} />
                  <InfoRowItem label="পাসপোর্ট নং" value={enToBnNumber(application.passportBn)} />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Business Details Section */}
          <SectionCard
            icon={<ClipboardList className="w-6 h-6 text-amber-600" />}
            title="ব্যবসার বিস্তারিত তথ্য"
            subtitle="মূলধন, সাইনবোর্ড ও অপারেশনাল তথ্য"
            className="bg-white/60 backdrop-blur-sm group"
          >
            <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="grid grid-cols-2 gap-6 bg-gradient-to-br from-amber-500 to-amber-600 p-8 rounded-[32px] text-white shadow-glow/20">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">পরিশোধিত মূলধন</span>
                  <p className="text-3xl font-black tracking-tight">৳{enToBnNumber(application.paidUpCapital)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">সাইনবোর্ড সাইজ</span>
                  <p className="text-3xl font-black tracking-tight">{enToBnNumber(application.signboardSize)} <span className="text-xs font-bold opacity-60 ml-1">SQFT</span></p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-6">
                  <InfoItem label="VAT আইডি" value={enToBnNumber(application.vatIdBn)} />
                  <InfoItem label="ট্যাক্স আইডি" value={enToBnNumber(application.taxIdBn)} />
                </div>
                <div className="h-px bg-slate-100 w-full" />
                <div className="grid grid-cols-1 gap-6">
                  <InfoRowItem label="ব্যবসা শুরুর তারিখ" value={application.businessStartDate ? enToBnNumber(format(new Date(application.businessStartDate), "dd MMMM yyyy", { locale: bn })) : "—"} icon={<Calendar className="w-4 h-4 text-amber-500/40" />} />
                  <InfoRowItem label="মালিকানার স্ট্যাটাস" value={application.ownershipStatusBn} />
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-50/80 p-8 rounded-[32px] border border-slate-200/50 flex flex-col md:flex-row justify-between gap-8">
                <InfoItem label="আবেদনকারীর নাম" value={application.applicantNameBn} bold className="text-lg" icon={<User className="w-5 h-5 text-slate-400" />} />
                <InfoItem label="ইমেইল এড্রেস" value={application.email} icon={<Mail className="w-5 h-5 text-slate-400" />} />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar area */}
        <div className="lg:col-span-4 space-y-10">
          {/* Address Information */}
          <div className="bg-white/80 backdrop-blur-md rounded-[40px] p-8 shadow-ambient border border-white/20 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/40 group-hover:bg-primary transition-colors" />

            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">ঠিকানা তথ্য</h3>
            </div>

            <div className="space-y-12">
              <AddressSection
                title="বর্তমান ঠিকানা"
                color="text-primary"
                dotColor="bg-primary"
                village={application.presentVillageBn}
                ward={application.presentWardNo}
                post={application.presentPostOfficeBn}
              />

              <div className="h-px bg-slate-100" />

              <AddressSection
                title="স্থায়ী ঠিকানা"
                color="text-emerald-600"
                dotColor="bg-emerald-600"
                village={application.permanentVillageBn}
                ward={application.permanentWardNo}
                post={application.permanentPostOfficeBn}
              />

              <div className="h-px bg-slate-100" />

              <AddressSection
                title="ব্যবসায়িক ঠিকানা"
                color="text-amber-600"
                dotColor="bg-amber-600"
                village={application.businessVillageBn}
                ward={application.businessWardNo}
                post={application.businessPostOfficeBn}
              />
            </div>
          </div>

          {/* System & Audit Info */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary shadow-glow">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Security & Logs</span>
                <h3 className="text-xl font-black tracking-tight">সিস্টেম অডিট</h3>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <AuditItem
                label="আবেদনের তারিখ"
                value={enToBnNumber(format(new Date(application.createdAt), "dd MMM, yyyy", { locale: bn }))}
              />
              <div className="h-px bg-white/5" />
              <AuditItem
                label="আবেদন আইডি"
                value={id.slice(0, 8).toUpperCase()}
                className="font-mono text-primary"
              />
              <div className="h-px bg-white/5" />
              <AuditItem
                label="অর্থবছর"
                value={application.fiscalYear?.nameBn || "—"}
              />
              <div className="h-px bg-white/5" />
              <div className="flex items-center gap-3 pt-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Verified Document</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ icon, title, subtitle, children, className }: { icon: React.ReactNode, title: string, subtitle?: string, children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-[40px] p-10 shadow-ambient border border-slate-100 relative", className)}>
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
          {subtitle && <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const InfoItem = ({ label, value, bold = false, icon, className }: { label: string, value?: string | number | null, bold?: boolean, icon?: React.ReactNode, className?: string }) => (
  <div className="space-y-3 group">
    <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
        {label}
      </span>
    </div>
    <div className={cn(
      "text-slate-700 tracking-tight font-bold transition-all group-hover:translate-x-1 duration-300",
      bold && "text-slate-900 font-black",
      className
    )}>
      {value || "—"}
    </div>
  </div>
);

const InfoRowItem = ({ label, value, bold = false, icon }: { label: string, value?: string | number | null, bold?: boolean, icon?: React.ReactNode }) => (
  <div className="flex justify-between items-center gap-4 group">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs font-bold text-slate-400">{label}</span>
    </div>
    <span className={cn("text-sm font-black text-slate-700 transition-colors group-hover:text-primary", bold && "text-primary")}>
      {value || "—"}
    </span>
  </div>
);

const AddressSection = ({ title, color, dotColor, village, ward, post }: { title: string, color: string, dotColor: string, village?: string, ward?: number, post?: string }) => (
  <div className="space-y-6 group">
    <h4 className={cn("text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3", color)}>
      <div className={cn("w-2 h-2 rounded-full", dotColor, "group-hover:scale-150 transition-transform duration-300")} />
      {title}
    </h4>
    <div className="grid grid-cols-1 gap-5 pl-5 border-l border-slate-100">
      <div className="space-y-1">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">গ্রাম/মহল্লা</span>
        <p className="text-sm font-black text-slate-700">{village || "—"}</p>
      </div>
      <div className="flex items-center gap-10">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ওয়ার্ড</span>
          <p className="text-sm font-black text-slate-700">{enToBnNumber(ward)}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ডাকঘর</span>
          <p className="text-sm font-black text-slate-700">{post || "—"}</p>
        </div>
      </div>
    </div>
  </div>
);

const AuditItem = ({ label, value, className }: { label: string, value: string, className?: string }) => (
  <div className="flex justify-between items-center gap-4 group">
    <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest group-hover:text-white/60 transition-colors">{label}</span>
    <span className={cn("text-xs font-black text-white/80 transition-all group-hover:translate-x-[-4px]", className)}>{value}</span>
  </div>
);

