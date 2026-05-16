"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import {
  Building2,
  Calendar,
  Globe,
  Layers,
  Type,
  AlertCircle,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { TradeLicenseApplicationFormValues } from "@workspace/schema";
import { useFiscalYears } from "@workspace/api-client";
import { ownershipTypeOptions } from "@workspace/utils/constants";

interface OrgInfoStepProps {
  form: UseFormReturn<TradeLicenseApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const OrgInfoStep = ({ form, isEnglishEnabled }: OrgInfoStepProps) => {
  const { data: fiscalYears } = useFiscalYears();

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-500" />
        <p className="text-sm font-bold text-rose-600">লাল তারকা (*) চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে</p>
      </div>

      {/* Bengali Section */}
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-on-surface tracking-tight">প্রতিষ্ঠানের তথ্য (বাংলা)</h2>
            <p className="text-xs text-on-surface-variant font-medium italic">প্রতিষ্ঠানের নাম ও মৌলিক তথ্য বাংলায় প্রদান করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="orgNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Type className="w-3.5 h-3.5" /> প্রতিষ্ঠানের নাম (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="উদা: জননী এন্টারপ্রাইজ"
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
            name="ownershipTypeBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Layers className="w-3.5 h-3.5" /> মালিকানার ধরন <span className="text-rose-500">*</span>
                </FormLabel>
                <Select onValueChange={(val) => {
                  field.onChange(val);
                  const opt = ownershipTypeOptions.find(o => o.labelBn === val);
                  if (opt) form.setValue("ownershipTypeEn", opt.labelEn, { shouldValidate: true });
                }} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm text-left">
                      <SelectValue placeholder="নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    {ownershipTypeOptions.map((v) => (
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
            name="fiscalYearId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Calendar className="w-3.5 h-3.5" /> অর্থবছর <span className="text-rose-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm text-left">
                      <SelectValue placeholder="নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    {fiscalYears?.data?.items.map((v: any) => (
                      <SelectItem key={v.id} value={v.id} className="font-bold text-sm">{v.nameBn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* English Section */}
      {isEnglishEnabled && (
        <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary tracking-tight">Organization Information (English)</h2>
              <p className="text-xs text-on-surface-variant font-medium italic">Identification details in English</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="orgNameEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Type className="w-3.5 h-3.5" /> Organization Name (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Janani Enterprise"
                      className="h-12 bg-white border border-primary/10 rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownershipTypeEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Layers className="w-3.5 h-3.5" /> Ownership Type (English)
                  </FormLabel>
                  <Select onValueChange={(val) => {
                    field.onChange(val);
                    const opt = ownershipTypeOptions.find(o => o.labelEn === val);
                    if (opt) form.setValue("ownershipTypeBn", opt.labelBn, { shouldValidate: true });
                  }} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white border border-primary/10 rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm text-left">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                      {ownershipTypeOptions.map((v) => (
                        <SelectItem key={v.value} value={v.labelEn} className="font-bold text-sm">{v.labelEn}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
