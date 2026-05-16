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
  MapPin,
  Building2,
  Users,
  Baby,
  Activity,
  Briefcase,
  TrendingUp,
  Droplets,
  Zap,
  ShieldCheck,
  Building,
  Home,
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
import { Switch } from "@workspace/ui/components/switch";
import { enToBnNumber, bnToEnNumber } from "@workspace/utils";
import { useWardsForSelection, useVillagesForSelection } from "@workspace/api-client";

interface SurveyStepProps {
  form: UseFormReturn<AssessmentApplicationFormValues>;
  type: "location" | "survey";
}

export const SurveyStep = ({ form, type }: SurveyStepProps) => {
  const { data: wards = [] } = useWardsForSelection();
  const { data: villages = [] } = useVillagesForSelection();

  if (type === "location") {
    return (
      <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-on-surface tracking-tight">ঠিকানা ও হোল্ডিং তথ্য</h2>
              <p className="text-xs text-on-surface-variant font-medium italic">স্থায়ী ঠিকানা ও এসেসমেন্ট হোল্ডিং নম্বর</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="holdingNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Building2 className="w-3.5 h-3.5" /> হোল্ডিং/এসেসমেন্ট নং <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder="উদা: ১৫০/ক"
                      className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm"
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
              name="wardNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <MapPin className="w-3.5 h-3.5" /> ওয়ার্ড নং <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString() || ""}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl">
                      {wards.map((w) => (
                        <SelectItem key={w.id} value={w.name} className="font-bold text-sm">ওয়ার্ড - {enToBnNumber(w.name)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="villageBn"
              render={({ field }) => {
                const selectedWardNo = form.watch("wardNo");
                const selectedWard = wards.find(w => w.name === selectedWardNo?.toString());
                const filteredVillages = selectedWard 
                  ? villages.filter(v => v.wardId === selectedWard.id)
                  : villages;

                return (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                      <Building className="w-3.5 h-3.5" /> গ্রাম/মহল্লা <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ""}
                      key={selectedWardNo} // Re-render when ward changes
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm">
                          <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl">
                        {filteredVillages.map((v) => (
                          <SelectItem key={v.id} value={v.displayName} className="font-bold text-sm">{v.displayName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-bold" />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="postOfficeBn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    ডাকঘর <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ডাকঘর লিখুন"
                      className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="upazilaBn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    উপজেলা/থানা <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="districtBn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    জেলা <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* SECTION: Household Demographics */}
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-on-surface tracking-tight">খানার তথ্য (জনমিতি)</h2>
            <p className="text-xs text-on-surface-variant font-medium italic">পরিবারের সদস্য সংখ্যা ও বৈশিষ্ট্য</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "maleCount", label: "পুরুষ সংখ্যা", icon: Users, required: true },
            { name: "femaleCount", label: "মহিলা সংখ্যা", icon: Users, required: true },
            { name: "childCount", label: "শিশু সংখ্যা", icon: Baby },
            { name: "disabledCount", label: "প্রতিবন্ধী সংখ্যা", icon: Activity },
            { name: "earningMembers", label: "উপার্জনক্ষম সদস্য", icon: Briefcase },
            { name: "dependentMembers", label: "নির্ভরশীল সদস্য", icon: Users },
            { name: "remittanceSenders", label: "প্রবাসী সংখ্যা", icon: TrendingUp },
            { name: "jobSeekersSscPlus", label: "বেকার (এসএসসি+)", icon: Users },
            { name: "entrepreneurSeekersSscPlus", label: "উদ্যোক্তা হতে ইচ্ছুক", icon: Briefcase },
          ].map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name as any}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <item.icon className="w-3.5 h-3.5" /> {item.label} {item.required && <span className="text-rose-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm"
                      {...field}
                      value={enToBnNumber(field.value?.toString()) || ""}
                      onChange={(e) => field.onChange(parseInt(bnToEnNumber(e.target.value)) || 0)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      {/* SECTION: Social & Utilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-on-surface">সুযোগ-সুবিধা ও নিরাপত্তা</h3>
          </div>

          <div className="space-y-4">
            {[
              { name: "hasTubewell", label: "নিজস্ব নলকূপ আছে?", icon: Droplets },
              { name: "hasUtilities", label: "বিদ্যুৎ/মোবাইল সংযোগ আছে?", icon: Zap },
              { name: "isSocialSafetyNetCovered", label: "সামাজিক নিরাপত্তা আওতায়?", icon: ShieldCheck },
            ].map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name as any}
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-on-surface-variant">{item.label}</span>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-5 h-5 text-primary" />
            <h3 className="font-black text-on-surface">আবাসনের তথ্য</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "multiStoriedBuildingCount", label: "বহুতল ভবন" },
              { name: "pakaBuildingCount", label: "পাকা ভবন" },
              { name: "semiPakaBuildingCount", label: "আধাপাকা" },
              { name: "tinShedCount", label: "টিনশেড" },
              { name: "kachaHouseCount", label: "কাঁচা ঘর" },
            ].map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name as any}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black uppercase text-on-surface-variant opacity-60 tracking-wider">
                      {item.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        className="h-10 bg-surface-container-low border-none rounded-xl px-4 font-bold w-full text-xs"
                        {...field}
                        value={enToBnNumber(field.value?.toString()) || ""}
                        onChange={(e) => field.onChange(parseInt(bnToEnNumber(e.target.value)) || 0)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
