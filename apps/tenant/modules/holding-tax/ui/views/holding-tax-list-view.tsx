"use client";

import React, { useState } from "react";
import { useHoldingTaxes } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Banknote,
  Calendar,
  Filter,
  Info,
  MapPin,
  MoreHorizontal,
  Receipt,
  UserCircle,
  Clock,
  CheckCircle2,
  Calculator,
  Printer
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { enToBnNumber } from "@workspace/utils";
import { HoldingTaxStats } from "../components/holding-tax-stats";
import { HoldingTaxFilters } from "../components/holding-tax-filters";
import { HoldingTaxPagination } from "../components/holding-tax-pagination";
import { CollectTaxModal } from "../components/collect-tax-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";

export const HoldingTaxListView = () => {
  const { data, isLoading } = useHoldingTaxes();
  const [selectedTax, setSelectedTax] = useState<any>(null);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] uppercase tracking-widest py-1 px-3 rounded-lg shadow-sm">
            পরিশোধিত
          </Badge>
        );
      case "PARTIAL":
        return (
          <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-black text-[10px] uppercase tracking-widest py-1 px-3 rounded-lg shadow-sm">
            আংশিক
          </Badge>
        );
      default:
        return (
          <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-black text-[10px] uppercase tracking-widest py-1 px-3 rounded-lg shadow-sm">
            বকেয়া
          </Badge>
        );
    }
  };

  const handleCollect = (tax: any) => {
    setSelectedTax(tax);
    setIsCollectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface relative isolate">
      {/* Background blobs */}
      <div className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none" />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              হোল্ডিং ট্যাক্স ব্যবস্থাপনা
            </h1>
            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              ইউনিয়ন পরিষদের ট্যাক্স আদায় ও বকেয়া সংক্রান্ত যাবতীয় তথ্য পরিচালনা করুন।
            </p>
          </div>

          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <Link href="/holding-tax/assessments/bulk-generate">
              <Button
                className="
                  group relative overflow-hidden
                  inline-flex items-center gap-2
                  bg-gradient-to-br from-primary to-primary-container
                  text-white font-bold text-sm
                  px-5 py-2.5 rounded-2xl
                  border-0
                  shadow-[0_4px_20px_-4px] shadow-primary/40
                  hover:shadow-[0_6px_28px_-4px] hover:shadow-primary/60
                  hover:scale-[1.03]
                  active:scale-[0.97]
                  transition-all duration-200 ease-out
                  h-auto
                "
              >
                <Calculator size={16} strokeWidth={3} />
                ট্যাক্স জেনারেট করুন
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <HoldingTaxStats />

        {/* Filters & Table Wrapper */}
        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate">
          <HoldingTaxFilters />

          <div className="relative flex-grow border-t border-surface-container">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">মালিক ও হোল্ডিং তথ্য</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">এলাকা ও অর্থবছর</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5 text-center">স্ট্যাটাস</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">ট্যাক্স বিবরণ</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/5">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded bg-surface-container" />
                            <div className="flex flex-col gap-2">
                              <Skeleton className="h-4 w-32 bg-surface-container" />
                              <Skeleton className="h-3 w-20 bg-surface-container opacity-60" />
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-40 bg-surface-container" />
                            <Skeleton className="h-3 w-24 bg-surface-container opacity-60" />
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <Skeleton className="h-6 w-20 mx-auto bg-surface-container rounded-lg" />
                        </td>
                        <td className="py-5 px-6 text-right">
                          <Skeleton className="h-10 w-32 ml-auto bg-surface-container rounded-lg" />
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex justify-end">
                            <Skeleton className="w-10 h-10 rounded-xl bg-surface-container" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : data?.data?.items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-40 animate-in fade-in zoom-in duration-700">
                          <div className="w-20 h-20 rounded-[32px] bg-surface-container flex items-center justify-center text-slate-400">
                            <Receipt className="w-10 h-10" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">কোনো রেকর্ড পাওয়া যায়নি</h3>
                            <p className="text-[10px] font-bold text-on-surface-variant/40 italic">অনুগ্রহ করে ভিন্ন কোনো ফিল্টার ব্যবহার করে দেখুন</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data?.data?.items.map((tax: any, index: number) => (
                      <tr
                        key={tax.id}
                        className="hover:bg-surface-container-low/30 transition-colors group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary transition-all group-hover:bg-white shadow-sm border border-outline/5">
                              <UserCircle size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-black text-on-surface tracking-tight group-hover:text-primary transition-colors leading-tight">
                                {tax.assessment?.fullNameBn}
                              </span>
                              <div className="flex items-center gap-1.5 opacity-60">
                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest py-0 px-1.5 border-outline/10 h-4 min-h-0 bg-surface-container-low">
                                  হোল্ডিং: {enToBnNumber(tax.assessment?.holdingNo)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-primary/60" />
                              <span className="text-sm font-bold tracking-tight text-on-surface">{tax.assessment?.villageBn}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-surface-container text-on-surface-variant border-outline/5 font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                                {tax.fiscalYear?.nameBn}
                              </Badge>
                              <span className="text-[10px] font-black text-on-surface-variant/40">ওয়ার্ড: {enToBnNumber(tax.assessment?.wardNo)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center">
                          {getStatusBadge(tax.status)}
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex flex-col items-end gap-0.5">
                            <div className="flex items-center gap-1.5 opacity-40">
                              <span className="text-[9px] font-black uppercase tracking-widest">ধার্যকৃত:</span>
                              <span className="text-xs font-black">৳{enToBnNumber(tax.totalAmount)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-rose-600/60 uppercase tracking-widest">বকেয়া:</span>
                              <span className={cn("text-lg font-black tracking-tighter", tax.dueAmount > 0 ? "text-rose-600" : "text-emerald-600")}>
                                ৳{enToBnNumber(tax.dueAmount)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            {tax.status !== "PAID" && (
                              <Button
                                onClick={() => handleCollect(tax)}
                                size="sm"
                                className="h-9 px-4 rounded-xl font-bold bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-none border-none active:scale-95"
                              >
                                সংগ্রহ করুন
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-on-surface-variant/40 hover:text-primary transition-all cursor-pointer rounded-xl hover:bg-primary/5 outline-none focus:outline-none focus:ring-0"
                                >
                                  <MoreHorizontal className="w-5 h-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-52 rounded-2xl border-outline/10 shadow-ambient p-1.5">
                                <Link href={`/holding-tax/records/${tax.id}`}>
                                  <DropdownMenuItem className="py-3 px-4 rounded-xl cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors">
                                    <Info size={16} className="mr-3 opacity-60" /> বিস্তারিত তথ্য
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator className="bg-outline/5 my-1" />
                                <Link href={`/holding-tax/records/${tax.id}/receipt`}>
                                  <DropdownMenuItem
                                    disabled={tax.status !== "PAID"}
                                    className="py-3 px-4 rounded-xl cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors data-[disabled]:opacity-30 data-[disabled]:pointer-events-none"
                                  >
                                    <Printer size={16} className="mr-3 opacity-60" /> রশিদ প্রিন্ট করুন
                                  </DropdownMenuItem>
                                </Link>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {data?.data?.total && (
              <HoldingTaxPagination total={data.data.total} />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <CollectTaxModal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        taxRecord={selectedTax}
      />
    </div>
  );
};
