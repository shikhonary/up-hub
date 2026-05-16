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
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Type,
  UserCheck,
  ArrowRight,
  Globe,
  Book,
  CreditCard,
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
import { useCitizenByNid } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import {
  genderOptions,
  maritalStatusOptions,
  religionOptions,
  enToBnNumber,
  bnToEnNumber,
} from "@workspace/utils";

interface OwnerInfoStepProps {
  form: UseFormReturn<TradeLicenseApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const OwnerInfoStep = ({ form, isEnglishEnabled }: OwnerInfoStepProps) => {
  const [nidSearch, setNidSearch] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);

  const { data: citizen, isLoading, isError } = useCitizenByNid(nidSearch, shouldSearch);

  useEffect(() => {
    if (citizen) {
      toast.success("নাগরিক তথ্য পাওয়া গেছে এবং ফর্ম পূরণ করা হয়েছে।");
      form.setValue("fullNameBn", citizen.fullNameBn);
      form.setValue("fullNameEn", citizen.fullNameEn || "");
      form.setValue("mobileBn", enToBnNumber(citizen.mobile));
      form.setValue("mobileEn", citizen.mobile);
      form.setValue("fatherNameBn", citizen.fatherNameBn);
      form.setValue("fatherNameEn", citizen.fatherNameEn || "");
      form.setValue("motherNameBn", citizen.motherNameBn);
      form.setValue("motherNameEn", citizen.motherNameEn || "");

      // Address sync
      form.setValue("presentVillageBn", citizen.presentVillageBn);
      form.setValue("presentVillageEn", citizen.presentVillageEn || "");
      form.setValue("presentWardNo", citizen.presentWardNo);
      form.setValue("presentDistrictBn", citizen.presentDistrictBn);
      form.setValue("presentDistrictEn", citizen.presentDistrictEn || "");
      form.setValue("presentUpazilaBn", citizen.presentUpazilaBn);
      form.setValue("presentUpazilaEn", citizen.presentUpazilaEn || "");
      form.setValue("presentPostOfficeBn", citizen.presentPostOfficeBn);
      form.setValue("presentPostOfficeEn", citizen.presentPostOfficeEn || "");

      form.setValue("permanentVillageBn", citizen.permanentVillageBn);
      form.setValue("permanentVillageEn", citizen.permanentVillageEn || "");
      form.setValue("permanentWardNo", citizen.permanentWardNo);
      form.setValue("permanentDistrictBn", citizen.permanentDistrictBn);
      form.setValue("permanentDistrictEn", citizen.permanentDistrictEn || "");
      form.setValue("permanentUpazilaBn", citizen.permanentUpazilaBn);
      form.setValue("permanentUpazilaEn", citizen.permanentUpazilaEn || "");
      form.setValue("permanentPostOfficeBn", citizen.permanentPostOfficeBn);
      form.setValue("permanentPostOfficeEn", citizen.permanentPostOfficeEn || "");
    }
  }, [citizen, form]);

  const handleSearch = () => {
    if (nidSearch.length >= 10) {
      setShouldSearch(true);
    }
  };

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-500" />
        <p className="text-sm font-bold text-rose-600">লাল তারকা (*) চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে</p>
      </div>

      {/* Search Section */}
      <div className="bg-primary/[0.03] rounded-[32px] p-8 border-2 border-dashed border-primary/20 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-ambient flex items-center justify-center text-primary border border-primary/10">
            <Search className="w-8 h-8" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-xl font-black text-on-surface tracking-tight">মালিক অনুসন্ধান করুন</h2>
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
            <span className="text-xs font-bold uppercase tracking-wide">মালিক পাওয়া গেছে: {citizen.fullNameBn}</span>
          </div>
        )}

        {isError && (
          <div className="mt-6 flex items-center gap-3 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">নাগরিক পাওয়া যায়নি। অনুগ্রহ করে ম্যানুয়ালি তথ্য দিন।</span>
          </div>
        )}
      </div>

      {/* Manual Entry Section - Bengali */}
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-on-surface tracking-tight">মালিকের মৌলিক তথ্য (বাংলা)</h2>
            <p className="text-xs text-on-surface-variant font-medium italic">মালিকের নাম, পরিচয় ও পারিবারিক তথ্য বাংলায় প্রদান করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="fullNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Type className="w-3.5 h-3.5" /> মালিকের নাম (বাংলা) <span className="text-rose-500">*</span>
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
            name="fatherNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  পিতার নাম (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="পিতার নাম লিখুন"
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
            name="motherNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  মাতার নাম (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="মাতার নাম লিখুন"
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
            name="tinBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Book className="w-3.5 h-3.5" /> টিআইএন নম্বর (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    placeholder="টিআইএন নম্বর"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      form.setValue("tinEn", bnToEnNumber(val), { shouldValidate: true });
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="binBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <CreditCard className="w-3.5 h-3.5" /> বিআইএন নম্বর (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    placeholder="বিআইএন নম্বর"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      form.setValue("binEn", bnToEnNumber(val), { shouldValidate: true });
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nidBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <CreditCard className="w-3.5 h-3.5" /> এনআইডি নম্বর (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    placeholder="এনআইডি নম্বর"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      form.setValue("nidEn", bnToEnNumber(val), { shouldValidate: true });
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthRegistrationBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Book className="w-3.5 h-3.5" /> জন্ম নিবন্ধন নম্বর (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    placeholder="জন্ম নিবন্ধন নম্বর"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      form.setValue("birthRegistrationEn", bnToEnNumber(val), { shouldValidate: true });
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passportBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Globe className="w-3.5 h-3.5" /> পাসপোর্ট নম্বর (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="পাসপোর্ট নম্বর"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      form.setValue("passportEn", bnToEnNumber(val), { shouldValidate: true });
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Manual Entry Section - English */}
      {isEnglishEnabled && (
        <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary tracking-tight">Owner Information (English)</h2>
              <p className="text-xs text-on-surface-variant font-medium italic">Identification details in English</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="fullNameEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Type className="w-3.5 h-3.5" /> Owner Name (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Md. Abdur Rahman"
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
              name="fatherNameEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    Father&apos;s Name (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter father's name"
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
              name="motherNameEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    Mother&apos;s Name (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter mother's name"
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
              name="tinEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Book className="w-3.5 h-3.5" /> TIN Number (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="TIN Number"
                      className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        form.setValue("tinBn", enToBnNumber(val), { shouldValidate: true });
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="binEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <CreditCard className="w-3.5 h-3.5" /> BIN Number (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="BIN Number"
                      className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        form.setValue("binBn", enToBnNumber(val), { shouldValidate: true });
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nidEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <CreditCard className="w-3.5 h-3.5" /> NID Number (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NID Number"
                      className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        form.setValue("nidBn", enToBnNumber(val), { shouldValidate: true });
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthRegistrationEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Book className="w-3.5 h-3.5" /> Birth Reg. Number (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Birth Reg. Number"
                      className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        form.setValue("birthRegistrationBn", enToBnNumber(val), { shouldValidate: true });
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passportEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Globe className="w-3.5 h-3.5" /> Passport Number (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Passport Number"
                      className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        form.setValue("passportBn", enToBnNumber(val), { shouldValidate: true });
                      }}
                    />
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
