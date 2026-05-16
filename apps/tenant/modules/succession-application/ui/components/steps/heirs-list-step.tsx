"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
  useFieldArray,
} from "@workspace/ui/components/form";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { SuccessionApplicationFormValues } from "@workspace/schema";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";

interface HeirsListStepProps {
  form: UseFormReturn<SuccessionApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const HeirsListStep = ({ form, isEnglishEnabled }: HeirsListStepProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "heirs",
  });

  return (
    <section className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-on-surface tracking-tight">উত্তরাধিকারীগণের তালিকা</h2>
              <p className="text-xs text-on-surface-variant font-medium italic">মৃত ব্যক্তির সকল বৈধ উত্তরাধিকারীদের তথ্য যোগ করুন</p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => append({ serialNo: fields.length + 1, heirNameBn: "", heirNameEn: "", relationBn: "", relationEn: "", ageDobDod: "", idNo: "", maritalStatus: "UNMARRIED", isAlive: "YES" })}
            className="h-12 px-6 rounded-2xl bg-primary text-white shadow-glow hover:scale-[1.02] active:scale-95 transition-all font-black gap-2"
          >
            <UserPlus className="w-5 h-5" /> নতুন উত্তরাধিকারী যোগ করুন
          </Button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-8 border border-slate-100 shadow-sm rounded-[24px] relative group hover:border-primary/20 transition-all">
              <div className="absolute top-6 right-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="w-10 h-10 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                  disabled={fields.length === 1}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                  {index + 1}
                </div>
                <h3 className="font-black text-on-surface">উত্তরাধিকারী {index + 1}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FormField
                  control={form.control}
                  name={`heirs.${index}.heirNameBn`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                        উত্তরাধিকারীর নাম (বাংলা) <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="নাম লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                {isEnglishEnabled && (
                  <FormField
                    control={form.control}
                    name={`heirs.${index}.heirNameEn`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                          Heir Name (English)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold text-sm" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`heirs.${index}.relationBn`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                        সম্পর্ক (বাংলা) <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="যেমন: ছেলে, মেয়ে" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                {isEnglishEnabled && (
                  <FormField
                    control={form.control}
                    name={`heirs.${index}.relationEn`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                          Relation (English)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Son, Daughter" className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold text-sm" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`heirs.${index}.ageDobDod`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                        বয়স/জন্ম তারিখ <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="বয়স বা জন্ম তারিখ" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`heirs.${index}.idNo`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                        এনআইডি/জন্ম নিবন্ধন
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="নম্বর লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`heirs.${index}.maritalStatus`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                        বৈবাহিক অবস্থা
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="w-full h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm text-left">
                            <SelectValue placeholder="নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-outline/5">
                          <SelectItem value="MARRIED" className="font-bold text-sm">বিবাহিত</SelectItem>
                          <SelectItem value="UNMARRIED" className="font-bold text-sm">অবিবাহিত</SelectItem>
                          <SelectItem value="WIDOWED" className="font-bold text-sm">বিধবা/বিপত্নীক</SelectItem>
                          <SelectItem value="DIVORCED" className="font-bold text-sm">ডিভোর্সড</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`heirs.${index}.isAlive`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                        জীবিত কি না?
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="w-full h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm text-left">
                            <SelectValue placeholder="নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-outline/5">
                          <SelectItem value="YES" className="font-bold text-sm">হ্যাঁ</SelectItem>
                          <SelectItem value="NO" className="font-bold text-sm">না (মৃত)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
