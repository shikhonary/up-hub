"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { useApproveCitizenModal } from "@workspace/ui/hooks/use-approve-citizen-modal";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

export const ApproveCitizenModal = () => {
  const { isOpen, applicantName, applicationId, closeApproveModal, onConfirmCallback } = useApproveCitizenModal();

  const handleConfirm = () => {
    if (applicationId && onConfirmCallback) {
      onConfirmCallback(applicationId);
      closeApproveModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeApproveModal}>
      <DialogContent className="max-w-md bg-white border-none p-0 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-emerald-600 p-8 flex flex-col items-center text-center text-white relative isolate">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none -z-10">
            <ShieldCheck className="w-64 h-64 -translate-x-12 -translate-y-12" />
          </div>
          
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 shadow-lg border border-white/30 animate-bounce-subtle">
            <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
          
          <DialogTitle className="text-2xl font-black tracking-tight mb-2">
            আবেদন অনুমোদন
          </DialogTitle>
          <DialogDescription className="text-emerald-50/80 font-medium text-sm leading-relaxed max-w-[280px]">
            আপনি কি নিশ্চিতভাবে <strong>{applicantName}</strong> এর আবেদনটি অনুমোদন করতে চান?
          </DialogDescription>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 items-start">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-amber-800 uppercase tracking-widest">গুরুত্বপূর্ণ সতর্কতা</p>
              <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                একবার অনুমোদিত হলে, এই আবেদনটি আর পরিবর্তন করা যাবে না। সিস্টেমে অবিলম্বে একটি অফিসিয়াল নাগরিক রেকর্ড তৈরি হবে।
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={closeApproveModal}
              className="flex-1 h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all"
            >
              বাতিল করুন
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 h-12 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 shadow-glow transition-all active:scale-[0.98] border-none"
            >
              হ্যাঁ, অনুমোদন করুন
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
