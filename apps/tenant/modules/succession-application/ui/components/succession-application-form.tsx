"use client";

import { useState } from "react";
import {
  Form,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import {
  successionApplicationSchema,
  SuccessionApplicationFormValues,
} from "@workspace/schema";
import { ApplicantInfoStep } from "./steps/applicant-info-step";
import { DeceasedInfoStep } from "./steps/deceased-info-step";
import { AddressStep } from "./steps/address-step";
import { HeirsListStep } from "./steps/heirs-list-step";
import { ReviewStep } from "./steps/review-step";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  Save,
  Languages,
  MoreVertical,
  User,
  MapPin,
  Users,
} from "lucide-react";
import { useCreateSuccessionApplication, useUpdateSuccessionApplication } from "@workspace/api-client";
import { toast } from "@workspace/ui/components/sonner";
import { useRouter } from "next/navigation";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";

const steps = [
  { id: 1, title: "মৃত ব্যক্তি", sub: "পরিচয় ও মৃত্যু তথ্য" },
  { id: 2, title: "ঠিকানা", sub: "বর্তমান ও স্থায়ী" },
  { id: 3, title: "আবেদনকারী", sub: "প্রাথমিক তথ্য" },
  { id: 4, title: "উত্তরাধিকারী", sub: "তালিকা ও সম্পর্ক" },
  { id: 5, title: "যাচাই করুন", sub: "তথ্য রিভিউ" },
];

interface SuccessionApplicationFormProps {
  id?: string;
  initialData?: any;
}

export const SuccessionApplicationForm = ({
  id,
  initialData,
}: SuccessionApplicationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEnglishEnabled, setIsEnglishEnabled] = useState(false);
  const router = useRouter();

  const createMutation = useCreateSuccessionApplication();
  const updateMutation = useUpdateSuccessionApplication();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<SuccessionApplicationFormValues>({
    resolver: zodResolver(successionApplicationSchema) as any,
    mode: "onChange",
    defaultValues: initialData || {
      nameBn: "",
      nameEn: "",
      nidNo: "",
      deathDate: undefined,
      fatherNameBn: "",
      fatherNameEn: "",
      motherNameBn: "",
      motherNameEn: "",
      residentStatus: "PERMANENT",
      religion: "ISLAM",
      gender: "MALE",
      maritalStatus: "MARRIED",
      applicantNameBn: "",
      applicantNameEn: "",
      applicantGuardianNameBn: "",
      applicantGuardianNameEn: "",
      attachmentFile: null,
      deceasedPreWarish: "",
      presentVillageBn: "",
      presentVillageEn: "",
      presentRoadBlockSectorBn: "",
      presentRoadBlockSectorEn: "",
      presentHoldingNo: "",
      presentWardNo: 0,
      presentDistrictBn: "",
      presentDistrictEn: "",
      presentUpazilaBn: "",
      presentUpazilaEn: "",
      presentPostOfficeBn: "",
      presentPostOfficeEn: "",
      permanentVillageBn: "",
      permanentVillageEn: "",
      permanentRoadBlockSectorBn: "",
      permanentRoadBlockSectorEn: "",
      permanentHoldingNo: "",
      permanentWardNo: 0,
      permanentDistrictBn: "",
      permanentDistrictEn: "",
      permanentUpazilaBn: "",
      permanentUpazilaEn: "",
      permanentPostOfficeBn: "",
      permanentPostOfficeEn: "",
      permanentIsSameAsPresent: false,
      heirs: [{ serialNo: 1, heirNameBn: "", heirNameEn: "", relationBn: "", relationEn: "", ageDobDod: "", idNo: "", maritalStatus: "UNMARRIED", isAlive: "YES" }],
      status: "PENDING",
    },
  });

  const nextStep = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "nameBn",
        "fatherNameBn",
        "motherNameBn",
        "deathDate",
        "religion",
        "gender",
        "residentStatus",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "presentVillageBn",
        "presentWardNo",
        "presentPostOfficeBn",
        "permanentVillageBn",
        "permanentWardNo",
        "permanentPostOfficeBn",
      ];
    } else if (currentStep === 3) {
      fieldsToValidate = ["applicantNameBn", "applicantGuardianNameBn"];
    } else if (currentStep === 4) {
      fieldsToValidate = ["heirs"];
    }

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setCurrentStep((prev) => prev + 1);
    else {
      toast.error("অনুগ্রহ করে সকল আবশ্যক ক্ষেত্র সঠিকভাবে পূরণ করুন।");
    }
  };

  const prevStep = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (values: SuccessionApplicationFormValues) => {
    if (currentStep !== steps.length) {
      nextStep();
      return;
    }
    try {
      if (id) {
        await updateMutation.mutateAsync({ id, ...values });
        toast.success("আবেদনটি সফলভাবে আপডেট করা হয়েছে।");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("আবেদনটি সফলভাবে জমা দেওয়া হয়েছে।");
      }
      router.push("/succession/applications");
    } catch (error: any) {
      toast.error(error?.message || "আবেদন প্রক্রিয়াকরণে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="space-y-10 pb-12 px-8 md:px-12">
      {/* Progress Bar */}
      <div className="relative pt-6 pb-16">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-[10%] w-[80%] h-[3px] bg-slate-100 -translate-y-1/2 -z-10 rounded-full overflow-hidden hidden md:block">
          <div
            className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center relative z-10 px-2 md:px-10">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-4 group cursor-pointer relative"
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              >
                {/* Step Circle */}
                <div
                  className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isActive
                    ? "bg-primary text-white shadow-[0_0_0_8px_rgba(var(--primary),0.1)] scale-110"
                    : isCompleted
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-white border-2 border-slate-100 text-slate-400 group-hover:border-primary/30"
                    }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    <span className={`text-lg md:text-xl font-black ${isActive ? "" : "opacity-50"}`}>{step.id}</span>
                  )}

                  {isActive && (
                    <div className="absolute -inset-1.5 rounded-full border border-primary/30 border-dashed animate-[spin_10s_linear_infinite]" />
                  )}
                </div>

                {/* Step Text */}
                <div className="text-center absolute top-full mt-4 w-36 left-1/2 -translate-x-1/2 hidden md:block transition-all duration-300">
                  <p
                    className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isActive ? "text-primary" : isCompleted ? "text-emerald-600" : "text-slate-400"
                      }`}
                  >
                    {step.title}
                  </p>
                  <p className={`text-[10px] font-bold mt-1 ${isActive ? "text-slate-600" : "text-slate-400/60"}`}>
                    {step.sub}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bilingual Toggle */}
      <div className="flex items-center justify-end gap-4 bg-slate-50/50 p-4 rounded-[24px] border border-slate-100 relative z-10 w-fit ml-auto">
        <div className="flex items-center gap-3 pr-4 border-r border-slate-200/60">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100">
            <Globe className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="isEnglishEnabled"
              className="text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              Bilingual Mode
            </Label>
            <span className="text-[13px] font-bold text-slate-700">
              {isEnglishEnabled ? "English + বাংলা" : "শুধুমাত্র বাংলা"}
            </span>
          </div>
        </div>
        <Switch
          id="isEnglishEnabled"
          checked={isEnglishEnabled}
          onCheckedChange={setIsEnglishEnabled}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <div className="mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {currentStep === 1 && (
              <DeceasedInfoStep
                form={form}
                isEnglishEnabled={isEnglishEnabled}
              />
            )}
            {currentStep === 2 && (
              <AddressStep
                form={form}
                isEnglishEnabled={isEnglishEnabled}
              />
            )}
            {currentStep === 3 && (
              <ApplicantInfoStep
                form={form}
                isEnglishEnabled={isEnglishEnabled}
              />
            )}
            {currentStep === 4 && (
              <HeirsListStep
                form={form}
                isEnglishEnabled={isEnglishEnabled}
              />
            )}
            {currentStep === 5 && (
              <ReviewStep
                form={form}
                isEnglishEnabled={isEnglishEnabled}
              />
            )}

            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="h-14 px-8 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 font-black text-slate-600 gap-2 transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" /> পূর্ববর্তী
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="h-14 px-10 rounded-2xl bg-primary text-white shadow-glow hover:scale-[1.02] active:scale-95 transition-all font-black gap-2"
                >
                  পরবর্তী ধাপ <ChevronRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-14 px-10 rounded-2xl bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all font-black gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> {id ? "আপডেট করা হচ্ছে..." : "সাবমিট করা হচ্ছে..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> {id ? "তথ্য আপডেট করুন" : "আবেদন সাবমিট করুন"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
