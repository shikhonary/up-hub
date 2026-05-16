"use client";

import { UseFormReturn } from "@workspace/ui/components/form";
import { SuccessionApplicationFormValues } from "@workspace/schema";
import { User, MapPin, HeartOff, Users, CheckCircle2, Phone, Mail } from "lucide-react";
import { Card } from "@workspace/ui/components/card";

interface ReviewStepProps {
  form: UseFormReturn<SuccessionApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const ReviewStep = ({ form, isEnglishEnabled }: ReviewStepProps) => {
  const values = form.getValues();

  const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <span className="text-sm font-bold text-slate-700">{value || "—"}</span>
    </div>
  );

  return (
    <section className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-emerald-50/80 border border-emerald-100 rounded-[32px] p-8 flex items-center gap-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shrink-0">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-emerald-800 tracking-tight">আবেদনটি পুনরায় যাচাই করুন</h2>
          <p className="text-sm font-bold text-emerald-600/80">নিচের সকল তথ্য সঠিক আছে কিনা তা ভালো করে দেখে নিন। কোনো ভুল থাকলে পূর্ববর্তী ধাপে গিয়ে সংশোধন করুন।</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Applicant Info Review */}
        <Card className="p-8 border-none bg-slate-50/50 rounded-[32px] space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-black text-slate-800 uppercase tracking-tight">আবেদনকারীর তথ্য</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <InfoRow label="নাম (বাংলা)" value={values.applicantNameBn} />
            <InfoRow label="পিতা/স্বামীর নাম" value={values.applicantGuardianNameBn} />
          </div>
          <div className="space-y-4 pt-4">
             <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
               <MapPin className="w-3.5 h-3.5" /> বর্তমান ঠিকানা
             </div>
             <p className="text-sm font-bold text-slate-600 leading-relaxed">
               গ্রাম: {values.presentVillageBn}, ওয়ার্ড: {values.presentWardNo}, ডাকঘর: {values.presentPostOfficeBn}, উপজেলা: {values.presentUpazilaBn}, জেলা: {values.presentDistrictBn}
             </p>
          </div>
        </Card>

        {/* Deceased Info Review */}
        <Card className="p-8 border-none bg-slate-50/50 rounded-[32px] space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50">
            <HeartOff className="w-5 h-5 text-rose-500" />
            <h3 className="font-black text-slate-800 uppercase tracking-tight">মৃত ব্যক্তির তথ্য</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <InfoRow label="নাম (বাংলা)" value={values.nameBn} />
            <InfoRow label="পিতার নাম" value={values.fatherNameBn} />
            <InfoRow label="মৃত্যু তারিখ" value={values.deathDate instanceof Date ? values.deathDate.toLocaleDateString("bn-BD") : values.deathDate} />
            <InfoRow label="এনআইডি" value={values.nidNo} />
            <InfoRow label="মোবাইল" value={values.mobile} />
            <InfoRow label="ধর্ম" value={values.religion} />
          </div>
          <div className="space-y-4 pt-4">
             <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
               <MapPin className="w-3.5 h-3.5" /> স্থায়ী ঠিকানা
             </div>
             <p className="text-sm font-bold text-slate-600 leading-relaxed">
               গ্রাম: {values.permanentVillageBn}, ওয়ার্ড: {values.permanentWardNo}, ডাকঘর: {values.permanentPostOfficeBn}, উপজেলা: {values.permanentUpazilaBn}, জেলা: {values.permanentDistrictBn}
             </p>
          </div>
        </Card>
      </div>

      {/* Heirs Review */}
      <Card className="p-8 border-none bg-slate-50/50 rounded-[32px] space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50">
          <Users className="w-5 h-5 text-indigo-500" />
          <h3 className="font-black text-slate-800 uppercase tracking-tight">উত্তরাধিকারীগণের তালিকা</h3>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">ক্রমিক</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">নাম</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">সম্পর্ক</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">বয়স/জন্ম তারিখ</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">এনআইডি/জন্মনিবন্ধন</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">জীবিত?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {values.heirs.map((heir, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{heir.heirNameBn}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{heir.relationBn}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{heir.ageDobDod}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{heir.idNo || "—"}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{heir.isAlive === "YES" ? "হ্যাঁ" : "না"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};
