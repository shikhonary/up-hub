"use client";

import { useState } from "react";
import {
  Form,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import {
  User,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Languages,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { citizenApplicationSchema, type CitizenApplicationFormValues } from "@workspace/schema";
import { useCreateCitizenApplication, useUpdateCitizenApplication, useVillagesForSelection, useWardsForSelection } from "@workspace/api-client";
import { IdentityStep } from "./identity-step";
import { AddressStep } from "./address-step";
import { ContactStep } from "./contact-step";
import { ReviewStep } from "./review-step";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";

const STEPS = [
  { id: 1, title: "পরিচয়", icon: User },
  { id: 2, title: "ঠিকানা", icon: MapPin },
  { id: 3, title: "যোগাযোগ", icon: Phone },
  { id: 4, title: "পর্যালোচনা", icon: CheckCircle2 },
];

interface NewCitizenFormProps {
  id?: string;
  initialData?: CitizenApplicationFormValues;
}

export const NewCitizenForm = ({ id, initialData }: NewCitizenFormProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isEnglishEnabled, setIsEnglishEnabled] = useState(false);
  
  const { mutateAsync: createCitizen, isPending: isCreating } = useCreateCitizenApplication();
  const { mutateAsync: updateCitizen, isPending: isUpdating } = useUpdateCitizenApplication();

  const isPending = isCreating || isUpdating;
  const isEditing = !!id;

  // Dynamic Data Hooks
  const { data: wards = [] } = useWardsForSelection();
  const { data: villages = [] } = useVillagesForSelection();

  const form = useForm<CitizenApplicationFormValues>({
    resolver: zodResolver(citizenApplicationSchema),
    mode: "onChange",
    defaultValues: initialData || {
      fullNameEn: "",
      fullNameBn: "",
      nid: "",
      birthRegistrationNo: "",
      passportNo: "",
      dateOfBirth: undefined,
      fatherNameEn: "",
      fatherNameBn: "",
      motherNameEn: "",
      motherNameBn: "",
      occupationEn: "",
      occupationBn: "",
      residentStatusEn: "RESIDENT",
      residentStatusBn: "স্থায়ী",
      educationalQualificationEn: "",
      educationalQualificationBn: "",
      religionEn: "ISLAM",
      religionBn: "ইসলাম",
      genderEn: "MALE",
      genderBn: "পুরুষ",
      maritalStatusEn: "SINGLE",
      maritalStatusBn: "অবিবাহিত",
      presentVillageEn: "",
      presentVillageBn: "",
      presentRoadBlockSectorEn: "",
      presentRoadBlockSectorBn: "",
      presentHoldingNo: "",
      presentWardNo: 1,
      presentDistrictEn: "",
      presentDistrictBn: "",
      presentUpazilaEn: "",
      presentUpazilaBn: "",
      presentPostOfficeEn: "",
      presentPostOfficeBn: "",
      permanentVillageEn: "",
      permanentVillageBn: "",
      permanentRoadBlockSectorEn: "",
      permanentRoadBlockSectorBn: "",
      permanentHoldingNo: "",
      permanentWardNo: 1,
      permanentDistrictEn: "",
      permanentDistrictBn: "",
      permanentUpazilaEn: "",
      permanentUpazilaBn: "",
      permanentPostOfficeEn: "",
      permanentPostOfficeBn: "",
      mobile: "",
      email: "",
      commentsEn: "",
      commentsBn: "",
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = [
        "fullNameBn", 
        "fatherNameBn", 
        "motherNameBn", 
        "genderBn", 
        "religionBn", 
        "dateOfBirth", 
        "nid"
      ];
      if (isEnglishEnabled) {
        fieldsToValidate.push("fullNameEn", "fatherNameEn", "motherNameEn");
      }
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "presentWardNo", 
        "presentVillageBn", 
        "presentPostOfficeBn", 
        "presentUpazilaBn", 
        "presentDistrictBn"
      ];
    } else if (currentStep === 3) {
      fieldsToValidate = ["mobile"];
    }

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  async function onSubmit(data: CitizenApplicationFormValues) {
    try {
      if (isEditing) {
        await updateCitizen({ id: id as string, ...data });
      } else {
        await createCitizen(data);
      }
      router.push("/citizens/applications");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="pb-20 px-4 md:px-8 w-full max-w-5xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 z-10",
                    isCompleted ? "bg-primary border-primary text-white shadow-glow" :
                      isActive ? "bg-white border-primary text-primary shadow-ambient" :
                        "bg-white border-slate-200 text-slate-400"
                  )}
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                  isActive || isCompleted ? "text-primary" : "text-slate-400"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bilingual Toggle */}
      <div className="flex items-center justify-end gap-3 mb-8 bg-surface-container-low p-4 rounded-3xl border border-outline/5 shadow-sm">
        <div className="flex items-center gap-2 mr-auto">
            <Languages className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-on-surface">আবেদনের ভাষা</span>
        </div>
        <Label htmlFor="english-toggle" className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">
          ইংরেজি তথ্য সক্রিয় করুন
        </Label>
        <Switch
          id="english-toggle"
          checked={isEnglishEnabled}
          onCheckedChange={setIsEnglishEnabled}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {currentStep === 1 && <IdentityStep form={form} isEnglishEnabled={isEnglishEnabled} />}
          {currentStep === 2 && <AddressStep form={form} wards={wards} villages={villages} isEnglishEnabled={isEnglishEnabled} />}
          {currentStep === 3 && <ContactStep form={form} isEnglishEnabled={isEnglishEnabled} />}
          {currentStep === 4 && <ReviewStep form={form} isEnglishEnabled={isEnglishEnabled} />}

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-10 border-t border-slate-100">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                className="h-14 px-8 bg-white border border-outline/30 hover:bg-slate-50 text-on-surface-variant font-bold rounded-[20px] transition-all active:scale-[0.98] text-sm flex items-center gap-2"
                disabled={isPending}
              >
                <ArrowLeft className="w-4 h-4" /> পূর্ববর্তী
              </Button>
            )}

            <div className="flex-1" />

            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
                className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black rounded-[20px] flex items-center justify-center gap-3 transition-all shadow-glow hover:scale-[1.01] active:scale-[0.98] border-none text-base"
              >
                পরবর্তী <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="h-14 px-10 gradient-signature hover:opacity-90 text-white font-black rounded-[20px] flex items-center justify-center gap-3 transition-all shadow-glow hover:scale-[1.01] active:scale-[0.98] border-none text-base tracking-tight"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    {isEditing ? "আবেদন আপডেট করুন" : "আবেদন জমা দিন"}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
