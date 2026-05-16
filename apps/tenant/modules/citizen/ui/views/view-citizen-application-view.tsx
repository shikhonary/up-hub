"use client";

import { useCitizenApplicationById, useApproveCitizenApplication, useRejectCitizenApplication } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Fingerprint,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  ShieldCheck,
  Info,
  Globe,
  MessageSquare,
  Printer
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@workspace/ui/lib/utils";
import { enToBnNumber } from "@workspace/utils";

import { useApproveCitizenModal } from "@workspace/ui/hooks/use-approve-citizen-modal";
import { useRejectCitizenModal } from "@workspace/ui/hooks/use-reject-citizen-modal";
import { ApproveCitizenModal } from "../components/desktop/modal/approve-modal";
import { RejectCitizenModal } from "../components/desktop/modal/reject-modal";

interface ViewCitizenApplicationViewProps {
  id: string;
}

export const ViewCitizenApplicationView = ({ id }: ViewCitizenApplicationViewProps) => {
  const { data: application, isLoading } = useCitizenApplicationById(id);
  const approveMutation = useApproveCitizenApplication();
  const rejectMutation = useRejectCitizenApplication();
  const { openApproveModal } = useApproveCitizenModal();
  const { openRejectModal } = useRejectCitizenModal();

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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <XCircle className="w-16 h-16 text-rose-500/20 mb-4" />
        <h3 className="text-xl font-black text-slate-900 tracking-tight">আবেদনটি খুঁজে পাওয়া যায়নি</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">আপনি যে আবেদনটি খুঁজছেন তা বিদ্যমান নেই অথবা মুছে ফেলা হয়েছে।</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 py-1.5 px-3 rounded-xl font-bold text-xs shadow-sm">
            <Clock className="w-3.5 h-3.5" /> পেন্ডিং
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1.5 px-3 rounded-xl font-bold text-xs shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> অনুমোদিত
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1.5 py-1.5 px-3 rounded-xl font-bold text-xs shadow-sm">
            <XCircle className="w-3.5 h-3.5" /> প্রত্যাখ্যাত
          </Badge>
        );
      default:
        return <Badge variant="outline" className="rounded-xl font-bold">{status}</Badge>;
    }
  };

  const handleApprove = () => {
    if (application) {
      openApproveModal({
        applicationId: id,
        applicantName: application.fullNameBn,
        onConfirm: async (id) => {
          await approveMutation.mutateAsync(id);
        },
      });
    }
  };

  const handleReject = () => {
    if (application) {
      openRejectModal({
        applicationId: id,
        applicantName: application.fullNameBn,
        onConfirm: async (id) => {
          await rejectMutation.mutateAsync(id);
        },
      });
    }
  };

  return (
    <div className="space-y-8 p-8 pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-outline/5 pb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-[28px] bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <UserCheck className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tighter leading-none mb-2">
              {application.fullNameBn}
            </h2>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-primary/40" />
              <p className="text-sm font-bold text-primary/60 uppercase tracking-[0.1em]">
                {application.fullNameEn || "N/A"}
              </p>
            </div>
            <div className="mt-4">
              {getStatusBadge(application.status)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href={`/citizens/applications/view/${id}/print`}>
            <Button
              variant="outline"
              className="flex-1 md:flex-none h-12 px-6 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              <Printer className="w-4 h-4 mr-2" /> আবেদন ফরম ডাউনলোড
            </Button>
          </Link>

          {(application.status === "PENDING" || application.status === "REJECTED") && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              {application.status === "PENDING" && (
                <Button
                  variant="outline"
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                  className="flex-1 md:flex-none h-12 px-6 rounded-2xl border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition-all active:scale-[0.98]"
                >
                  <XCircle className="w-4 h-4 mr-2" /> প্রত্যাখ্যান করুন
                </Button>
              )}
              <Button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="flex-1 md:flex-none h-12 px-8 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 shadow-glow transition-all active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> অনুমোদন করুন
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Section */}
          <SectionCard
            icon={<Fingerprint className="w-5 h-5 text-primary" />}
            title="ব্যক্তিগত ও পরিচয় তথ্য"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
              <InfoItem label="এনআইডি নম্বর" value={enToBnNumber(application.nid)} bold />
              <InfoItem label="জন্ম তারিখ" value={application.dateOfBirth ? enToBnNumber(format(new Date(application.dateOfBirth), "dd MMMM yyyy", { locale: bn })) : "—"} />

              <div className="space-y-4">
                <InfoItem label="পিতার নাম (বাংলা)" value={application.fatherNameBn} />
                <InfoItem label="Father's Name (En)" value={application.fatherNameEn} isEnglish />
              </div>

              <div className="space-y-4">
                <InfoItem label="মাতার নাম (বাংলা)" value={application.motherNameBn} />
                <InfoItem label="Mother's Name (En)" value={application.motherNameEn} isEnglish />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="লিঙ্গ" value={application.genderBn} />
                <InfoItem label="ধর্ম" value={application.religionBn} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="বৈবাহিক অবস্থা" value={application.maritalStatusBn} />
                <InfoItem label="পেশা (বাংলা)" value={application.occupationBn} />
              </div>

              <div className="h-px bg-outline/5 sm:col-span-2" />

              <InfoItem label="জন্ম নিবন্ধন নম্বর" value={enToBnNumber(application.birthRegistrationNo)} />
              <InfoItem label="পাসপোর্ট নম্বর" value={enToBnNumber(application.passportNo)} />
            </div>
          </SectionCard>

          {/* Address Section */}
          <SectionCard
            icon={<MapPin className="w-5 h-5 text-emerald-600" />}
            title="আবাসিক ঠিকানা"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 border-b border-emerald-100 pb-2">বর্তমান ঠিকানা</h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="ওয়ার্ড নং" value={enToBnNumber(application.presentWardNo)} />
                    <InfoItem label="হোল্ডিং নং" value={enToBnNumber(application.presentHoldingNo)} />
                  </div>
                  <InfoItem label="গ্রাম (বাংলা)" value={application.presentVillageBn} />
                  <InfoItem label="Village (En)" value={application.presentVillageEn} isEnglish />
                  <InfoItem label="ডাকঘর (বাংলা)" value={application.presentPostOfficeBn} />
                  <InfoItem label="উপজেলা (বাংলা)" value={application.presentUpazilaBn} />
                  <InfoItem label="জেলা (বাংলা)" value={application.presentDistrictBn} />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2">স্থায়ী ঠিকানা</h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="ওয়ার্ড নং" value={enToBnNumber(application.permanentWardNo)} />
                    <InfoItem label="হোল্ডিং নং" value={enToBnNumber(application.permanentHoldingNo)} />
                  </div>
                  <InfoItem label="গ্রাম (বাংলা)" value={application.permanentVillageBn} />
                  <InfoItem label="Village (En)" value={application.permanentVillageEn} isEnglish />
                  <InfoItem label="ডাকঘর (বাংলা)" value={application.permanentPostOfficeBn} />
                  <InfoItem label="উপজেলা (বাংলা)" value={application.permanentUpazilaBn} />
                  <InfoItem label="জেলা (বাংলা)" value={application.permanentDistrictBn} />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar Sidebar area */}
        <div className="space-y-8">
          {/* Contact Info */}
          <SectionCard
            icon={<Phone className="w-5 h-5 text-amber-600" />}
            title="যোগাযোগের তথ্য"
          >
            <div className="space-y-6">
              <InfoItem
                label="মোবাইল নম্বর"
                value={enToBnNumber(application.mobile)}
                bold
                icon={<Phone className="w-3.5 h-3.5 text-on-surface-variant/40" />}
              />
              <InfoItem
                label="ইমেইল ঠিকানা"
                value={application.email}
                icon={<Mail className="w-3.5 h-3.5 text-on-surface-variant/40" />}
              />
            </div>
          </SectionCard>

          {/* Additional Details */}
          <SectionCard
            icon={<Briefcase className="w-5 h-5 text-slate-600" />}
            title="অন্যান্য তথ্য"
          >
            <div className="space-y-6">
              <InfoItem label="শিক্ষাগত যোগ্যতা" value={application.educationalQualificationBn} />
              <InfoItem label="অবস্থানের ধরণ" value={application.residentStatusBn} />

              <div className="h-px bg-outline/5" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-primary/40" />
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider opacity-60">মন্তব্য</span>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-on-surface leading-relaxed p-4 bg-surface-container-low rounded-2xl border border-outline/5">
                    <span className="block text-[9px] uppercase tracking-widest opacity-40 mb-1">BENGALI</span>
                    {application.commentsBn || "কোনো মন্তব্য নেই।"}
                  </p>
                  {application.commentsEn && (
                    <p className="text-xs font-bold text-primary leading-relaxed p-4 bg-primary/[0.02] rounded-2xl border border-primary/10">
                      <span className="block text-[9px] uppercase tracking-widest opacity-40 mb-1">ENGLISH</span>
                      {application.commentsEn}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Audit Info */}
          <div className="bg-gradient-to-br from-primary/5 to-primary-container/5 rounded-[32px] p-8 border border-primary/10">
            <div className="flex items-center gap-3 mb-6 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-tight">অডিট লগ</span>
            </div>
            <div className="space-y-4">
              <AuditItem
                label="আবেদনের তারিখ"
                value={enToBnNumber(format(new Date(application.createdAt), "dd MMM, yyyy · hh:mm a", { locale: bn }))}
              />
              <AuditItem
                label="শেষ আপডেট"
                value={enToBnNumber(format(new Date(application.updatedAt), "dd MMM, yyyy · hh:mm a", { locale: bn }))}
              />
              <AuditItem
                label="আবেদন আইডি"
                value={id.slice(0, 8).toUpperCase()}
              />
            </div>
          </div>
        </div>
      </div>

      <ApproveCitizenModal />
      <RejectCitizenModal />
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

const InfoItem = ({ label, value, bold = false, icon, className, isEnglish = false }: { label: string, value?: string | number | null, bold?: boolean, icon?: React.ReactNode, className?: string, isEnglish?: boolean }) => (
  <div className="space-y-1 group">
    <span className={cn(
      "text-[10px] font-black uppercase tracking-widest opacity-60",
      isEnglish ? "text-primary/70" : "text-on-surface-variant"
    )}>
      {label}
    </span>
    <div className="flex items-center gap-2">
      {icon}
      <span className={cn(
        "text-sm tracking-tight transition-colors",
        bold ? "font-black" : "font-bold",
        isEnglish ? "text-primary/80" : "text-on-surface",
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
