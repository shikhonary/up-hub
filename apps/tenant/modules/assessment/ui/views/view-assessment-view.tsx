"use client";

import { useAssessmentById } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  User,
  MapPin,
  Phone,
  Calculator,
  Calendar,
  Fingerprint,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  Edit,
  ClipboardList,
  Home,
  Droplet,
  Zap,
  Heart,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@workspace/ui/lib/utils";
import { enToBnNumber } from "@workspace/utils";
import Link from "next/link";
import { useDeleteAssessment } from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { useRouter } from "next/navigation";

interface ViewAssessmentViewProps {
  id: string;
}

export const ViewAssessmentView = ({ id }: ViewAssessmentViewProps) => {
  const router = useRouter();
  const { data: assessment, isLoading } = useAssessmentById(id);
  const { mutateAsync: deleteAssessment } = useDeleteAssessment();
  const { openDeleteModal } = useDeleteModal();

  const handleDelete = () => {
    if (!assessment) return;
    openDeleteModal({
      entityId: id,
      entityType: "assessment",
      entityName: assessment.fullNameBn,
      onConfirm: async (id) => {
        await deleteAssessment(id);
        router.push("/holding-tax/assessments");
      },
    });
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

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <XCircle className="w-16 h-16 text-rose-500/20 mb-4" />
        <h3 className="text-xl font-black text-on-surface tracking-tight">এসেসমেন্ট পাওয়া যায়নি</h3>
        <p className="text-on-surface-variant/60 max-w-xs mx-auto mt-2">আপনি যে এসেসমেন্টটি খুঁজছেন তা সিস্টেমে বিদ্যমান নেই অথবা মুছে ফেলা হয়েছে।</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-outline/5 pb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-[28px] bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <ClipboardList className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tighter leading-none mb-2">
              {assessment.fullNameBn}
            </h2>
            <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <p className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">
                    হোল্ডিং নং: {enToBnNumber(assessment.holdingNo)} · ওয়ার্ড: {enToBnNumber(assessment.wardNo)}
                </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1.5 px-3 rounded-xl font-black text-xs shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> এসেসমেন্ট সম্পন্ন
              </Badge>
              {assessment.citizenId && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5 py-1.5 px-3 rounded-xl font-black text-xs shadow-sm">
                  <User className="w-3.5 h-3.5" /> নিবন্ধিত নাগরিক
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="h-12 px-6 rounded-2xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold transition-all active:scale-[0.98] border border-rose-100"
          >
            <Trash2 className="w-4 h-4 mr-2" /> ডিলিট করুন
          </Button>

          <Link href={`/holding-tax/assessments/edit/${id}`} className="flex-1 md:flex-none">
            <Button
              className="w-full h-12 px-8 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 shadow-glow transition-all active:scale-[0.98] border-none"
            >
              <Edit className="w-4 h-4 mr-2" /> তথ্য আপডেট করুন
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tax & Valuation Section (High Priority) */}
          <SectionCard 
            icon={<Calculator className="w-5 h-5 text-primary" />} 
            title="কর ও মূল্যায়ন তথ্য"
            className="bg-gradient-to-br from-primary/5 to-transparent border-primary/10 shadow-primary/5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">বার্ষিক মূল্যায়ন</span>
                <p className="text-2xl font-black text-on-surface tracking-tight">৳{enToBnNumber(assessment.annualValuation)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">ট্যাক্স রেট</span>
                <p className="text-2xl font-black text-emerald-600 tracking-tight">{enToBnNumber(assessment.taxRatePercent)}%</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">ধার্যকৃত মোট ট্যাক্স</span>
                <p className="text-3xl font-black text-primary tracking-tighter">৳{enToBnNumber(assessment.totalTax)}</p>
              </div>
            </div>
          </SectionCard>

          {/* Identity Section */}
          <SectionCard 
            icon={<Fingerprint className="w-5 h-5 text-on-surface-variant" />} 
            title="ব্যক্তিগত ও পরিচয় তথ্য"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
              <InfoItem label="এনআইডি নম্বর" value={enToBnNumber(assessment.nid)} bold />
              <InfoItem label="মোবাইল নম্বর" value={enToBnNumber(assessment.mobile)} bold />
              
              <InfoItem label="জন্ম তারিখ" value={assessment.dateOfBirth ? enToBnNumber(format(new Date(assessment.dateOfBirth), "dd MMMM yyyy", { locale: bn })) : "—"} />
              <InfoItem label="পেশা" value={assessment.occupationBn} />

              <div className="space-y-4">
                <InfoItem label="পিতার নাম" value={assessment.fatherNameBn} />
                <InfoItem label="মাতার নাম" value={assessment.motherNameBn} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="লিঙ্গ" value={assessment.genderBn} />
                <InfoItem label="বৈবাহিক অবস্থা" value={assessment.maritalStatusBn} />
              </div>

              <div className="h-px bg-outline/5 sm:col-span-2" />

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="জন্ম নিবন্ধন নং" value={enToBnNumber(assessment.birthRegistrationNo)} />
                <InfoItem label="পাসপোর্ট নং" value={enToBnNumber(assessment.passportNo)} />
              </div>
              <InfoItem label="ধর্ম" value={assessment.religionBn} />
            </div>
          </SectionCard>

          {/* Survey Data Section */}
          <SectionCard 
            icon={<ClipboardList className="w-5 h-5 text-amber-600" />} 
            title="খানা জরিপ ও অন্যান্য তথ্য"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
              <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline/5">
                <InfoItem label="পুরুষ সংখ্যা" value={enToBnNumber(assessment.maleCount)} bold />
                <InfoItem label="মহিলা সংখ্যা" value={enToBnNumber(assessment.femaleCount)} bold />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="শিশু সংখ্যা" value={enToBnNumber(assessment.childCount)} />
                <InfoItem label="প্রতিবন্ধী সংখ্যা" value={enToBnNumber(assessment.disabledCount)} />
              </div>

              <div className="h-px bg-outline/5 sm:col-span-2" />

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="উপার্জনক্ষম সদস্য" value={enToBnNumber(assessment.earningMembers)} />
                <InfoItem label="নির্ভরশীল সদস্য" value={enToBnNumber(assessment.dependentMembers)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="বেকার (SSC+)" value={enToBnNumber(assessment.jobSeekersSscPlus)} />
                <InfoItem label="উদ্যোক্তা আগ্রহী" value={enToBnNumber(assessment.entrepreneurSeekersSscPlus)} />
              </div>

              <div className="h-px bg-outline/5 sm:col-span-2" />

              <InfoItem label="বার্ষিক আয়ের উৎস" value={assessment.annualIncomeSource} />
              <InfoItem label="বার্ষিক আয়" value={assessment.annualIncome ? `৳${enToBnNumber(assessment.annualIncome)}` : "—"} />

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                 <FeatureBadge active={assessment.hasTubewell} label="টিউবওয়েল আছে" icon={<Droplet className="w-3.5 h-3.5" />} />
                 <FeatureBadge active={assessment.hasUtilities} label="বিদ্যুৎ/ইউটিলিটি আছে" icon={<Zap className="w-3.5 h-3.5" />} />
                 <FeatureBadge active={assessment.isSocialSafetyNetCovered} label="সামাজিক নিরাপত্তা বেষ্টনীভুক্ত" icon={<Heart className="w-3.5 h-3.5" />} />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar area */}
        <div className="space-y-8">
          {/* Housing Details */}
          <SectionCard 
            icon={<Home className="w-5 h-5 text-slate-600" />} 
            title="ভবন ও আবাসিক তথ্য"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <BuildingItem label="বহুতল ভবন" count={assessment.multiStoriedBuildingCount} color="text-indigo-600" />
                <BuildingItem label="পাকা ভবন" count={assessment.pakaBuildingCount} color="text-emerald-600" />
                <BuildingItem label="আধা-পাকা ভবন" count={assessment.semiPakaBuildingCount} color="text-amber-600" />
                <BuildingItem label="টিনশেড ঘর" count={assessment.tinShedCount} color="text-slate-600" />
                <BuildingItem label="কাঁচা ঘর" count={assessment.kachaHouseCount} color="text-orange-600" />
              </div>

              <div className="h-px bg-outline/5" />

              <div className="space-y-4">
                <InfoItem label="ডাকঘর" value={assessment.postOfficeBn} />
                <InfoItem label="গ্রাম/মহল্লা" value={assessment.villageBn} />
                <InfoItem label="উপজেলা" value={assessment.upazilaBn} />
                <InfoItem label="জেলা" value={assessment.districtBn} />
              </div>
            </div>
          </SectionCard>

          {/* System & Audit Info */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-[32px] p-8 border border-primary/10">
            <div className="flex items-center gap-3 mb-6 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-tight">সিস্টেম স্ট্যাটাস</span>
            </div>
            <div className="space-y-4">
              <AuditItem 
                label="এসেসমেন্টের তারিখ" 
                value={enToBnNumber(format(new Date(assessment.createdAt), "dd MMM, yyyy", { locale: bn }))} 
              />
              <AuditItem 
                label="এসেসমেন্ট আইডি" 
                value={id.slice(0, 8).toUpperCase()} 
              />
              <AuditItem 
                label="আবাসস্থল" 
                value={assessment.residentType || "স্থায়ী"} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ icon, title, children, className }: { icon: React.ReactNode, title: string, children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5", className)}>
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
    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 text-on-surface-variant">
        {label}
    </span>
    <div className="flex items-center gap-2">
      {icon}
      <span className={cn(
        "text-sm tracking-tight transition-colors font-bold text-on-surface",
        bold && "font-black text-primary",
        className
      )}>
        {value || "—"}
      </span>
    </div>
  </div>
);

const FeatureBadge = ({ active, label, icon }: { active?: boolean, label: string, icon: React.ReactNode }) => (
  <div className={cn(
    "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
    active ? "bg-primary/5 text-primary border-primary/20" : "bg-slate-50 text-slate-400 border-slate-100 opacity-50"
  )}>
    {icon}
    {label}
  </div>
);

const BuildingItem = ({ label, count, color }: { label: string, count?: number | null, color: string }) => (
  <div className="flex justify-between items-center bg-surface-container-low/50 p-3 rounded-xl border border-outline/5">
    <span className="text-xs font-bold text-on-surface-variant">{label}</span>
    <span className={cn("text-sm font-black", color)}>{enToBnNumber(count || 0)} টি</span>
  </div>
);

const AuditItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center gap-4">
    <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{label}</span>
    <span className="text-[11px] font-black text-primary/80">{value}</span>
  </div>
);
