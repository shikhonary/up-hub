"use client";

import React, { useEffect, useMemo } from "react";
import {
  generateTradeLicenseSchema,
  type GenerateTradeLicenseValues
} from "@workspace/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  zodResolver,
  useForm
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { 
  useGenerateTradeLicense,
  useFiscalYearsForSelection
} from "@workspace/api-client";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@workspace/ui/components/tabs";
import { toast } from "sonner";
import { enToBnNumber } from "@workspace/utils";
import { Loader2, Calculator, CheckCircle2, X, Calendar as CalendarIcon } from "lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@workspace/ui/lib/utils";

interface GenerateTradeLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
}

export const GenerateTradeLicenseModal = ({
  isOpen,
  onClose,
  application,
}: GenerateTradeLicenseModalProps) => {
  const { mutateAsync: generateLicense, isPending } = useGenerateTradeLicense();
  const { data: fiscalYears } = useFiscalYearsForSelection();

  const form = useForm<GenerateTradeLicenseValues>({
    resolver: zodResolver(generateTradeLicenseSchema),
    defaultValues: {
      applicationId: application?.id || "",
      licenseFee: 0,
      arrears: 0,
      arrearsFiscalYear: "",
      discount: 0,
      vatAmount: 0,
      signboardTax: 0,
      professionalTax: 0,
      subCharge: 0,
      totalAmount: 0,
      paymentStatus: "UNPAID",
      paymentType: "ক্যাশ (Cash)",
      paymentDate: new Date(),
    },
  });

  const { watch, setValue } = form;
  const values = watch();

  // 1. Auto-calculate VAT (15% of License Fee)
  useEffect(() => {
    const fee = Number(values.licenseFee || 0);
    const calculatedVat = Math.round(fee * 0.15);
    setValue("vatAmount", calculatedVat);
  }, [values.licenseFee, setValue]);

  // 2. Calculate Total Amount
  const calculatedTotal = useMemo(() => {
    const {
      licenseFee,
      arrears,
      discount,
      vatAmount,
      signboardTax,
      professionalTax,
      subCharge,
    } = values;

    return (
      Number(licenseFee || 0) +
      Number(arrears || 0) +
      Number(vatAmount || 0) +
      Number(signboardTax || 0) +
      Number(professionalTax || 0) +
      Number(subCharge || 0) -
      Number(discount || 0)
    );
  }, [values]);

  useEffect(() => {
    setValue("totalAmount", calculatedTotal);
  }, [calculatedTotal, setValue]);

  useEffect(() => {
    if (application) {
      setValue("applicationId", application.id);
    }
  }, [application, setValue]);

  const onSubmit = async (data: GenerateTradeLicenseValues) => {
    try {
      await generateLicense(data);
      toast.success("ট্রেড লাইসেন্স সফলভাবে জেনারেট করা হয়েছে");
      onClose();
    } catch (error) {
      toast.error("লাইসেন্স জেনারেট করতে সমস্যা হয়েছে");
    }
  };

  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-4xl w-[95vw] md:w-full p-0 overflow-hidden rounded-3xl border-none shadow-2xl max-h-[95vh]">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-4 md:p-6 min-h-0">
          <DialogHeader className="mb-4 md:mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <DialogTitle className="text-lg md:text-2xl font-black text-on-surface tracking-tight leading-tight">
                  আবেদন অনুমোদন ও লাইসেন্স ইস্যু
                </DialogTitle>
                <p className="text-[10px] md:text-xs font-black text-on-surface-variant/60 uppercase tracking-[0.1em]">
                  আবেদন ট্র্যাকিং নং: {enToBnNumber(application.trackingId || application.id.slice(0, 8).toUpperCase())}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/50 shrink-0 h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="h-full max-h-[60vh] md:max-h-[65vh] w-full pr-4 -mr-4">
            <Form {...form}>
              <form 
                id="generate-license-form"
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-4 md:space-y-6 pb-6"
              >
                {/* Read Only Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 bg-white/60 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/20 shadow-sm">
                <ReadOnlyField label="ট্র্যাকিং নং" value={enToBnNumber(application.id.slice(0, 10).toUpperCase())} />
                <ReadOnlyField label="প্রতিষ্ঠানের নাম" value={application.orgNameBn} />
                <ReadOnlyField label="ব্যবসার ধরন" value={application.tradeLicenseCategory?.typeBn} />
                <ReadOnlyField label="মালিকানার ধরন" value={application.ownershipTypeBn} />
                <ReadOnlyField label="ইস্যুর তারিখ" value={enToBnNumber(format(new Date(), "dd-MM-yyyy"))} />
                <ReadOnlyField 
                  label="বৈধতার মেয়াদ" 
                  value={application.fiscalYear?.endDate ? enToBnNumber(format(new Date(application.fiscalYear.endDate), "dd-MM-yyyy")) : "—"} 
                />
              </div>

              {/* Payment Status Toggle */}
              <div className="bg-slate-50/50 p-2 rounded-2xl border border-slate-200/50">
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Tabs 
                          onValueChange={field.onChange} 
                          value={field.value} 
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-2 h-9 rounded-xl bg-slate-200/50 p-1">
                            <TabsTrigger 
                              value="UNPAID" 
                              className="rounded-lg text-[10px] font-black data-[state=active]:bg-white data-[state=active]:text-primary transition-all"
                            >
                              শুধুমাত্র ইনভয়েস (Unpaid)
                            </TabsTrigger>
                            <TabsTrigger 
                              value="PAID" 
                              className="rounded-lg text-[10px] font-black data-[state=active]:bg-white data-[state=active]:text-emerald-600 transition-all"
                            >
                              পেমেন্ট সম্পন্ন (Paid)
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                {values.paymentStatus === "PAID" && (
                  <>
                    <FormField
                      control={form.control}
                      name="paymentType"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel className="text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-widest">পেমেন্টের ধরন</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                            <FormControl>
                              <SelectTrigger className="h-9 w-full rounded-xl border-outline/10 bg-white/50 focus:ring-primary/20 text-xs font-bold">
                                <SelectValue placeholder="নির্বাচন করুন" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-outline/10 shadow-ambient">
                              <SelectItem value="ক্যাশ (Cash)" className="font-bold">ক্যাশ (Cash)</SelectItem>
                              <SelectItem value="চেক (Cheque)" className="font-bold">চেক (Cheque)</SelectItem>
                              <SelectItem value="ব্যাংক ড্রাফট (Bank Draft)" className="font-bold">ব্যাংক ড্রাফট (Bank Draft)</SelectItem>
                              <SelectItem value="মোবাইল ব্যাংকিং (Mobile Banking)" className="font-bold">মোবাইল ব্যাংকিং (Mobile Banking)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentDate"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2 flex flex-col">
                          <FormLabel className="text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-widest mb-2">পেমেন্টের তারিখ</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "h-9 w-full rounded-xl border-outline/10 bg-white/50 text-left justify-start font-black text-[10px] md:text-xs transition-all hover:bg-white/80",
                                    !field.value && "text-on-surface-variant/40"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-3 w-3 opacity-50" />
                                  {field.value ? (
                                    enToBnNumber(format(field.value, "dd MMMM, yyyy", { locale: bn }))
                                  ) : (
                                    <span>তারিখ নির্বাচন করুন</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden border-outline/10 shadow-ambient" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date("2000-01-01")}
                                initialFocus
                                className="p-3"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormInputField control={form.control} name="licenseFee" label="লাইসেন্স ফি" />
                <FormInputField control={form.control} name="arrears" label="বকেয়া" />
                
                <FormField
                  control={form.control}
                  name="arrearsFiscalYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-widest">বকেয়া অর্থবছর</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger className="h-9 w-full rounded-xl border-outline/10 bg-white/50 focus:ring-primary/20 text-xs">
                            <SelectValue placeholder="অর্থবছর" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-outline/10 shadow-ambient max-h-48 overflow-y-auto">
                          {fiscalYears?.map((fy: any) => (
                            <SelectItem key={fy.id} value={fy.nameBn}>{fy.nameBn}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormInputField control={form.control} name="discount" label="ছাড়" placeholder="কোন ছাড় দিতে চাইলে" />
                <FormInputField control={form.control} name="vatAmount" label="ভ্যাট (১৫%)" />
                <FormInputField control={form.control} name="signboardTax" label="সাইনবোর্ড কর" />
                <FormInputField control={form.control} name="professionalTax" label="পেশা কর" />
                <FormInputField control={form.control} name="subCharge" label="সারচার্জ" />
              </div>

              {/* Total Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-primary text-white p-4 md:p-6 rounded-2xl md:rounded-[32px] shadow-glow gap-4 md:gap-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Calculator className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60">সর্বমোট প্রদেয় (Total Amount)</p>
                    <h3 className="text-xl md:text-3xl font-black tracking-tight">৳{enToBnNumber(calculatedTotal)}</h3>
                  </div>
                </div>
                <div className="hidden md:block h-12 w-px bg-white/10" />
                <div className="flex flex-col items-start md:items-end opacity-60">
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Status: Calculation Complete</span>
                  <span className="text-[8px] md:text-[10px] font-bold">Generated by System</span>
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="flex-col md:flex-row gap-2 p-2 md:p-4 bg-surface border-t border-outline/5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="w-full md:w-auto h-9 px-6 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black transition-all active:scale-95 text-[10px]"
                >
                  বাতিল (Cancel)
                </Button>
                <Button
                  type="submit"
                  form="generate-license-form"
                  disabled={isPending}
                  className="w-full md:w-auto h-9 px-8 rounded-xl bg-primary text-white font-black hover:bg-primary/90 shadow-glow transition-all active:scale-95 border-none gap-2 text-[10px]"
                >
                  {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                  {values.paymentStatus === "PAID" ? "অনুমোদন ও পেমেন্ট সম্পন্ন" : "অনুমোদন ও ইনভয়েস তৈরি"}
                </Button>
        </DialogFooter>
      </div>
      </DialogContent>
    </Dialog>
  );
};

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-0.5">
    <p className="text-[7px] md:text-[9px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest leading-none">{label}</p>
    <p className="text-[10px] md:text-xs font-black text-on-surface tracking-tight truncate leading-tight">{value || "—"}</p>
  </div>
);

const FormInputField = ({ control, name, label, type = "number", placeholder }: { control: any; name: string; label: string; type?: string; placeholder?: string }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-widest">{label}</FormLabel>
        <FormControl>
          <Input
            type={type}
            placeholder={placeholder}
            className="h-9 rounded-xl border-outline/10 bg-white/50 focus:ring-primary/20 text-xs"
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
