"use client";

import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { useCollectTradeLicensePayment } from "@workspace/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { enToBnNumber } from "@workspace/utils";
import { Loader2, CheckCircle2, X, Calendar as CalendarIcon, Banknote } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@workspace/ui/lib/utils";
import { z } from "zod";

const collectPaymentSchema = z.object({
  paymentType: z.string().min(1, "পেমেন্টের ধরন নির্বাচন করুন"),
  paymentDate: z.coerce.date(),
});

type CollectPaymentValues = z.infer<typeof collectPaymentSchema>;

interface CollectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
}

export const CollectPaymentModal = ({
  isOpen,
  onClose,
  application,
}: CollectPaymentModalProps) => {
  const { mutateAsync: collectPayment, isPending } = useCollectTradeLicensePayment();

  const form = useForm<CollectPaymentValues>({
    resolver: zodResolver(collectPaymentSchema),
    defaultValues: {
      paymentType: "ক্যাশ (Cash)",
      paymentDate: new Date(),
    },
  });

  const onSubmit = async (data: CollectPaymentValues) => {
    if (!application?.TradeLicense?.id && !application?.tradeLicense?.id) return;
    
    try {
      await collectPayment({
        licenseId: application.TradeLicense?.id || application.tradeLicense?.id,
        ...data,
      });
      onClose();
    } catch (error: any) {
      // Error is already handled by the hook toast
    }
  };

  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-md p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                <Banknote className="w-6 h-6" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
                  পেমেন্ট সংগ্রহ করুন
                </DialogTitle>
                <p className="text-xs font-bold text-slate-500">
                  ইনভয়েস নং: INV-{enToBnNumber(application.trackingId)}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">মোট প্রদেয়</span>
              <span className="text-xl font-black text-emerald-700">৳{enToBnNumber(application.TradeLicense?.totalAmount || 0)}</span>
            </div>
            <div className="h-px bg-slate-100 w-full mb-2" />
            <p className="text-[10px] font-bold text-slate-500 italic">টাকা বুঝে নিয়ে পেমেন্ট সম্পন্ন করুন। এটি করার পর সনদ জেনারেট হবে।</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black text-slate-700 uppercase tracking-widest">পেমেন্টের ধরন</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-11 rounded-xl border-slate-200 bg-white focus:ring-emerald-500/20 font-bold">
                          <SelectValue placeholder="নির্বাচন করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl shadow-ambient border-slate-100">
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
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs font-black text-slate-700 uppercase tracking-widest mb-2">পেমেন্টের তারিখ</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-11 rounded-xl border-slate-200 bg-white text-left justify-start font-bold transition-all hover:bg-slate-50",
                              !field.value && "text-slate-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            {field.value ? (
                              enToBnNumber(format(field.value, "dd MMMM, yyyy", { locale: bn }))
                            ) : (
                              <span>তারিখ নির্বাচন করুন</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-slate-100 shadow-ambient" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="rounded-xl text-slate-500 font-bold"
                >
                  বাতিল
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-100 gap-2"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  পেমেন্ট সম্পন্ন করুন
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
