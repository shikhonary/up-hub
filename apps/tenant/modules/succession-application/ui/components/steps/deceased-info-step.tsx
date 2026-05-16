"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { MapPin, CreditCard, Home, Calendar, HeartOff, Phone, Type, Globe, Book } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { SuccessionApplicationFormValues } from "@workspace/schema";
import { useTenantPostOffices, useWardsForSelection } from "@workspace/api-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { bnToEnNumber } from "@workspace/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";
import { Calendar as CalendarComponent } from "@workspace/ui/components/calendar";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { CalendarIcon } from "lucide-react";

interface DeceasedInfoStepProps {
  form: UseFormReturn<SuccessionApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const DeceasedInfoStep = ({ form, isEnglishEnabled }: DeceasedInfoStepProps) => {
  const { data: postOffices = [] } = useTenantPostOffices();
  const { data: wards = [] } = useWardsForSelection();

  return (
    <section className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Bengali Section 1: Deceased Info */}
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <HeartOff className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-on-surface tracking-tight">মৃত ব্যক্তির তথ্য (বাংলা)</h2>
            <p className="text-xs text-on-surface-variant font-medium italic">মৃত ব্যক্তির ব্যক্তিগত ও মৃত্যুর তথ্য বাংলায় প্রদান করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="nameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Type className="w-3.5 h-3.5" /> মৃত ব্যক্তির নাম (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="মৃত ব্যক্তির নাম লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          {/* Death Date */}
          <FormField
            control={form.control}
            name="deathDate"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Calendar className="w-3.5 h-3.5" /> মৃত্যু তারিখ <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant={"outline"}
                        className={cn(
                          "h-12 w-full justify-start text-left font-bold rounded-2xl bg-surface-container-low border-none px-4",
                          !field.value && "text-muted-foreground opacity-70"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(new Date(field.value), "PPP") : <span>তারিখ নির্বাচন করুন</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-outline/5 rounded-2xl" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nidNo"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <CreditCard className="w-3.5 h-3.5" /> এনআইডি নম্বর
                </FormLabel>
                <FormControl>
                  <Input placeholder="এনআইডি নম্বর লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm" {...field} value={field.value || ""} />
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
                  <Input placeholder="পিতার নাম লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm" {...field} />
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
                  <Input placeholder="মাতার নাম লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm" {...field} />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  ধর্ম <span className="text-rose-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm text-left">
                      <SelectValue placeholder="ধর্ম নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    <SelectItem value="ISLAM" className="font-bold text-sm">ইসলাম</SelectItem>
                    <SelectItem value="HINDU" className="font-bold text-sm">হিন্দু</SelectItem>
                    <SelectItem value="CHRISTIAN" className="font-bold text-sm">খ্রিস্টান</SelectItem>
                    <SelectItem value="BUDDHIST" className="font-bold text-sm">বৌদ্ধ</SelectItem>
                    <SelectItem value="OTHERS" className="font-bold text-sm">অন্যান্য</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  লিঙ্গ <span className="text-rose-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm text-left">
                      <SelectValue placeholder="লিঙ্গ নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    <SelectItem value="MALE" className="font-bold text-sm">পুরুষ</SelectItem>
                    <SelectItem value="FEMALE" className="font-bold text-sm">মহিলা</SelectItem>
                    <SelectItem value="THIRD_GENDER" className="font-bold text-sm">তৃতীয় লিঙ্গ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="residentStatus"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  বাসিন্দা স্ট্যাটাস <span className="text-rose-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm text-left">
                      <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    <SelectItem value="PERMANENT" className="font-bold text-sm">স্থায়ী</SelectItem>
                    <SelectItem value="TEMPORARY" className="font-bold text-sm">অস্থায়ী</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  वैবাহিক অবস্থা <span className="text-rose-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm text-left">
                      <SelectValue placeholder="নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    <SelectItem value="MARRIED" className="font-bold text-sm">বিবাহিত</SelectItem>
                    <SelectItem value="UNMARRIED" className="font-bold text-sm">অবিবাহিত</SelectItem>
                    <SelectItem value="DIVORCED" className="font-bold text-sm">ডিভোর্সড</SelectItem>
                    <SelectItem value="WIDOW" className="font-bold text-sm">বিপত্নীক/বিধবা</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* English Section 1: Deceased Info */}
      {isEnglishEnabled && (
        <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary tracking-tight">Deceased Information (English)</h2>
              <p className="text-xs text-on-surface-variant font-medium italic">Identification details in English</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Type className="w-3.5 h-3.5" /> Deceased Name (English)
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
          </div>
        </div>
      )}

    </section>
  );
};
