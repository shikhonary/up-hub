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
import { useRejectCitizenModal } from "@workspace/ui/hooks/use-reject-citizen-modal";
import { AlertTriangle, XCircle, FileWarning } from "lucide-react";

export const RejectCitizenModal = () => {
  const { isOpen, applicantName, applicationId, closeRejectModal, onConfirmCallback } = useRejectCitizenModal();

  const handleConfirm = () => {
    if (applicationId && onConfirmCallback) {
      onConfirmCallback(applicationId);
      closeRejectModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeRejectModal}>
      <DialogContent className="max-w-md bg-white border-none p-0 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-rose-600 p-8 flex flex-col items-center text-center text-white relative isolate">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none -z-10">
            <FileWarning className="w-64 h-64 -translate-x-12 -translate-y-12" />
          </div>
          
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 shadow-lg border border-white/30">
            <XCircle className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
          
          <DialogTitle className="text-2xl font-black tracking-tight mb-2">
            আবেদন প্রত্যাখ্যান
          </DialogTitle>
          <DialogDescription className="text-rose-50/80 font-medium text-sm leading-relaxed max-w-[280px]">
            আপনি কি নিশ্চিতভাবে <strong>{applicantName}</strong> এর আবেদনটি প্রত্যাখ্যান করতে চান?
          </DialogDescription>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-start">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-800 uppercase tracking-widest">নিশ্চিতকরণ আবশ্যক</p>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                আবেদন প্রত্যাখ্যান করার অর্থ হলো এটি আর প্রসেস করা হবে না। তবে আপনি চাইলে পরবর্তীতে প্রত্যাখ্যাত তালিকা থেকে এটি দেখতে পারবেন।
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={closeRejectModal}
              className="flex-1 h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all"
            >
              বাতিল করুন
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 h-12 rounded-xl bg-rose-600 text-white font-black hover:bg-rose-700 shadow-glow-rose transition-all active:scale-[0.98] border-none"
            >
              হ্যাঁ, প্রত্যাখ্যান করুন
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
