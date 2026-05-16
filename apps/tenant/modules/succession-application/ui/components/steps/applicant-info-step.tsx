"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { User, Globe, AlertCircle, Type } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { SuccessionApplicationFormValues } from "@workspace/schema";

interface ApplicantInfoStepProps {
  form: UseFormReturn<SuccessionApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const ApplicantInfoStep = ({ form, isEnglishEnabled }: ApplicantInfoStepProps) => {
  return (
    <section className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-500" />
        <p className="text-sm font-bold text-rose-600">লাল তারকা (*) চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে</p>
      </div>

      {/* Bengali Section 1: Applicant Info */}
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-on-surface tracking-tight">আবেদনকারীর তথ্য (বাংলা)</h2>
            <p className="text-xs text-on-surface-variant font-medium italic">আবেদনকারীর ব্যক্তিগত তথ্য বাংলায় প্রদান করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="applicantNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Type className="w-3.5 h-3.5" /> আবেদনকারীর নাম (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="আবেদনকারীর নাম লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicantGuardianNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  পিতা/স্বামীর নাম (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="পিতা/স্বামীর নাম লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* English Section 1: Applicant Info */}
      {isEnglishEnabled && (
        <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary tracking-tight">Applicant Information (English)</h2>
              <p className="text-xs text-on-surface-variant font-medium italic">Identification details in English</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="applicantNameEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Type className="w-3.5 h-3.5" /> Applicant Name (English)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter applicant name" className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold text-sm transition-all" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicantGuardianNameEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    Guardian Name (English)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter guardian name" className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold text-sm transition-all" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </section>
  );
};
