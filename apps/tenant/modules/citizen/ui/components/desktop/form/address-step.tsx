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
  Map,
  Hash,
  Building,
  Clipboard,
  Languages,
  Globe,
  Navigation,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { CitizenApplicationFormValues } from "@workspace/schema";
import { enToBnNumber, bnToEnNumber } from "@workspace/utils";

interface AddressStepProps {
  form: UseFormReturn<CitizenApplicationFormValues>;
  wards: any[];
  villages: any[];
  isEnglishEnabled?: boolean;
}

export const AddressStep = ({ form, wards, villages, isEnglishEnabled }: AddressStepProps) => {
  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
      {/* 1. Present Address Section (Bengali) */}
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            <MapPin className="w-6 h-6" />
            </div>
            <div>
            <h2 className="text-xl font-black text-on-surface tracking-tight">
                বর্তমান ঠিকানা
            </h2>
            <p className="text-xs text-on-surface-variant font-medium italic">
                যোগাযোগের জন্য বর্তমান ঠিকানার বিবরণ
            </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="presentWardNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Hash className="w-3.5 h-3.5" /> ওয়ার্ড নং <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full focus:ring-2 focus:ring-primary/40 text-sm">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                      {wards.map((w) => (
                        <SelectItem key={w.id} value={w.name.toString()} className="font-bold text-sm">
                          ওয়ার্ড নং {enToBnNumber(w.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />
            
            <FormField
                control={form.control}
                name="presentVillageBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Map className="w-3.5 h-3.5" /> গ্রাম <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select 
                        onValueChange={(val) => {
                            field.onChange(val);
                            const village = villages.find(v => v.displayName === val);
                            if (village && village.name) {
                                form.setValue("presentVillageEn", village.name, { shouldValidate: true });
                            }
                        }} 
                        value={field.value || ""}
                    >
                    <FormControl>
                        <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full focus:ring-2 focus:ring-primary/40 text-sm">
                        <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                        {villages.map((v) => (
                        <SelectItem key={v.id} value={v.displayName} className="font-bold text-sm">{v.displayName}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="presentRoadBlockSectorBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Navigation className="w-3.5 h-3.5" /> রাস্তা/ব্লক/সেক্টর
                    </FormLabel>
                    <FormControl>
                    <Input placeholder="রাস্তা/ব্লক/সেক্টর লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="presentPostOfficeBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Building className="w-3.5 h-3.5" /> ডাকঘর <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                    <Input placeholder="ডাকঘর লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="presentUpazilaBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <MapPin className="w-3.5 h-3.5" /> উপজেলা <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                    <Input placeholder="উপজেলা লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />
            
            <FormField
                control={form.control}
                name="presentDistrictBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <MapPin className="w-3.5 h-3.5" /> জেলা <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                    <Input placeholder="জেলা লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />

            <FormField
              control={form.control}
              name="presentHoldingNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Hash className="w-3.5 h-3.5" /> হোল্ডিং নং
                  </FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="হোল্ডিং নং লিখুন" 
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
        </div>
      </div>

      {/* 2. Present Address Section (English Card) */}
      {isEnglishEnabled && (
          <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/10">
                      <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest">Present Address (English)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="presentRoadBlockSectorEn"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                          <Navigation className="w-3.5 h-3.5" /> Road/Block/Sector (English)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter road/block/sector" className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="presentHoldingNo"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                          <Hash className="w-3.5 h-3.5" /> Holding No (English)
                        </FormLabel>
                        <FormControl>
                          <Input 
                              placeholder="Enter holding no" 
                              className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm" 
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

      {/* 3. Permanent Address Section (Bengali) */}
      <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-ambient border border-outline/5">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                <Map className="w-6 h-6" />
                </div>
                <div>
                <h2 className="text-xl font-black text-on-surface tracking-tight">
                    স্থায়ী ঠিকানা
                </h2>
                <p className="text-xs text-on-surface-variant font-medium italic">
                    আবেদনকারীর স্থায়ী ঠিকানার বিবরণ
                </p>
                </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[10px] font-black text-primary hover:bg-primary/5 uppercase tracking-tighter flex items-center gap-2 border border-primary/20 rounded-xl px-4 h-10"
              onClick={() => {
                const values = form.getValues();
                form.setValue("permanentVillageBn", values.presentVillageBn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentVillageEn", values.presentVillageEn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentRoadBlockSectorBn", values.presentRoadBlockSectorBn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentRoadBlockSectorEn", values.presentRoadBlockSectorEn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentHoldingNo", values.presentHoldingNo, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentWardNo", values.presentWardNo, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentDistrictBn", values.presentDistrictBn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentDistrictEn", values.presentDistrictEn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentUpazilaBn", values.presentUpazilaBn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentUpazilaEn", values.presentUpazilaEn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentPostOfficeBn", values.presentPostOfficeBn, { shouldValidate: true, shouldDirty: true });
                form.setValue("permanentPostOfficeEn", values.presentPostOfficeEn, { shouldValidate: true, shouldDirty: true });
              }}
            >
              <Clipboard className="w-3 h-3" /> বর্তমান ঠিকানা কপি করুন
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="permanentWardNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Hash className="w-3.5 h-3.5" />ওয়ার্ড নং <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full focus:ring-2 focus:ring-primary/40 text-sm">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                      {wards.map((w) => (
                        <SelectItem key={w.id} value={w.name.toString()} className="font-bold text-sm">
                          ওয়ার্ড নং {enToBnNumber(w.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-bold" />
                </FormItem>
              )}
            />
            
            <FormField
                control={form.control}
                name="permanentVillageBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Map className="w-3.5 h-3.5" /> গ্রাম <span className="text-rose-500">*</span>
                    </FormLabel>
                    <Select 
                        onValueChange={(val) => {
                            field.onChange(val);
                            const village = villages.find(v => v.displayName === val);
                            if (village && village.name) {
                                form.setValue("permanentVillageEn", village.name, { shouldValidate: true });
                            }
                        }} 
                        value={field.value || ""}
                    >
                    <FormControl>
                        <SelectTrigger className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full focus:ring-2 focus:ring-primary/40 text-sm">
                        <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-outline/5">
                        {villages.map((v) => (
                        <SelectItem key={v.id} value={v.displayName} className="font-bold text-sm">{v.displayName}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="permanentRoadBlockSectorBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Navigation className="w-3.5 h-3.5" /> রাস্তা/ব্লক/সেক্টর
                    </FormLabel>
                    <FormControl>
                    <Input placeholder="রাস্তা/ব্লক/সেক্টর লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="permanentPostOfficeBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Building className="w-3.5 h-3.5" /> ডাকঘর <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                    <Input placeholder="ডাকঘর লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="permanentUpazilaBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <MapPin className="w-3.5 h-3.5" /> উপজেলা <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                    <Input placeholder="উপজেলা লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />
            
            <FormField
                control={form.control}
                name="permanentDistrictBn"
                render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <MapPin className="w-3.5 h-3.5" /> জেলা <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                    <Input placeholder="জেলা লিখুন" className="h-12 bg-surface-container-low border-none rounded-2xl px-4 font-bold w-full text-sm" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage className="text-xs font-bold" />
                </FormItem>
                )}
            />

            <FormField
              control={form.control}
              name="permanentHoldingNo"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 text-[11px] font-black text-on-surface tracking-widest uppercase opacity-70">
                    <Hash className="w-3.5 h-3.5" /> হোল্ডিং নং
                  </FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="হোল্ডিং নং লিখুন" 
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
        </div>
      </div>

      {/* 4. Permanent Address Section (English Card) */}
      {isEnglishEnabled && (
          <div className="bg-primary/[0.02] rounded-[32px] p-8 shadow-ambient border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/10">
                      <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest">Permanent Address (English)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="permanentRoadBlockSectorEn"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                          <Navigation className="w-3.5 h-3.5" /> Road/Block/Sector (English)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter road/block/sector" className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage className="text-xs font-bold" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="permanentHoldingNo"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-[11px] font-black text-primary tracking-widest uppercase opacity-70">
                          <Hash className="w-3.5 h-3.5" /> Holding No (English)
                        </FormLabel>
                        <FormControl>
                          <Input 
                              placeholder="Enter holding no" 
                              className="h-12 bg-white border border-primary/10 rounded-2xl px-4 font-bold w-full text-sm" 
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
    </section>
  );
};
