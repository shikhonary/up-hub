"use client";

import { useState } from "react";
import {
  Form,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import {
  User,
  MapPin,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { assessmentApplicationSchema, type AssessmentApplicationFormValues } from "@workspace/schema";
import { useCreateAssessment, useUpdateAssessment } from "@workspace/api-client";
import { IdentityStep } from "./steps/identity-step";
import { SurveyStep } from "./steps/survey-step";
import { TaxStep } from "./steps/tax-step";
import { ReviewStep } from "./steps/review-step";

const STEPS = [
  { id: 1, title: "পরিচয়", icon: User },
  { id: 2, title: "ঠিকানা ও তথ্য", icon: MapPin },
  { id: 3, title: "জরিপ তথ্য", icon: ClipboardList },
  { id: 4, title: "কর নির্ধারণ", icon: Calculator },
  { id: 5, title: "পর্যালোচনা", icon: CheckCircle2 },
];

interface AssessmentFormProps {
  id?: string;
  initialData?: AssessmentApplicationFormValues;
}

export const AssessmentForm = ({ id, initialData }: AssessmentFormProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const { mutateAsync: createAssessment, isPending: isCreating } = useCreateAssessment();
  const { mutateAsync: updateAssessment, isPending: isUpdating } = useUpdateAssessment();

  const isPending = isCreating || isUpdating;
  const isEditing = !!id;

  const form = useForm<AssessmentApplicationFormValues>({
    resolver: zodResolver(assessmentApplicationSchema),
    mode: "onChange",
    defaultValues: initialData || {
      fullNameBn: "",
      genderBn: "পুরুষ",
      maritalStatusBn: "অবিবাহিত",
      holdingNo: "",
      wardNo: 1,
      villageBn: "",
      districtBn: "ব্রাহ্মণবাড়িয়া",
      upazilaBn: "নবীনগর",
      postOfficeBn: "",
      maleCount: 1,
      femaleCount: 1,
      annualValuation: 0,
      taxRatePercent: 7,
      totalTax: 0,
      hasTubewell: false,
      hasUtilities: false,
      isSocialSafetyNetCovered: false,
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["fullNameBn", "genderBn", "maritalStatusBn", "nid"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["holdingNo", "wardNo", "villageBn", "postOfficeBn", "districtBn", "upazilaBn"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["maleCount", "femaleCount"];
    } else if (currentStep === 4) {
      fieldsToValidate = ["annualValuation", "taxRatePercent", "totalTax"];
    }

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  async function onSubmit(data: AssessmentApplicationFormValues) {
    try {
      if (isEditing) {
        await updateAssessment({ id: id as string, ...data });
      } else {
        await createAssessment(data);
      }
      router.push("/holding-tax/assessments");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="pb-20 px-4 md:px-8 w-full max-w-5xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-12 relative">
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
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 z-10 cursor-pointer",
                    isCompleted ? "bg-primary border-primary text-white shadow-glow" :
                      isActive ? "bg-white border-primary text-primary shadow-ambient scale-110" :
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {currentStep === 1 && <IdentityStep form={form} />}
          {currentStep === 2 && <SurveyStep form={form} type="location" />}
          {currentStep === 3 && <SurveyStep form={form} type="survey" />}
          {currentStep === 4 && <TaxStep form={form} />}
          {currentStep === 5 && <ReviewStep form={form} />}

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
                    {isEditing ? "তথ্য আপডেট করুন" : "এসেসমেন্ট জমা দিন"}
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
