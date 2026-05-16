"use client";

import { UseFormReturn } from "@workspace/ui/components/form";
import {
  CheckCircle2,
  Building2,
  User,
  MapPin,
  Briefcase,
} from "lucide-react";
import { TradeLicenseApplicationFormValues } from "@workspace/schema";
import { enToBnNumber } from "@workspace/utils";
import { format } from "date-fns";
import { useTradeLicenseCategories } from "@workspace/api-client";

interface ReviewStepProps {
  form: UseFormReturn<TradeLicenseApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const ReviewStep = ({ form, isEnglishEnabled }: ReviewStepProps) => {
  const { data: categories } = useTradeLicenseCategories();
  const values = form.getValues();

  const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex flex-col gap-1 py-3 border-b border-slate-50 last:border-none">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold text-slate-700">{value || "—"}</span>
    </div>
  );

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {children}
      </div>
    </div>
  );

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
        <div className="w-20 h-20 rounded-[32px] bg-emerald-50 flex items-center justify-center text-emerald-500 border-2 border-emerald-100 shadow-ambient animate-bounce-subtle">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">সব কিছু ঠিক আছে কি?</h2>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
            আপনার প্রদানকৃত সকল তথ্য পুনরায় যাচাই করে নিন। একবার সাবমিট করার পর তথ্যগুলো অনুমোদনের জন্য প্রেরণ করা হবে।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Section title="প্রতিষ্ঠানের তথ্য" icon={Building2}>
          <InfoRow label="প্রতিষ্ঠানের নাম (বাংলা)" value={values.orgNameBn} />
          {isEnglishEnabled && <InfoRow label="প্রতিষ্ঠানের নাম (ইংরেজি)" value={values.orgNameEn} />}
          <InfoRow label="মালিকানার ধরন (বাংলা)" value={values.ownershipTypeBn} />
          {isEnglishEnabled && <InfoRow label="মালিকানার ধরন (ইংরেজি)" value={values.ownershipTypeEn} />}
        </Section>

        <Section title="মালিকের তথ্য" icon={User}>
          <InfoRow label="মালিকের নাম (বাংলা)" value={values.fullNameBn} />
          {isEnglishEnabled && <InfoRow label="মালিকের নাম (ইংরেজি)" value={values.fullNameEn} />}
          <InfoRow label="টিআইএন নম্বর (বাংলা)" value={values.tinBn} />
          {isEnglishEnabled && <InfoRow label="TIN Number (English)" value={values.tinEn} />}
          <InfoRow label="বিআইএন নম্বর (বাংলা)" value={values.binBn} />
          {isEnglishEnabled && <InfoRow label="BIN Number (English)" value={values.binEn} />}
          <InfoRow label="পিতার নাম (বাংলা)" value={values.fatherNameBn} />
          {isEnglishEnabled && <InfoRow label="পিতার নাম (ইংরেজি)" value={values.fatherNameEn} />}
          <InfoRow label="মাতার নাম (বাংলা)" value={values.motherNameBn} />
          {isEnglishEnabled && <InfoRow label="মাতার নাম (ইংরেজি)" value={values.motherNameEn} />}
          <InfoRow label="এনআইডি নম্বর (বাংলা)" value={values.nidBn} />
          {isEnglishEnabled && <InfoRow label="NID Number (English)" value={values.nidEn} />}
          <InfoRow label="জন্ম নিবন্ধন নম্বর (বাংলা)" value={values.birthRegistrationBn} />
          {isEnglishEnabled && <InfoRow label="Birth Reg. Number (English)" value={values.birthRegistrationEn} />}
          <InfoRow label="পাসপোর্ট নম্বর (বাংলা)" value={values.passportBn} />
          {isEnglishEnabled && <InfoRow label="Passport Number (English)" value={values.passportEn} />}
        </Section>

        <Section title="ঠিকানা" icon={MapPin}>
          <InfoRow label="বর্তমান গ্রাম (বাংলা)" value={values.presentVillageBn} />
          {isEnglishEnabled && <InfoRow label="বর্তমান গ্রাম (ইংরেজি)" value={values.presentVillageEn} />}
          <InfoRow label="বর্তমান ওয়ার্ড" value={enToBnNumber(values.presentWardNo)} />
          <InfoRow label="বর্তমান হোল্ডিং (বাংলা)" value={values.presentHoldingNoBn} />
          {isEnglishEnabled && <InfoRow label="Present Holding (English)" value={values.presentHoldingNoEn} />}
          <InfoRow label="বর্তমান ডাকঘর (বাংলা)" value={values.presentPostOfficeBn} />
          {isEnglishEnabled && <InfoRow label="Present Post Office (English)" value={values.presentPostOfficeEn} />}
          <InfoRow label="বর্তমান উপজেলা (বাংলা)" value={values.presentUpazilaBn} />
          {isEnglishEnabled && <InfoRow label="Present Upazila (English)" value={values.presentUpazilaEn} />}
          <InfoRow label="বর্তমান জেলা (বাংলা)" value={values.presentDistrictBn} />
          {isEnglishEnabled && <InfoRow label="Present District (English)" value={values.presentDistrictEn} />}
          
          <InfoRow label="স্থায়ী গ্রাম (বাংলা)" value={values.permanentVillageBn} />
          {isEnglishEnabled && <InfoRow label="স্থায়ী গ্রাম (ইংরেজি)" value={values.permanentVillageEn} />}
          <InfoRow label="স্থায়ী ওয়ার্ড" value={enToBnNumber(values.permanentWardNo)} />
          <InfoRow label="স্থায়ী হোল্ডিং (বাংলা)" value={values.permanentHoldingNoBn} />
          {isEnglishEnabled && <InfoRow label="Permanent Holding (English)" value={values.permanentHoldingNoEn} />}
          <InfoRow label="স্থায়ী ডাকঘর (বাংলা)" value={values.permanentPostOfficeBn} />
          {isEnglishEnabled && <InfoRow label="Permanent Post Office (English)" value={values.permanentPostOfficeEn} />}
          <InfoRow label="স্থায়ী উপজেলা (বাংলা)" value={values.permanentUpazilaBn} />
          {isEnglishEnabled && <InfoRow label="Permanent Upazila (English)" value={values.permanentUpazilaEn} />}
          <InfoRow label="স্থায়ী জেলা (বাংলা)" value={values.permanentDistrictBn} />
          {isEnglishEnabled && <InfoRow label="Permanent District (English)" value={values.permanentDistrictEn} />}
          
          <InfoRow label="ব্যবসার গ্রাম (বাংলা)" value={values.businessVillageBn} />
          {isEnglishEnabled && <InfoRow label="ব্যবসার গ্রাম (ইংরেজি)" value={values.businessVillageEn} />}
          <InfoRow label="ব্যবসার ওয়ার্ড" value={enToBnNumber(values.businessWardNo)} />
          <InfoRow label="ব্যবসার হোল্ডিং (বাংলা)" value={values.businessHoldingNoBn} />
          {isEnglishEnabled && <InfoRow label="Business Holding (English)" value={values.businessHoldingNoEn} />}
          <InfoRow label="ব্যবসার ডাকঘর (বাংলা)" value={values.businessPostOfficeBn} />
          {isEnglishEnabled && <InfoRow label="Business Post Office (English)" value={values.businessPostOfficeEn} />}
          <InfoRow label="ব্যবসার উপজেলা (বাংলা)" value={values.businessUpazilaBn} />
          {isEnglishEnabled && <InfoRow label="Business Upazila (English)" value={values.businessUpazilaEn} />}
          <InfoRow label="ব্যবসার জেলা (বাংলা)" value={values.businessDistrictBn} />
          {isEnglishEnabled && <InfoRow label="Business District (English)" value={values.businessDistrictEn} />}
        </Section>

        <Section title="ব্যবসার বিস্তারিত" icon={Briefcase}>
          <InfoRow label="ব্যবসার ক্যাটাগরি" value={categories?.data?.items.find((c: any) => c.id === values.tradeLicenseCategoryId)?.typeBn || values.tradeLicenseCategoryId} />
          <InfoRow label="ব্যবসা শুরুর তারিখ" value={values.businessStartDate ? format(new Date(values.businessStartDate), 'dd/MM/yyyy') : "—"} />
          <InfoRow label="পরিশোধিত মূলধন" value={values.paidUpCapital ? `${enToBnNumber(values.paidUpCapital)} টাকা` : "—"} />
          <InfoRow label="সাইনবোর্ড সাইজ" value={values.signboardSize ? `${enToBnNumber(values.signboardSize)} বর্গফুট` : "—"} />
          <InfoRow label="ভ্যাট আইডি (বাংলা)" value={values.vatIdBn} />
          {isEnglishEnabled && <InfoRow label="VAT ID (English)" value={values.vatIdEn} />}
          <InfoRow label="ট্যাক্স আইডি (বাংলা)" value={values.taxIdBn} />
          {isEnglishEnabled && <InfoRow label="Tax ID (English)" value={values.taxIdEn} />}
          <InfoRow label="মালিকানার অবস্থা (বাংলা)" value={values.ownershipStatusBn} />
          {isEnglishEnabled && <InfoRow label="মালিকানার অবস্থা (ইংরেজি)" value={values.ownershipStatusEn} />}
          <InfoRow label="আবেদনকারী (বাংলা)" value={values.applicantNameBn} />
          {isEnglishEnabled && <InfoRow label="আবেদনকারী (ইংরেজি)" value={values.applicantNameEn} />}
          <InfoRow label="মোবাইল (বাংলা)" value={values.mobileBn} />
          {isEnglishEnabled && <InfoRow label="Mobile (English)" value={values.mobileEn} />}
          <InfoRow label="ফোন (বাংলা)" value={values.phoneBn} />
          {isEnglishEnabled && <InfoRow label="Phone (English)" value={values.phoneEn} />}
          <InfoRow label="ইমেইল ঠিকানা" value={values.email} />
        </Section>
      </div>
    </section>
  );
};
