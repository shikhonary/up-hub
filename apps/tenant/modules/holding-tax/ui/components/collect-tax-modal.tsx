"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useCollectTax } from "@workspace/api-client";
import { enToBnNumber, bnToEnNumber } from "@workspace/utils";
import { Banknote, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@workspace/ui/components/sonner";

interface CollectTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxRecord: any;
}

export function CollectTaxModal({ isOpen, onClose, taxRecord }: CollectTaxModalProps) {
  const [amount, setAmount] = useState<string>("");
  const { mutateAsync: collectTax, isPending } = useCollectTax();

  useEffect(() => {
    if (taxRecord) {
      setAmount(taxRecord.dueAmount.toString());
    }
  }, [taxRecord]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxRecord) return;

    const paidAmount = parseFloat(amount);
    if (isNaN(paidAmount) || paidAmount <= 0) {
      toast.error("সঠিক টাকার পরিমাণ লিখুন");
      return;
    }

    try {
      await collectTax({
        id: taxRecord.id,
        paidAmount,
      });
      onClose();
    } catch (error) {
      // Error is handled by hook's toast
    }
  };

  if (!taxRecord) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-[32px] border-outline/10 shadow-ambient p-0 overflow-hidden">
        <div className="bg-primary/5 p-8 border-b border-primary/10 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Banknote size={28} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-on-surface tracking-tight">ট্যাক্স সংগ্রহ করুন</DialogTitle>
              <DialogDescription className="text-sm font-bold text-on-surface-variant opacity-60">
                {taxRecord.assessment?.fullNameBn} - {taxRecord.fiscalYear?.nameBn}
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 mb-1">মোট ট্যাক্স</p>
              <p className="text-lg font-black text-on-surface">৳{enToBnNumber(taxRecord.totalAmount)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-600/60 mb-1">বকেয়া পরিমাণ</p>
              <p className="text-lg font-black text-rose-600">৳{enToBnNumber(taxRecord.dueAmount)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-70 ml-1">
              পরিশোধিত টাকার পরিমাণ (৳)
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black group-focus-within:scale-110 transition-transform">৳</div>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="টাকার পরিমাণ লিখুন"
                className="h-16 pl-10 text-2xl font-black rounded-2xl border-2 border-outline/5 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all bg-surface-container-lowest"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-between items-center gap-4 pt-4">
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
               <CheckCircle2 size={16} />
               <span className="text-xs font-black uppercase tracking-widest">নিরাপদ পেমেন্ট</span>
             </div>
            
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="font-bold rounded-xl h-12 px-6">
                বাতিল
              </Button>
              <Button 
                type="submit" 
                disabled={isPending || !amount}
                className="h-12 px-8 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 min-w-[140px]"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "সংগ্রহ করুন"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
