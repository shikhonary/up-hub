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
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { TenantFormValues } from "@workspace/schema";
import {
  useDivisions,
  useDistricts,
  useUpazilas,
  useUnions,
} from "@workspace/api-client";
import { Loader2 } from "lucide-react";

export interface AdministrativeGeographyStepProps {
  form: UseFormReturn<TenantFormValues>;
}

export function AdministrativeGeographyStep({
  form,
}: AdministrativeGeographyStepProps) {
  // Get values from form to trigger cascading
  const divisionId = form.watch("divisionId");
  const districtId = form.watch("districtId");
  const upazilaId = form.watch("upazilaId");

  // Fetch data
  const { data: divisions, isLoading: loadingDivisions } = useDivisions();
  const { data: districts, isLoading: loadingDistricts } = useDistricts(divisionId);
  const { data: upazilas, isLoading: loadingUpazilas } = useUpazilas(districtId);
  const { data: unions, isLoading: loadingUnions } = useUnions(upazilaId);

  // Reset dependent fields when parent changes
  useEffect(() => {
    // If division changes, we don't need to manually reset district here because 
    // the Select component's value is controlled by the form. 
    // But we might want to clear them to ensure consistency.
  }, [divisionId]);

  const inputClasses =
    "h-12 bg-background/50 border-border/50 rounded-xl px-4 focus:ring-primary/20 transition-all shadow-soft font-semibold w-full disabled:opacity-50";
  const labelClasses =
    "text-sm font-bold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Division */}
        <FormField
          control={form.control}
          name="divisionId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>Division</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue("districtId", "");
                  form.setValue("upazilaId", "");
                  form.setValue("unionId", "");
                  form.setValue("geoCode", "");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder={loadingDivisions ? "Loading..." : "Select Division"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                  {divisions?.map((item) => (
                    <SelectItem key={item.id} value={item.id} className="rounded-lg font-medium">
                      {item.name} ({item.nameBn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* District */}
        <FormField
          control={form.control}
          name="districtId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>District</FormLabel>
              <Select
                disabled={!divisionId || loadingDistricts}
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue("upazilaId", "");
                  form.setValue("unionId", "");
                  form.setValue("geoCode", "");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder={loadingDistricts ? "Loading..." : "Select District"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                  {districts?.map((item) => (
                    <SelectItem key={item.id} value={item.id} className="rounded-lg font-medium">
                      {item.name} ({item.nameBn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* Upazila */}
        <FormField
          control={form.control}
          name="upazilaId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>Upazila</FormLabel>
              <Select
                disabled={!districtId || loadingUpazilas}
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue("unionId", "");
                  form.setValue("geoCode", "");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder={loadingUpazilas ? "Loading..." : "Select Upazila"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                  {upazilas?.map((item) => (
                    <SelectItem key={item.id} value={item.id} className="rounded-lg font-medium">
                      {item.name} ({item.nameBn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* Union */}
        <FormField
          control={form.control}
          name="unionId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>Union Parishad</FormLabel>
              <Select
                disabled={!upazilaId || loadingUnions}
                onValueChange={(val) => {
                  field.onChange(val);
                  // Find selected union and set geoCode
                  const selectedUnion = unions?.find((u) => u.id === val);
                  if (selectedUnion?.geoCode) {
                    form.setValue("geoCode", selectedUnion.geoCode);
                  }
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder={loadingUnions ? "Loading..." : "Select Union"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-border/50 shadow-medium backdrop-blur-xl bg-background/95">
                  {unions?.map((item) => (
                    <SelectItem key={item.id} value={item.id} className="rounded-lg font-medium">
                      {item.name} ({item.nameBn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />

        {/* Geo Code */}
        <FormField
          control={form.control}
          name="geoCode"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClasses}>BBS Geo Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter Official Geo Code"
                  className={inputClasses}
                />
              </FormControl>
              <FormMessage className="font-bold text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
