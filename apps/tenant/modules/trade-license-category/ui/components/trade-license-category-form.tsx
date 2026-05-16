"use client";

import React from "react";
import {
  tradeLicenseCategoryFormSchema,
  type TradeLicenseCategoryFormValues,
} from "@workspace/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Briefcase,
  FileText,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { TRADE_LICENSE_CATEGORIES } from "@workspace/utils";

interface TradeLicenseCategoryFormProps {
  initialData?: Partial<TradeLicenseCategoryFormValues>;
  onSubmit: (values: TradeLicenseCategoryFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export const TradeLicenseCategoryForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: TradeLicenseCategoryFormProps) => {
  const form = useForm<TradeLicenseCategoryFormValues>({
    resolver: zodResolver(tradeLicenseCategoryFormSchema),
    defaultValues: {
      typeEn: initialData?.typeEn || "",
      typeBn: initialData?.typeBn || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Preset Selection Helper */}
        <div className="space-y-2">
          <FormLabel className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
            <Plus className="w-4 h-4 text-primary" />
            দ্রুত নির্বাচন (ঐচ্ছিক)
          </FormLabel>
          <Select
            onValueChange={(value) => {
              const selected = TRADE_LICENSE_CATEGORIES.find((t) => t.labelBn === value);
              if (selected) {
                form.setValue("typeBn", selected.labelBn);
                form.setValue("typeEn", selected.value);
              }
            }}
          >
            <FormControl>
              <SelectTrigger className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all">
                <SelectValue placeholder="তালিকায় থাকা ক্যাটাগরি থেকে বেছে নিন" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white border-slate-100 rounded-xl shadow-xl">
              {TRADE_LICENSE_CATEGORIES.map((type) => (
                <SelectItem 
                  key={type.value} 
                  value={type.labelBn}
                  className="font-bold text-slate-600 focus:bg-primary/5 focus:text-primary rounded-lg"
                >
                  {type.labelBn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] font-medium text-slate-400 italic">
            * আপনি চাইলে সরাসরি নিচের ঘরে নিজের মতো লিখে দিতে পারেন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Bengali */}
          <FormField
            control={form.control}
            name="typeBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                  <Briefcase className="w-4 h-4 text-primary" />
                  ক্যাটাগরি (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="যেমন: পাইকারি ব্যবসা"
                    {...field}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />

          {/* Category English */}
          <FormField
            control={form.control}
            name="typeEn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                  <FileText className="w-4 h-4 text-primary" />
                  ক্যাটাগরি (ইংরেজি)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="যেমন: WHOLESALE_BUSINESS"
                    {...field}
                    className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:font-normal placeholder:text-slate-300"
                  />
                </FormControl>
                <FormMessage className="text-[11px] font-bold text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex items-center gap-2 h-12 px-6 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 bg-slate-50 border-none transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            বাতিল করুন
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-md shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100 border-none"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "create" ? (
              <Plus className="w-4 h-4" strokeWidth={3} />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isLoading
              ? mode === "create"
                ? "তৈরি হচ্ছে..."
                : "সংরক্ষণ হচ্ছে..."
              : mode === "create"
                ? "ক্যাটাগরি তৈরি করুন"
                : "পরিবর্তন সংরক্ষণ করুন"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
