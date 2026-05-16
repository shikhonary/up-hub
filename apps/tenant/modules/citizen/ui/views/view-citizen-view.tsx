"use client";

import { useCitizenById } from "@workspace/api-client";
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
  Edit,
  Info,
  Globe,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@workspace/ui/lib/utils";
import { enToBnNumber } from "@workspace/utils";
import Link from "next/link";

interface ViewCitizenViewProps {
  id: string;
}

export const ViewCitizenView = ({ id }: ViewCitizenViewProps) => {
  const { data: citizen, isLoading } = useCitizenById(id);

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

  if (!citizen) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <XCircle className="w-16 h-16 text-rose-500/20 mb-4" />
        <h3 className="text-xl font-black text-slate-900 tracking-tight">নাগরিকের তথ্য পাওয়া যায়নি</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">আপনি যে নাগরিকের তথ্য খুঁজছেন তা সিস্টেমে বিদ্যমান নেই অথবা মুছে ফেলা হয়েছে।</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-outline/5 pb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-[28px] bg-emerald-600/10 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-600/20">
            <UserCheck className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tighter leading-none mb-2">
              {citizen.fullNameBn}
            </h2>
            <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-primary/40" />
                <p className="text-sm font-bold text-primary/60 uppercase tracking-[0.1em]">
                    {citizen.fullNameEn || "N/A"}
                </p>
            </div>
            <div className="mt-4">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1.5 px-3 rounded-xl font-bold text-xs shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> নিবন্ধিত নাগরিক
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href={`/citizens/edit/${id}`} className="flex-1 md:flex-none">
            <Button
              className="w-full h-12 px-8 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 shadow-glow transition-all active:scale-[0.98] border-none"
            >
              <Edit className="w-4 h-4 mr-2" /> তথ্য এডিট করুন
            </Button>
          </Link>
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
              <InfoItem label="এনআইডি নম্বর" value={enToBnNumber(citizen.nid)} bold />
              <InfoItem label="জন্ম তারিখ" value={citizen.dateOfBirth ? enToBnNumber(format(new Date(citizen.dateOfBirth), "dd MMMM yyyy", { locale: bn })) : "—"} />
              
              <div className="space-y-4">
                <InfoItem label="পিতার নাম (বাংলা)" value={citizen.fatherNameBn} />
                <InfoItem label="Father's Name (En)" value={citizen.fatherNameEn} isEnglish />
              </div>
              
              <div className="space-y-4">
                <InfoItem label="মাতার নাম (বাংলা)" value={citizen.motherNameBn} />
                <InfoItem label="Mother's Name (En)" value={citizen.motherNameEn} isEnglish />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="লিঙ্গ" value={citizen.genderBn} />
                <InfoItem label="ধর্ম" value={citizen.religionBn} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="বৈবাহিক অবস্থা" value={citizen.maritalStatusBn} />
                <InfoItem label="পেশা (বাংলা)" value={citizen.occupationBn} />
              </div>

              <div className="h-px bg-outline/5 sm:col-span-2" />

              <InfoItem label="জন্ম নিবন্ধন নম্বর" value={enToBnNumber(citizen.birthRegistrationNo)} />
              <InfoItem label="পাসপোর্ট নম্বর" value={enToBnNumber(citizen.passportNo)} />
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
                    <InfoItem label="ওয়ার্ড নং" value={enToBnNumber(citizen.presentWardNo)} />
                    <InfoItem label="হোল্ডিং নং" value={enToBnNumber(citizen.presentHoldingNo)} />
                  </div>
                  <InfoItem label="গ্রাম (বাংলা)" value={citizen.presentVillageBn} />
                  <InfoItem label="Village (En)" value={citizen.presentVillageEn} isEnglish />
                  <InfoItem label="ডাকঘর (বাংলা)" value={citizen.presentPostOfficeBn} />
                  <InfoItem label="উপজেলা (বাংলা)" value={citizen.presentUpazilaBn} />
                  <InfoItem label="জেলা (বাংলা)" value={citizen.presentDistrictBn} />
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2">স্থায়ী ঠিকানা</h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="ওয়ার্ড নং" value={enToBnNumber(citizen.permanentWardNo)} />
                    <InfoItem label="হোল্ডিং নং" value={enToBnNumber(citizen.permanentHoldingNo)} />
                  </div>
                  <InfoItem label="গ্রাম (বাংলা)" value={citizen.permanentVillageBn} />
                  <InfoItem label="Village (En)" value={citizen.permanentVillageEn} isEnglish />
                  <InfoItem label="ডাকঘর (বাংলা)" value={citizen.permanentPostOfficeBn} />
                  <InfoItem label="উপজেলা (বাংলা)" value={citizen.permanentUpazilaBn} />
                  <InfoItem label="জেলা (বাংলা)" value={citizen.permanentDistrictBn} />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar area */}
        <div className="space-y-8">
          {/* Contact Info */}
          <SectionCard 
            icon={<Phone className="w-5 h-5 text-amber-600" />} 
            title="যোগাযোগের তথ্য"
          >
            <div className="space-y-6">
              <InfoItem 
                label="মোবাইল নম্বর" 
                value={enToBnNumber(citizen.mobile)} 
                bold 
                icon={<Phone className="w-3.5 h-3.5 text-on-surface-variant/40" />} 
              />
              <InfoItem 
                label="ইমেইল ঠিকানা" 
                value={citizen.email} 
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
              <InfoItem label="শিক্ষাগত যোগ্যতা" value={citizen.educationalQualificationBn} />
              <InfoItem label="অবস্থানের ধরণ" value={citizen.residentStatusBn} />
              
              <div className="h-px bg-outline/5" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-primary/40" />
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider opacity-60">মন্তব্য</span>
                </div>
                <div className="space-y-4">
                    <p className="text-xs font-bold text-on-surface leading-relaxed p-4 bg-surface-container-low rounded-2xl border border-outline/5">
                        <span className="block text-[9px] uppercase tracking-widest opacity-40 mb-1">BENGALI</span>
                        {citizen.commentsBn || "কোনো মন্তব্য নেই।"}
                    </p>
                    {citizen.commentsEn && (
                        <p className="text-xs font-bold text-primary leading-relaxed p-4 bg-primary/[0.02] rounded-2xl border border-primary/10">
                            <span className="block text-[9px] uppercase tracking-widest opacity-40 mb-1">ENGLISH</span>
                            {citizen.commentsEn}
                        </p>
                    )}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* System Info */}
          <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 rounded-[32px] p-8 border border-emerald-500/10">
            <div className="flex items-center gap-3 mb-6 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-tight">সিস্টেম স্ট্যাটাস</span>
            </div>
            <div className="space-y-4">
              <AuditItem 
                label="নিবন্ধনের তারিখ" 
                value={enToBnNumber(format(new Date(citizen.createdAt), "dd MMM, yyyy · hh:mm a", { locale: bn }))} 
              />
              <AuditItem 
                label="শেষ ভেরিফাইড" 
                value={enToBnNumber(format(new Date(citizen.updatedAt), "dd MMM, yyyy · hh:mm a", { locale: bn }))} 
              />
              <AuditItem 
                label="নাগরিক আইডি" 
                value={id.slice(0, 8).toUpperCase()} 
              />
              <AuditItem 
                label="অ্যাকাউন্ট অবস্থা" 
                value={citizen.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"} 
              />
            </div>
          </div>
        </div>
      </div>
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
    <span className="text-[11px] font-black text-emerald-700/80">{value}</span>
  </div>
);
