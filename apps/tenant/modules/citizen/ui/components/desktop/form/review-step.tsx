"use client";

import { UseFormReturn } from "@workspace/ui/components/form";
import { Search, CheckCircle2, User, MapPin, Phone, MessageSquare, Globe } from "lucide-react";
import { CitizenApplicationFormValues } from "@workspace/schema";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { enToBnNumber } from "@workspace/utils";

interface ReviewStepProps {
  form: UseFormReturn<CitizenApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const ReviewStep = ({ form, isEnglishEnabled }: ReviewStepProps) => {
  const values = form.getValues();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
      {/* Header Card */}
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-on-surface tracking-tight">
                আবেদন পর্যালোচনা
            </h2>
            <p className="text-sm text-on-surface-variant font-medium italic">
                আবেদন জমা দেওয়ার আগে অনুগ্রহ করে সকল তথ্য যাচাই করে নিন
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Identity & Personal Info */}
        <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 h-full">
                <div className="flex items-center gap-3 mb-8">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-black text-on-surface tracking-tight">ব্যক্তিগত ও পরিচয় তথ্য</h3>
                </div>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ReviewItem label="নাম (বাংলা)" value={values.fullNameBn} />
                        {isEnglishEnabled && <ReviewItem label="Name (English)" value={values.fullNameEn} isEnglish />}
                        <ReviewItem label="পিতার নাম (বাংলা)" value={values.fatherNameBn} />
                        {isEnglishEnabled && <ReviewItem label="Father's Name (English)" value={values.fatherNameEn} isEnglish />}
                        <ReviewItem label="মাতার নাম (বাংলা)" value={values.motherNameBn} />
                        {isEnglishEnabled && <ReviewItem label="Mother's Name (English)" value={values.motherNameEn} isEnglish />}
                    </div>

                    <div className="h-px bg-outline/5 w-full" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ReviewItem label="এনআইডি নম্বর" value={enToBnNumber(values.nid)} />
                        <ReviewItem label="জন্ম তারিখ" value={values.dateOfBirth ? enToBnNumber(format(new Date(values.dateOfBirth), "dd MMMM yyyy", { locale: bn })) : "—"} />
                        <ReviewItem label="পেশা (বাংলা)" value={values.occupationBn} />
                        {isEnglishEnabled && <ReviewItem label="Occupation (English)" value={values.occupationEn} isEnglish />}
                    </div>

                    <div className="h-px bg-outline/5 w-full" />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <ReviewItem label="ধর্ম" value={values.religionBn} />
                        <ReviewItem label="লিঙ্গ" value={values.genderBn} />
                        <ReviewItem label="বৈবাহিক অবস্থা" value={values.maritalStatusBn} />
                        <ReviewItem label="অবস্থানের ধরণ" value={values.residentStatusBn} />
                        <ReviewItem label="শিক্ষাগত যোগ্যতা" value={values.educationalQualificationBn} />
                    </div>
                </div>
            </div>
        </div>

        {/* 2. Contact & Address Info */}
        <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
                <div className="flex items-center gap-3 mb-8">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-black text-on-surface tracking-tight">ঠিকানা ও যোগাযোগ</h3>
                </div>

                <div className="space-y-6">
                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 rounded-2xl p-4 border border-primary/10">
                        <ReviewItem label="মোবাইল নম্বর" value={enToBnNumber(values.mobile)} />
                        <ReviewItem label="ইমেইল ঠিকানা" value={values.email} />
                    </div>

                    <div className="h-px bg-outline/5 w-full" />

                    {/* Present Address */}
                    <div>
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">বর্তমান ঠিকানা</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <ReviewItem label="ওয়ার্ড নং" value={enToBnNumber(values.presentWardNo)} />
                            <ReviewItem label="গ্রাম (বাংলা)" value={values.presentVillageBn} />
                            {isEnglishEnabled && <ReviewItem label="Village (En)" value={values.presentVillageEn} isEnglish />}
                            <ReviewItem label="ডাকঘর (বাংলা)" value={values.presentPostOfficeBn} />
                            <ReviewItem label="উপজেলা (বাংলা)" value={values.presentUpazilaBn} />
                            <ReviewItem label="জেলা (বাংলা)" value={values.presentDistrictBn} />
                            <ReviewItem label="হোল্ডিং নং" value={enToBnNumber(values.presentHoldingNo)} />
                        </div>
                    </div>

                    <div className="h-px bg-outline/5 w-full" />

                    {/* Permanent Address */}
                    <div>
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">স্থায়ী ঠিকানা</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <ReviewItem label="ওয়ার্ড নং" value={enToBnNumber(values.permanentWardNo)} />
                            <ReviewItem label="গ্রাম (বাংলা)" value={values.permanentVillageBn} />
                            {isEnglishEnabled && <ReviewItem label="Village (En)" value={values.permanentVillageEn} isEnglish />}
                            <ReviewItem label="ডাকঘর (বাংলা)" value={values.permanentPostOfficeBn} />
                            <ReviewItem label="উপজেলা (বাংলা)" value={values.permanentUpazilaBn} />
                            <ReviewItem label="জেলা (বাংলা)" value={values.permanentDistrictBn} />
                            <ReviewItem label="হোল্ডিং নং" value={enToBnNumber(values.permanentHoldingNo)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Card */}
            <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
                <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-black text-on-surface tracking-tight">অতিরিক্ত মন্তব্য</h3>
                </div>
                <div className="space-y-4">
                    <ReviewItem label="মন্তব্য (বাংলা)" value={values.commentsBn} />
                    {isEnglishEnabled && <ReviewItem label="Comments (English)" value={values.commentsEn} isEnglish />}
                </div>
            </div>
        </div>
      </div>

      {/* Confirmation Footer */}
      <div className="bg-primary/5 rounded-[32px] p-8 border border-primary/10 flex items-start gap-6">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/10 flex-shrink-0">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h4 className="text-lg font-black text-on-surface tracking-tight">চূড়ান্ত নিশ্চিতকরণ</h4>
          <p className="text-sm text-on-surface-variant font-medium mt-1 leading-relaxed max-w-2xl">
            আমি এই মর্মে নিশ্চিত করছি যে, উপরে প্রদানকৃত সকল তথ্য আমার জ্ঞান ও বিশ্বাসমতে সত্য এবং সঠিক। কোনো ভুল তথ্য প্রদানের জন্য যথাযথ কর্তৃপক্ষ ব্যবস্থা গ্রহণ করতে পারবে।
          </p>
        </div>
      </div>
    </div>
  );
};

const ReviewItem = ({ label, value, isEnglish }: { label: string; value?: string | number | null; isEnglish?: boolean }) => (
  <div className="flex flex-col gap-1.5 group">
    <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${isEnglish ? 'text-primary' : 'text-on-surface-variant'}`}>
            {label}
        </span>
        {isEnglish && <Globe className="w-3 h-3 text-primary/40" />}
    </div>
    <span className={`text-sm font-bold tracking-tight transition-colors ${isEnglish ? 'text-primary' : 'text-on-surface'}`}>
        {value || "—"}
    </span>
  </div>
);
