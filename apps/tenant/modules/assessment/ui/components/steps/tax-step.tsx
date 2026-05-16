"use client";

import { useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import {
  Calculator,
  Percent,
  Wallet,
  Info,
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
import { enToBnNumber, bnToEnNumber } from "@workspace/utils";

interface TaxStepProps {
  form: UseFormReturn<AssessmentApplicationFormValues>;
}

export const TaxStep = ({ form }: TaxStepProps) => {
  const annualValuation = form.watch("annualValuation");
  const taxRatePercent = form.watch("taxRatePercent");

  useEffect(() => {
    const total = (annualValuation || 0) * ((taxRatePercent || 0) / 100);
    form.setValue("totalTax", Math.round(total), { shouldValidate: true });
  }, [annualValuation, taxRatePercent, form]);

  const taxRates = [
    { value: 7, label: "৭% (সাধারণ হার)" },
    { value: 5, label: "৫% (বিশেষ হার)" },
    { value: 3, label: "৩% (ন্যূনতম হার)" },
  ];

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-on-surface tracking-tight">কর নির্ধারণ</h2>
            <p className="text-xs text-on-surface-variant font-medium italic">বার্ষিক মূল্যায়ন ও প্রযোজ্য করের হিসাব</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="annualValuation"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    বার্ষিক মূল্যায়ন (টাকা) <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        inputMode="numeric"
                        placeholder="মূল্যায়ন লিখুন"
                        className="h-14 bg-surface-container-low border-none rounded-2xl px-6 focus-visible:ring-2 focus-visible:ring-primary font-bold text-lg w-full"
                        {...field}
                        value={enToBnNumber(field.value?.toString()) || ""}
                        onChange={(e) => field.onChange(parseFloat(bnToEnNumber(e.target.value)) || 0)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-bold">৳</div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxRatePercent"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Percent className="w-3.5 h-3.5" /> করের হার (%) <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select 
                    onValueChange={(val) => field.onChange(parseInt(val))} 
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-14 bg-surface-container-low border-none rounded-2xl px-6 font-bold text-lg w-full">
                        <SelectValue placeholder="হার নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl">
                      {taxRates.map((rate) => (
                        <SelectItem key={rate.value} value={rate.value.toString()} className="font-bold text-base py-3 px-4">
                          {rate.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-2xl" />
            <div className="relative bg-white rounded-[32px] p-8 border-2 border-primary/20 shadow-glow flex flex-col items-center text-center space-y-6 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Calculator className="w-20 h-20 rotate-12" />
                </div>
                
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Wallet className="w-8 h-8" />
                </div>
                
                <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">মোট ধার্যকৃত কর</p>
                    <h1 className="text-5xl font-black text-primary tracking-tighter">
                        ৳{enToBnNumber(form.watch("totalTax")?.toString() || "০")}
                    </h1>
                </div>
                
                <div className="w-full h-px bg-slate-100" />
                
                <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant opacity-60 italic">
                    <Info className="w-3 h-3" />
                    বার্ষিক মূল্যায়ন এর {enToBnNumber(taxRatePercent?.toString() || "৭")}% হিসেবে হিসাব করা হয়েছে
                </div>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem className="space-y-2 mt-8">
              <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                মন্তব্য (যদি থাকে)
              </FormLabel>
              <FormControl>
                <textarea
                  placeholder="অতিরিক্ত কোনো তথ্য বা বিশেষ নির্দেশনা..."
                  className="min-h-[100px] bg-surface-container-low border-none rounded-2xl p-4 font-bold w-full text-sm resize-none focus:ring-2 focus:ring-primary/40 transition-all"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage className="text-xs font-bold" />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
};
