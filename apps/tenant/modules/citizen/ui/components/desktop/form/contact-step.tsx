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
    Phone,
    Mail,
    Clipboard,
    Globe,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { CitizenApplicationFormValues } from "@workspace/schema";
import { enToBnNumber, bnToEnNumber } from "@workspace/utils";

interface ContactStepProps {
    form: UseFormReturn<CitizenApplicationFormValues>;
    isEnglishEnabled?: boolean;
}

export const ContactStep = ({ form, isEnglishEnabled }: ContactStepProps) => {
    return (
        <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
            {/* 1. Primary Contact Section (Bengali Card) */}
            <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                        <Phone className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-on-surface tracking-tight">
                            যোগাযোগের তথ্য
                        </h2>
                        <p className="text-xs text-on-surface-variant font-medium italic">
                            আবেদনকারীর মোবাইল এবং ইমেইল তথ্যাবলি
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                                    <Phone className="w-3.5 h-3.5" /> মোবাইল নম্বর <span className="text-rose-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="উদা: ০১৭১২৩৪৫৬৭৮"
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
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                                    <Mail className="w-3.5 h-3.5" /> ইমেইল ঠিকানা
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="উদা: citizen@example.com"
                                        className="h-12 bg-surface-container-low border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
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

            {/* 2. Contact Section (English Card) */}
            {isEnglishEnabled && (
                <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/10">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest">Contact Information (English)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="flex items-center gap-1.5 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                                        <Phone className="w-3.5 h-3.5" /> Mobile Number (English)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., 01712345678"
                                            className="h-12 bg-white border border-primary/10 rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-primary/40 transition-all font-bold w-full text-sm"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs font-bold" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            )}

            {/* 3. Comments Section (Bengali Card) */}
            <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                        <Clipboard className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">অতিরিক্ত মন্তব্য</h3>
                </div>
                <FormField
                    control={form.control}
                    name="commentsBn"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormControl>
                                <Input
                                    placeholder="যেকোনো প্রয়োজনীয় তথ্য লিখুন"
                                    className="h-14 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm"
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage className="text-xs font-bold" />
                        </FormItem>
                    )}
                />
            </div>

            {/* 4. Comments Section (English Card) */}
            {isEnglishEnabled && (
                <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/10">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest">Additional Comments (English)</h3>
                    </div>
                    <FormField
                        control={form.control}
                        name="commentsEn"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormControl>
                                    <Input
                                        placeholder="Any relevant information in English"
                                        className="h-14 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs font-bold" />
                            </FormItem>
                        )}
                    />
                </div>
            )}
        </section>
    );
};
