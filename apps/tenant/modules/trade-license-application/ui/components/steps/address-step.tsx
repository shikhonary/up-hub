"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UseFormReturn,
} from "@workspace/ui/components/form";
import { MapPin, Globe, Home, AlertCircle } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { TradeLicenseApplicationFormValues } from "@workspace/schema";
import { useEffect } from "react";
import { enToBnNumber, bnToEnNumber } from "@workspace/utils";
import { Card } from "@workspace/ui/components/card";
import { useTenantPostOffices, useWardsForSelection } from "@workspace/api-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface AddressStepProps {
  form: UseFormReturn<TradeLicenseApplicationFormValues>;
  isEnglishEnabled?: boolean;
}

export const AddressStep = ({ form, isEnglishEnabled }: AddressStepProps) => {
  const sameAsPresent = form.watch("permanentIsSameAsPresent");
  const { data: postOffices = [] } = useTenantPostOffices();
  const { data: wards = [] } = useWardsForSelection();

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (value.permanentIsSameAsPresent && name?.startsWith("present")) {
        form.setValue("permanentIsSameAsPresent", false);
      }

      if (name === "permanentIsSameAsPresent" && value.permanentIsSameAsPresent) {
        form.setValue("permanentVillageBn", value.presentVillageBn || "", { shouldValidate: true });
        form.setValue("permanentVillageEn", value.presentVillageEn || "");
        form.setValue("permanentRoadBlockBn", value.presentRoadBlockBn || "");
        form.setValue("permanentRoadBlockEn", value.presentRoadBlockEn || "");
        form.setValue("permanentHoldingNoBn", value.presentHoldingNoBn || "");
        form.setValue("permanentHoldingNoEn", value.presentHoldingNoEn || "");
        form.setValue("permanentWardNo", value.presentWardNo || 0, { shouldValidate: true });
        form.setValue("permanentPostOfficeBn", value.presentPostOfficeBn || "", { shouldValidate: true });
        form.setValue("permanentPostOfficeEn", value.presentPostOfficeEn || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const AddressSection = ({
    type,
    title,
    isEnglish,
    disabled,
  }: {
    type: "present" | "permanent" | "business";
    title: string;
    isEnglish?: boolean;
    disabled?: boolean;
  }) => {
    const prefix = type;
    const suffix = isEnglish ? "En" : "Bn";
    const labelSuffix = isEnglish ? "(English)" : "(বাংলা)";

    return (
      <div
        className={`${isEnglish
          ? "bg-primary/[0.02] border-primary/10 shadow-sm"
          : "bg-white border-slate-100 shadow-ambient"
          } rounded-[32px] p-8 border space-y-8 animate-in fade-in slide-in-from-top-4 duration-500`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${isEnglish
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-slate-50 text-slate-600 border-slate-100"
              }`}
          >
            {isEnglish ? <Globe className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
          </div>
          <div>
            <h2
              className={`text-xl font-black tracking-tight ${isEnglish ? "text-primary" : "text-slate-800"
                }`}
            >
              {title}
            </h2>
            <p className="text-xs text-slate-500 font-medium italic">
              {isEnglish ? "Enter address in English" : "ঠিকানা বাংলায় প্রদান করুন"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name={`${prefix}Village${suffix}` as any}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-70 ${isEnglish ? "text-primary" : "text-slate-500"
                    }`}
                >
                  গ্রাম/মহল্লা {labelSuffix} <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={disabled}
                    placeholder={isEnglish ? "Ex: Village Name" : "গ্রামের নাম লিখুন"}
                    className={`h-12 border-none rounded-2xl px-4 font-bold text-sm ${isEnglish ? "bg-white border border-primary/10" : "bg-slate-50"
                      }`}
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
            name={`${prefix}RoadBlock${suffix}` as any}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-70 ${isEnglish ? "text-primary" : "text-slate-500"
                    }`}
                >
                  রোড/ব্লক {labelSuffix}
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={disabled}
                    placeholder={isEnglish ? "Ex: Road No 5" : "রোড বা ব্লক লিখুন"}
                    className={`h-12 border-none rounded-2xl px-4 font-bold text-sm ${isEnglish ? "bg-white border border-primary/10" : "bg-slate-50"
                      }`}
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
            name={`${prefix}HoldingNo${suffix}` as any}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-70 ${isEnglish ? "text-primary" : "text-slate-500"
                    }`}
                >
                  <Home className="w-3.5 h-3.5" /> হোল্ডিং নম্বর {labelSuffix}
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={disabled}
                    placeholder={isEnglish ? "Ex: 123" : "হোল্ডিং নম্বর লিখুন"}
                    className={`h-12 border-none rounded-2xl px-4 font-bold text-sm ${isEnglish ? "bg-white border border-primary/10" : "bg-slate-50"
                      }`}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      if (isEnglish) {
                        form.setValue(`${prefix}HoldingNoBn` as any, enToBnNumber(val));
                      } else {
                        form.setValue(`${prefix}HoldingNoEn` as any, bnToEnNumber(val));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${prefix}WardNo` as any}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-70 ${
                    isEnglish ? "text-primary" : "text-slate-500"
                  }`}
                >
                  {isEnglish ? "Ward Number (English)" : "ওয়ার্ড নম্বর (বাংলা)"} <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    disabled={disabled}
                    onValueChange={(val) => field.onChange(parseInt(bnToEnNumber(val)) || 0)}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <SelectTrigger
                      className={`w-full h-12 border-none rounded-2xl px-4 font-bold text-sm text-left ${
                        isEnglish ? "bg-white border border-primary/10" : "bg-slate-50"
                      }`}
                    >
                      <SelectValue placeholder={isEnglish ? "Select Ward" : "ওয়ার্ড নম্বর নির্বাচন করুন"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-outline/5 max-h-60">
                      {wards.map((ward: any) => (
                        <SelectItem key={ward.id} value={ward.name} className="font-bold text-sm">
                          {isEnglish ? ward.name : ward.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name={`${prefix}PostOffice${suffix}` as any}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel
                  className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-70 ${isEnglish ? "text-primary" : "text-slate-500"
                    }`}
                >
                  ডাকঘর {labelSuffix} <span className="text-rose-500">*</span>
                </FormLabel>
                <Select disabled={disabled} onValueChange={(val) => {
                  field.onChange(val);
                  const po = postOffices.find(p => p.name === val || p.nameBn === val);
                  if (po) {
                    if (isEnglish) {
                      form.setValue(`${prefix}PostOfficeBn` as any, po.nameBn, { shouldValidate: true });
                    } else {
                      form.setValue(`${prefix}PostOfficeEn` as any, po.name, { shouldValidate: true });
                    }
                  }
                }} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`w-full h-12 border-none rounded-2xl px-4 font-bold text-sm text-left ${isEnglish ? "bg-white border border-primary/10" : "bg-slate-50"}`}>
                      <SelectValue placeholder={isEnglish ? "Select Post Office" : "ডাকঘর নির্বাচন করুন"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-outline/5 max-h-60">
                    {postOffices.map((po) => (
                      <SelectItem key={po.id} value={isEnglish ? po.name : po.nameBn} className="font-bold text-sm">
                        {isEnglish ? po.name : po.nameBn} - {po.postCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-500" />
        <p className="text-sm font-bold text-rose-600">লাল তারকা (*) চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে</p>
      </div>

      {/* Present Address */}
      <div className="space-y-6">
        <AddressSection type="present" title="বর্তমান ঠিকানা (বাংলা)" />
        {isEnglishEnabled && (
          <AddressSection type="present" title="Present Address (English)" isEnglish />
        )}
      </div>

      {/* Same as present checkbox */}
      <Card className="p-6 bg-slate-50 border-none rounded-[24px] flex items-center gap-4 group hover:bg-primary/5 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <Checkbox
            id="permanentIsSameAsPresent"
            checked={sameAsPresent}
            onCheckedChange={(checked) =>
              form.setValue("permanentIsSameAsPresent", checked as boolean)
            }
            className="w-6 h-6 rounded-lg border-2 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label
            htmlFor="permanentIsSameAsPresent"
            className="text-sm font-black text-slate-700 cursor-pointer select-none"
          >
            বর্তমান ঠিকানা ও স্থায়ী ঠিকানা একই
          </label>
        </div>
      </Card>

      {/* Permanent Address */}
      <div className={`space-y-6 transition-all duration-300 ${sameAsPresent ? "opacity-60 pointer-events-none" : ""}`}>
        <AddressSection type="permanent" title="স্থায়ী ঠিকানা (বাংলা)" disabled={sameAsPresent} />
        {isEnglishEnabled && (
          <AddressSection type="permanent" title="Permanent Address (English)" isEnglish disabled={sameAsPresent} />
        )}
      </div>

      {/* Business Address */}
      <div className="space-y-6">
        <AddressSection type="business" title="ব্যবসার ঠিকানা (বাংলা)" />
        {isEnglishEnabled && (
          <AddressSection type="business" title="Business Address (English)" isEnglish />
        )}
      </div>
    </section>
  );
};
