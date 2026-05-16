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
import { useEffect } from "react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Card } from "@workspace/ui/components/card";

interface AddressStepProps {
  form: UseFormReturn<SuccessionApplicationFormValues>;
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
        form.setValue("permanentRoadBlockSectorBn", value.presentRoadBlockSectorBn || "");
        form.setValue("permanentRoadBlockSectorEn", value.presentRoadBlockSectorEn || "");
        form.setValue("permanentHoldingNo", value.presentHoldingNo || "");
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
    type: "present" | "permanent";
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
          ? "bg-primary/[0.02] border-primary/10 shadow-ambient"
          : "bg-surface-container-lowest border-outline/5 shadow-ambient"
          } rounded-[32px] p-8 border space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${isEnglish
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-primary/10 text-primary border-primary/20"
              }`}
          >
            {isEnglish ? <Globe className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
          </div>
          <div>
            <h2
              className={`text-xl font-black tracking-tight ${isEnglish ? "text-primary" : "text-on-surface"
                }`}
            >
              {title}
            </h2>
            <p className="text-xs text-on-surface-variant font-medium italic">
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
                  className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-70 ${isEnglish ? "text-primary" : "text-on-surface"
                    }`}
                >
                  গ্রাম/মহল্লা {labelSuffix} <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={disabled}
                    placeholder={isEnglish ? "Ex: Village Name" : "গ্রামের নাম লিখুন"}
                    className={`h-12 border-none rounded-2xl px-4 font-bold text-sm ${isEnglish ? "bg-white border border-primary/10" : "bg-surface-container-low"
                      }`}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          {!isEnglish && (
            <FormField
              control={form.control}
              name={`${prefix}HoldingNo` as any}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel
                    className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-70 text-on-surface`}
                  >
                    <Home className="w-3.5 h-3.5" /> হোল্ডিং নম্বর
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={disabled}
                      placeholder="হোল্ডিং নম্বর লিখুন"
                      className={`h-12 border-none rounded-2xl px-4 font-bold text-sm bg-surface-container-low`}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />
          )}

          {!isEnglish && (
            <FormField
              control={form.control}
              name={`${prefix}WardNo` as any}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel
                    className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-70 text-on-surface`}
                  >
                    ওয়ার্ড নম্বর (বাংলা) <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={disabled}
                      onValueChange={(val) => field.onChange(parseInt(bnToEnNumber(val)) || 0)}
                      value={field.value ? field.value.toString() : ""}
                    >
                      <SelectTrigger
                        className={`w-full h-12 border-none rounded-2xl px-4 font-bold text-sm text-left bg-surface-container-low`}
                      >
                        <SelectValue placeholder="ওয়ার্ড নম্বর নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-outline/5 max-h-60">
                        {wards.map((ward: any) => (
                          <SelectItem key={ward.id} value={ward.name} className="font-bold text-sm">
                            {ward.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />
          )}


          {!isEnglish && (
            <FormField
              control={form.control}
              name={`${prefix}PostOffice${suffix}` as any}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel
                    className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-70 ${isEnglish ? "text-primary" : "text-on-surface"
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
                      <SelectTrigger className={`w-full h-12 border-none rounded-2xl px-4 font-bold text-sm text-left ${isEnglish ? "bg-white border border-primary/10" : "bg-surface-container-low"}`}>
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
          )}
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

      {/* Present Address (Applicant) */}
      <div className="space-y-6">
        <AddressSection type="present" title="আবেদনকারীর বর্তমান ঠিকানা (বাংলা)" />
        {isEnglishEnabled && (
          <AddressSection type="present" title="Applicant Present Address (English)" isEnglish />
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
            স্থায়ী ঠিকানা ও বর্তমান ঠিকানা একই
          </label>
        </div>
      </Card>

      {/* Permanent Address (Deceased) */}
      <div className="space-y-6">
        <AddressSection type="permanent" title="স্থায়ী ঠিকানা (মৃত ব্যক্তির) (বাংলা)" disabled={sameAsPresent} />
        {isEnglishEnabled && (
          <AddressSection type="permanent" title="Permanent Address (Deceased) (English)" isEnglish disabled={sameAsPresent} />
        )}
      </div>
    </section>
  );
};
