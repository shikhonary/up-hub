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
  Briefcase,
  Layers,
  FileText,
  DollarSign,
  Maximize,
  Phone,
  Mail,
  UserCircle,
  Globe,
  CalendarIcon,
  AlertCircle,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { TradeLicenseApplicationFormValues } from "@workspace/schema";
import { useTradeLicenseCategories } from "@workspace/api-client";
import { enToBnNumber, bnToEnNumber } from "@workspace/utils";

interface BusinessDetailsStepProps {
  form: UseFormReturn<TradeLicenseApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const BusinessDetailsStep = ({ form, isEnglishEnabled }: BusinessDetailsStepProps) => {
  const { data: categories } = useTradeLicenseCategories();

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
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-on-surface tracking-tight">ব্যবসার বিস্তারিত ও যোগাযোগ (বাংলা)</h2>
            <p className="text-xs text-on-surface-variant font-medium italic">ব্যবসার ধরন, মূলধন ও আবেদনকারীর যোগাযোগের তথ্য বাংলায় দিন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="tradeLicenseCategoryId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Layers className="w-3.5 h-3.5" /> ব্যবসার ধরন <span className="text-rose-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm text-left w-full">
                      <SelectValue placeholder="নির্বাচন করুন" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5">
                    {categories?.data?.items.map((v: any) => (
                      <SelectItem key={v.id} value={v.id} className="font-bold text-sm">{v.typeBn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessStartDate"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Briefcase className="w-3.5 h-3.5" /> ব্যবসার শুরুর তারিখ
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
                        {field.value ? format(field.value, "PPP") : <span>তারিখ নির্বাচন করুন</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-outline/5 rounded-2xl" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
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
            name="paidUpCapital"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <DollarSign className="w-3.5 h-3.5" /> পরিশোধিত মূলধন
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="টাকায় লিখুন"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm"
                    {...field}
                    value={enToBnNumber(field.value) || ""}
                    onChange={(e) => field.onChange(parseFloat(bnToEnNumber(e.target.value)) || 0)}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="signboardSize"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Maximize className="w-3.5 h-3.5" /> সাইনবোর্ড সাইজ (বর্গফুট)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="বর্গফুট লিখুন"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm"
                    {...field}
                    value={enToBnNumber(field.value) || ""}
                    onChange={(e) => field.onChange(parseFloat(bnToEnNumber(e.target.value)) || 0)}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vatIdBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <FileText className="w-3.5 h-3.5" /> ভ্যাট আইডি (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="ভ্যাট নম্বর"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      form.setValue("vatIdEn", bnToEnNumber(val), { shouldValidate: true });
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxIdBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <FileText className="w-3.5 h-3.5" /> ট্যাক্স আইডি (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="ট্যাক্স নম্বর"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      form.setValue("taxIdEn", bnToEnNumber(val), { shouldValidate: true });
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ownershipStatusBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  মালিকানার অবস্থা (বাংলা)
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                    className="flex items-center gap-6 h-12"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="নিজস্ব" />
                      </FormControl>
                      <FormLabel className="font-bold text-sm cursor-pointer">
                        নিজস্ব
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ভাড়া" />
                      </FormControl>
                      <FormLabel className="font-bold text-sm cursor-pointer">
                        ভাড়া
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <div className="md:col-span-full pt-6 border-t border-slate-100">
            <h3 className="text-sm font-black text-on-surface mb-6 uppercase tracking-wider opacity-60 flex items-center gap-2">
              <Phone className="w-4 h-4" /> আবেদনকারীর যোগাযোগের তথ্য (বাংলা)
            </h3>
          </div>

          <FormField
            control={form.control}
            name="applicantNameBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <UserCircle className="w-3.5 h-3.5" /> আবেদনকারীর নাম (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="আবেদনকারীর নাম লিখুন"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobileBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Phone className="w-3.5 h-3.5" /> মোবাইল নম্বর (বাংলা) <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="উদা: ০১৭..."
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      form.setValue("mobileEn", bnToEnNumber(val), { shouldValidate: true });
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneBn"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Phone className="w-3.5 h-3.5" /> ফোন নম্বর (বাংলা)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="উদা: ০২..."
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      form.setValue("phoneEn", bnToEnNumber(val), { shouldValidate: true });
                    }}
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
                <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                  <Mail className="w-3.5 h-3.5" /> ইমেইল ঠিকানা
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@mail.com"
                    className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold text-sm"
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

      {/* English Section */}
      {isEnglishEnabled && (
        <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary tracking-tight">Business & Contact Info (English)</h2>
              <p className="text-xs text-on-surface-variant font-medium italic">Contact details in English</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="vatIdEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <FileText className="w-3.5 h-3.5" /> VAT ID (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VAT Number"
                      className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold text-sm"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        form.setValue("vatIdBn", enToBnNumber(val), { shouldValidate: true });
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxIdEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <FileText className="w-3.5 h-3.5" /> Tax ID (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tax Number"
                      className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold text-sm"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        form.setValue("taxIdBn", enToBnNumber(val), { shouldValidate: true });
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownershipStatusEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    Ownership Status (English)
                  </FormLabel>
                  <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                    className="flex items-center gap-6 h-12"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Own" />
                      </FormControl>
                      <FormLabel className="font-bold text-sm cursor-pointer text-primary">
                        Own
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Rented" />
                      </FormControl>
                      <FormLabel className="font-bold text-sm cursor-pointer text-primary">
                        Rented
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicantNameEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <UserCircle className="w-3.5 h-3.5" /> Applicant Name (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter applicant name"
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
              name="mobileEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Phone className="w-3.5 h-3.5" /> Mobile Number (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 017..."
                      className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        form.setValue("mobileBn", enToBnNumber(val), { shouldValidate: true });
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneEn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Phone className="w-3.5 h-3.5" /> Phone Number (English)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 02..."
                      className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        form.setValue("phoneBn", enToBnNumber(val), { shouldValidate: true });
                      }}
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
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@mail.com"
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
    </section>
  );
};
