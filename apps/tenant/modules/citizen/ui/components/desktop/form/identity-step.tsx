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
  Fingerprint,
  Baby,
  CalendarDays,
  Type,
  Users,
  Heart,
  Languages,
  BookOpen,
  Building,
  Briefcase,
  GraduationCap,
  Globe,
  FileText,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { CitizenApplicationFormValues } from "@workspace/schema";
import { FormCalendar } from "@workspace/ui/shared/form-calendar";
import {
  genderOptions,
  religionOptions,
  maritalStatusOptions,
  residentStatusOptions,
  enToBnNumber,
  bnToEnNumber,
} from "@workspace/utils";

interface IdentityStepProps {
  form: UseFormReturn<CitizenApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const IdentityStep = ({ form, isEnglishEnabled }: IdentityStepProps) => {
  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* SECTION 1: Personal Identity */}
      <div className="space-y-6">
        <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
            <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                <Languages className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-black text-on-surface tracking-tight">
                    ব্যক্তিগত তথ্য
                </h2>
                <p className="text-xs text-on-surface-variant font-medium italic">
                    আবেদনকারীর প্রাথমিক ব্যক্তিগত তথ্যাবলি
                </p>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                name="fatherNameBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Users className="w-3.5 h-3.5" /> পিতার নাম <span className="text-rose-500">*</span>
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
                    <Users className="w-3.5 h-3.5" /> মাতার নাম <span className="text-rose-500">*</span>
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
            </div>
        </div>

        {isEnglishEnabled && (
            <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-primary tracking-tight">Personal Information (English)</h2>
                        <p className="text-xs text-on-surface-variant font-medium italic">Identification details in English</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FormField
                    control={form.control}
                    name="fullNameEn"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                            <Type className="w-3.5 h-3.5" /> Full Name (English)
                        </FormLabel>
                        <FormControl>
                            <Input
                            placeholder="e.g., Md. Abdur Rahman"
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
                            <Users className="w-3.5 h-3.5" /> Father&apos;s Name (English)
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
                            <Users className="w-3.5 h-3.5" /> Mother&apos;s Name (English)
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
                </div>
            </div>
        )}
      </div>

      {/* SECTION 2: Demographics & Identity */}
      <div className="space-y-6">
        <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
            <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                <Fingerprint className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-black text-on-surface tracking-tight">
                    পরিচয় ও জনমিতি
                </h2>
                <p className="text-xs text-on-surface-variant font-medium italic">
                    অফিসিয়াল পরিচয় ও ব্যক্তিগত বৈশিষ্ট্যসমূহ
                </p>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <FormField
                control={form.control}
                name="nid"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Fingerprint className="w-3.5 h-3.5" /> এনআইডি নম্বর <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                    <Input
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
                name="birthRegistrationNo"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Baby className="w-3.5 h-3.5" /> জন্ম নিবন্ধন নম্বর
                    </FormLabel>
                    <FormControl>
                    <Input
                        placeholder="১৭ ডিজিট"
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
                name="passportNo"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <FileText className="w-3.5 h-3.5" /> পাসপোর্ট নম্বর
                    </FormLabel>
                    <FormControl>
                    <Input
                        placeholder="পাসপোর্ট নম্বর লিখুন"
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

            <FormCalendar
                name="dateOfBirth"
                label={
                <>
                    <CalendarDays className="w-3.5 h-3.5" /> জন্ম তারিখ <span className="text-rose-500">*</span>
                </>
                }
                labelClassName="flex items-center gap-1.5 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70"
                required
                className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm"
            />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FormField
                control={form.control}
                name="genderBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Users className="w-3.5 h-3.5" /> লিঙ্গ <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select onValueChange={(val) => {
                        field.onChange(val);
                        const opt = genderOptions.find(o => o.labelBn === val);
                        if (opt) form.setValue("genderEn", opt.labelEn, { shouldValidate: true });
                    }} value={field.value || ""}>
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
                name="religionBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <BookOpen className="w-3.5 h-3.5" /> ধর্ম <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select onValueChange={(val) => {
                        field.onChange(val);
                        const opt = religionOptions.find(o => o.labelBn === val);
                        if (opt) form.setValue("religionEn", opt.labelEn, { shouldValidate: true });
                    }} value={field.value || ""}>
                    <FormControl>
                        <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm">
                        <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                        {religionOptions.map((v) => (
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
                    <Select onValueChange={(val) => {
                        field.onChange(val);
                        const opt = maritalStatusOptions.find(o => o.labelBn === val);
                        if (opt) form.setValue("maritalStatusEn", opt.labelEn, { shouldValidate: true });
                    }} value={field.value || ""}>
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
                name="residentStatusBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Building className="w-3.5 h-3.5" /> অবস্থানের ধরণ <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select onValueChange={(val) => {
                        field.onChange(val);
                        const opt = residentStatusOptions.find(o => o.labelBn === val);
                        if (opt) form.setValue("residentStatusEn", opt.labelEn, { shouldValidate: true });
                    }} value={field.value || ""}>
                    <FormControl>
                        <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm">
                        <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                        {residentStatusOptions.map((v) => (
                        <SelectItem key={v.value} value={v.labelBn} className="font-bold text-sm">{v.labelBn}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />
            </div>
        </div>

        {isEnglishEnabled && (
            <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-primary tracking-tight">Demographic & Identity (English)</h2>
                        <p className="text-xs text-on-surface-variant font-medium italic">Characteristics and IDs in English</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <FormField
                        control={form.control}
                        name="nid"
                        render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                            <Fingerprint className="w-3.5 h-3.5" /> NID Number
                            </FormLabel>
                            <FormControl>
                            <Input
                                placeholder="10 or 17 digits"
                                className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
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
                        name="birthRegistrationNo"
                        render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                            <Baby className="w-3.5 h-3.5" /> Birth Registration No
                            </FormLabel>
                            <FormControl>
                            <Input
                                placeholder="17 digits"
                                className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
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
                        name="passportNo"
                        render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                            <FileText className="w-3.5 h-3.5" /> Passport Number
                            </FormLabel>
                            <FormControl>
                            <Input
                                placeholder="Enter passport number"
                                className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                                {...field}
                                value={field.value || ""}
                            />
                            </FormControl>
                            <FormMessage className="text-xs font-bold" />
                        </FormItem>
                        )}
                    />

                    <FormCalendar
                        name="dateOfBirth"
                        label={
                        <>
                            <CalendarDays className="w-3.5 h-3.5" /> Date of Birth
                        </>
                        }
                        labelClassName="flex items-center gap-1.5 text-[11px] font-black text-primary tracking-widest uppercase opacity-70"
                        className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <FormField
                    control={form.control}
                    name="genderEn"
                    render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                        <Users className="w-3.5 h-3.5" /> Gender (English)
                        </FormLabel>
                        <Select onValueChange={(val) => {
                            field.onChange(val);
                            const opt = genderOptions.find(o => o.labelEn === val);
                            if (opt) form.setValue("genderBn", opt.labelBn, { shouldValidate: true });
                        }} value={field.value || ""}>
                        <FormControl>
                            <SelectTrigger className="h-12 bg-white border border-primary/10 rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-outline/5">
                            {genderOptions.map((v) => (
                            <SelectItem key={v.value} value={v.labelEn} className="font-bold text-sm">{v.labelEn}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage className="text-xs font-bold" />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="religionEn"
                    render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                        <BookOpen className="w-3.5 h-3.5" /> Religion (English)
                        </FormLabel>
                        <Select onValueChange={(val) => {
                            field.onChange(val);
                            const opt = religionOptions.find(o => o.labelEn === val);
                            if (opt) form.setValue("religionBn", opt.labelBn, { shouldValidate: true });
                        }} value={field.value || ""}>
                        <FormControl>
                            <SelectTrigger className="h-12 bg-white border border-primary/10 rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-outline/5">
                            {religionOptions.map((v) => (
                            <SelectItem key={v.value} value={v.labelEn} className="font-bold text-sm">{v.labelEn}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage className="text-xs font-bold" />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="maritalStatusEn"
                    render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                        <Heart className="w-3.5 h-3.5" /> Marital Status (English)
                        </FormLabel>
                        <Select onValueChange={(val) => {
                            field.onChange(val);
                            const opt = maritalStatusOptions.find(o => o.labelEn === val);
                            if (opt) form.setValue("maritalStatusBn", opt.labelBn, { shouldValidate: true });
                        }} value={field.value || ""}>
                        <FormControl>
                            <SelectTrigger className="h-12 bg-white border border-primary/10 rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-outline/5">
                            {maritalStatusOptions.map((v) => (
                            <SelectItem key={v.value} value={v.labelEn} className="font-bold text-sm">{v.labelEn}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage className="text-xs font-bold" />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="residentStatusEn"
                    render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                        <Building className="w-3.5 h-3.5" /> Resident Status (English)
                        </FormLabel>
                        <Select onValueChange={(val) => {
                            field.onChange(val);
                            const opt = residentStatusOptions.find(o => o.labelEn === val);
                            if (opt) form.setValue("residentStatusBn", opt.labelBn, { shouldValidate: true });
                        }} value={field.value || ""}>
                        <FormControl>
                            <SelectTrigger className="h-12 bg-white border border-primary/10 rounded-2xl px-4 focus:ring-2 focus:ring-primary/40 font-bold w-full text-sm">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-outline/5">
                            {residentStatusOptions.map((v) => (
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
      </div>

      {/* SECTION 3: Occupation & Education */}
      <div className="space-y-6">
        <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
            <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                <Briefcase className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-black text-on-surface tracking-tight">
                    পেশা ও শিক্ষা
                </h2>
                <p className="text-xs text-on-surface-variant font-medium italic">পেশাগত ও শিক্ষাগত তথ্যাবলি</p>
            </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="occupationBn"
                    render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                        <Briefcase className="w-3.5 h-3.5" /> পেশা <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                        <Input
                            placeholder="উদা: চাকুরিজীবী, কৃষক"
                            className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm"
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
                    name="educationalQualificationBn"
                    render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                        <GraduationCap className="w-3.5 h-3.5" /> শিক্ষাগত যোগ্যতা
                        </FormLabel>
                        <FormControl>
                        <Input
                            placeholder="উদা: এসএসসি, এইচএসসি"
                            className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm"
                            {...field}
                            value={field.value || ""}
                        />
                        </FormControl>
                        <FormMessage className="text-xs font-bold" />
                    </FormItem>
                    )}
                />
            </div>
        </div>

        {isEnglishEnabled && (
            <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-primary tracking-tight">Occupation & Education (English)</h2>
                        <p className="text-xs text-on-surface-variant font-medium italic">Professional details in English</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="occupationEn"
                        render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                            <Briefcase className="w-3.5 h-3.5" /> Occupation (English)
                            </FormLabel>
                            <FormControl>
                            <Input
                                placeholder="e.g., Service, Farmer"
                                className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
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
                        name="educationalQualificationEn"
                        render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                            <GraduationCap className="w-3.5 h-3.5" /> Educational Qualification (English)
                            </FormLabel>
                            <FormControl>
                            <Input
                                placeholder="e.g., SSC, HSC"
                                className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                                {...field}
                                value={field.value || ""}
                            />
                            </FormControl>
                            <FormMessage className="text-xs font-bold" />
                        </FormItem>
                        )}
                    />
                </div>
            </div>
        )}
      </div>
    </section>
  );
};
