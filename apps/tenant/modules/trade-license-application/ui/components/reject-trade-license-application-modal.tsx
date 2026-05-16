"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { useUpdateTradeLicenseApplicationStatus } from "@workspace/api-client";
import { AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface RejectTradeLicenseApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
}

export const RejectTradeLicenseApplicationModal = ({
  isOpen,
  onClose,
  application,
}: RejectTradeLicenseApplicationModalProps) => {
  const { mutateAsync: updateStatus, isPending } = useUpdateTradeLicenseApplicationStatus();

  const handleReject = async () => {
    if (!application) return;
    try {
      await updateStatus({
        id: application.id,
        status: "REJECTED",
      });
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-md w-[95vw] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className="bg-rose-50/50 p-6 md:p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-xl md:text-2xl font-black text-rose-900 tracking-tight">
                আবেদন বাতিল নিশ্চিতকরণ
              </DialogTitle>
              <p className="text-sm font-bold text-rose-600/80 leading-relaxed">
                আপনি কি নিশ্চিতভাবে <span className="text-rose-700 font-black">"{application.orgNameBn}"</span> এর ট্রেড লাইসেন্স আবেদনটি বাতিল করতে চান?
              </p>
            </div>

            <div className="w-full bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-rose-100 text-left">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">সতর্কবার্তা</p>
              <p className="text-xs font-bold text-rose-700/70">
                একবার বাতিল করলে এই আবেদনটি আর পুনরায় সক্রিয় বা অনুমোদন করা যাবে না। আবেদনকারীকে নতুন করে আবেদন করতে হবে।
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 md:p-6 bg-white border-t border-rose-100 flex-col md:flex-row gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full md:flex-1 h-12 rounded-xl text-slate-500 font-black hover:bg-slate-100 transition-all text-xs"
          >
            ফিরে যান
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleReject}
            className="w-full md:flex-[1.5] h-12 rounded-xl bg-rose-600 text-white font-black hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all active:scale-95 border-none gap-2 text-xs"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            হ্যাঁ, আবেদন বাতিল করুন
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
