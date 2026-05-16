"use client";

import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import {
  Fingerprint,
  Users,
  Heart,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Type,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { AssessmentApplicationFormValues } from "@workspace/schema";
import { useCitizenByNid } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { cn } from "@workspace/ui/lib/utils";
import {
  genderOptions,
  maritalStatusOptions,
  enToBnNumber,
  bnToEnNumber,
} from "@workspace/utils";

interface IdentityStepProps {
  form: UseFormReturn<AssessmentApplicationFormValues>;
}

export const IdentityStep = ({ form }: IdentityStepProps) => {
  const [nidSearch, setNidSearch] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);

  const { data: citizen, isLoading, isError } = useCitizenByNid(nidSearch, shouldSearch);

  useEffect(() => {
    if (citizen) {
      form.setValue("citizenId", citizen.id);
      // Set survey defaults if not in citizen
      form.setValue("maleCount", 1);
      form.setValue("femaleCount", 1);
      form.setValue("childCount", 0);
      form.setValue("disabledCount", 0);
      form.setValue("earningMembers", 1);
      form.setValue("dependentMembers", 0);
      form.setValue("remittanceSenders", 0);
      form.setValue("annualValuation", 0);
      form.setValue("taxRatePercent", 7);

      toast.success("নাগরিক তথ্য পাওয়া গেছে এবং ফর্ম পূরণ করা হয়েছে।");
      form.setValue("fullNameBn", citizen.fullNameBn);
      form.setValue("genderBn", citizen.genderBn);
      form.setValue("maritalStatusBn", citizen.maritalStatusBn);
      form.setValue("mobile", citizen.mobile);
      form.setValue("nid", citizen.nid);
      form.setValue("birthRegistrationNo", citizen.birthRegistrationNo);
      form.setValue("passportNo", citizen.passportNo);
      form.setValue("dateOfBirth", new Date(citizen.dateOfBirth));
      form.setValue("fatherNameBn", citizen.fatherNameBn);
      form.setValue("motherNameBn", citizen.motherNameBn);
      form.setValue("occupationBn", citizen.occupationBn);
      form.setValue("religionBn", citizen.religionBn);
      form.setValue("educationalQualificationBn", citizen.educationalQualificationBn);
      form.setValue("residentType", citizen.residentStatusBn);

      // Address defaults if available
      form.setValue("wardNo", citizen.permanentWardNo);
      form.setValue("villageBn", citizen.permanentVillageBn);
      form.setValue("holdingNo", citizen.permanentHoldingNo || "");
      form.setValue("districtBn", citizen.permanentDistrictBn);
      form.setValue("upazilaBn", citizen.permanentUpazilaBn);
      form.setValue("postOfficeBn", citizen.permanentPostOfficeBn);
    }
  }, [citizen, form]);

  const handleSearch = () => {
    if (nidSearch.length >= 10) {
      setShouldSearch(true);
    }
  };

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Search Section */}
      <div className="bg-primary/[0.03] rounded-[32px] p-8 border-2 border-dashed border-primary/20 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-ambient flex items-center justify-center text-primary border border-primary/10">
            <Search className="w-8 h-8" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-xl font-black text-on-surface tracking-tight">নাগরিক অনুসন্ধান করুন</h2>
            <p className="text-sm text-on-surface-variant font-medium">এনআইডি নম্বর দিয়ে নাগরিকের তথ্য সরাসরি পূরণ করুন</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              placeholder="এনআইডি নম্বর লিখুন"
              value={enToBnNumber(nidSearch)}
              onChange={(e) => {
                setNidSearch(bnToEnNumber(e.target.value));
                setShouldSearch(false);
              }}
              className="h-14 bg-white border-none rounded-2xl px-6 focus-visible:ring-2 focus-visible:ring-primary font-bold min-w-[240px] text-lg shadow-sm"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isLoading || nidSearch.length < 10}
              className="h-14 w-14 rounded-2xl bg-primary text-white shadow-glow hover:scale-105 active:scale-95 transition-all p-0 border-none"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {citizen && (
          <div className="mt-6 flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 animate-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">নাগরিক পাওয়া গেছে: {citizen.fullNameBn}</span>
          </div>
        )}

        {isError && (
          <div className="mt-6 flex items-center gap-3 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">নাগরিক পাওয়া যায়নি। অনুগ্রহ করে ম্যানুয়ালি তথ্য দিন।</span>
          </div>
        )}
      </div>

      {/* Manual Entry Section */}
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-on-surface tracking-tight">মৌলিক তথ্য</h2>
            <p className="text-xs text-on-surface-variant font-medium italic">আবেদনকারীর প্রাথমিক তথ্য (ম্যানুয়ালি পরিবর্তনযোগ্য)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="fullNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Type className="w-3.5 h-3.5" /> পূর্ণ নাম <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="উদা: মোঃ আব্দুর রহমান"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nid"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Fingerprint className="w-3.5 h-3.5" /> এনআইডি নম্বর
                </FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    placeholder="১০ অথবা ১৭ ডিজিট"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
                    {...field}
                    value={enToBnNumber(field.value) || ""}
                    onChange={(e) => field.onChange(bnToEnNumber(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genderBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Users className="w-3.5 h-3.5" /> লিঙ্গ <span className="text-rose-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm">
                      <SelectValue placeholder="নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    {genderOptions.map((v) => (
                      <SelectItem key={v.value} value={v.labelBn} className="font-bold text-sm">{v.labelBn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maritalStatusBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Heart className="w-3.5 h-3.5" /> বৈবাহিক অবস্থা <span className="text-rose-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm">
                      <SelectValue placeholder="নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    {maritalStatusOptions.map((v) => (
                      <SelectItem key={v.value} value={v.labelBn} className="font-bold text-sm">{v.labelBn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  ফোন নম্বর
                </FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    placeholder="উদা: ০১৭..."
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
                    {...field}
                    value={enToBnNumber(field.value) || ""}
                    onChange={(e) => field.onChange(bnToEnNumber(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </section>
  );
};
