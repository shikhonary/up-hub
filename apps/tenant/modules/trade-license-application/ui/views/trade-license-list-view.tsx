"use client";

import { useTradeLicenses } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Eye,
  FileText,
  ShieldCheck,
  Briefcase,
  UserCircle,
  MoreHorizontal,
  Banknote,
  Printer,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { TradeLicenseStats } from "../components/desktop/license-list/trade-license-stats";
import { TradeLicenseFilters } from "../components/desktop/license-list/trade-license-filters";
import { TradeLicensePagination } from "../components/desktop/license-list/trade-license-pagination";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { enToBnNumber } from "@workspace/utils";
import { format } from "date-fns";
import { useState } from "react";
import { CollectPaymentModal } from "../components/collect-payment-modal";

export const TradeLicenseListView = () => {
  const { data: response, isLoading } = useTradeLicenses();
  const [isCollectPaymentModalOpen, setIsCollectPaymentModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<any>(null);

  const licenses = response?.data || [];
  const meta = response?.meta;

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] uppercase tracking-widest gap-1.5 px-2.5 py-1">
            <CheckCircle className="w-3 h-3" /> পরিশোধিত
          </Badge>
        );
      case "UNPAID":
        return (
          <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-black text-[10px] uppercase tracking-widest gap-1.5 px-2.5 py-1">
            <AlertCircle className="w-3 h-3" /> বকেয়া
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-50 text-slate-600 border-slate-100 font-black text-[10px] uppercase tracking-widest gap-1.5 px-2.5 py-1">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface relative isolate">
      {/* Background blobs for depth */}
      <div aria-hidden className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      <div aria-hidden className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none" />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
          />

          <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              ট্রেড লাইসেন্স তালিকা
            </h1>
            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              ইউনিয়ন পরিষদের ইস্যুকৃত সকল ট্রেড লাইসেন্স এবং পেমেন্ট রেকর্ডসমূহ পরিচালনা করুন।
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <TradeLicenseStats />

        {/* Filters and Table Wrapper */}
        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate">
          <TradeLicenseFilters />

          <div className="relative flex-grow border-t border-surface-container">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">প্রতিষ্ঠান ও লাইসেন্স নং</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">মালিক ও ধরন</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-center border-b border-outline/5">অর্থবছর ও মেয়াদ</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-center border-b border-outline/5">পেমেন্ট স্ট্যাটাস</th>
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
                           <div className="flex flex-col items-center">
                             <Skeleton className="h-4 w-24 mx-auto bg-surface-container" />
                           </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-2 flex flex-col items-center">
                            <Skeleton className="h-4 w-24 bg-surface-container" />
                            <Skeleton className="h-3 w-20 bg-surface-container opacity-60" />
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center">
                          <Skeleton className="h-6 w-20 mx-auto bg-surface-container rounded-lg" />
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex justify-end">
                            <Skeleton className="w-10 h-10 rounded-xl bg-surface-container" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : licenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-40 animate-in fade-in zoom-in duration-700">
                           <div className="w-20 h-20 rounded-[32px] bg-surface-container flex items-center justify-center text-slate-400">
                             <FileText className="w-10 h-10" />
                           </div>
                           <div className="space-y-1">
                             <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">কোনো লাইসেন্স পাওয়া যায়নি</h3>
                             <p className="text-[10px] font-bold text-on-surface-variant/40 italic">অনুগ্রহ করে ভিন্ন কোনো ফিল্টার ব্যবহার করে দেখুন</p>
                           </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    licenses.map((license: any, index: number) => (
                      <tr
                        key={license.id}
                        className="hover:bg-surface-container-low/30 transition-colors group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary transition-all group-hover:bg-white shadow-sm border border-outline/5">
                              <Briefcase size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">{license.application.orgNameBn}</span>
                              <div className="flex items-center gap-3 opacity-60">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                                  {enToBnNumber(license.licenseNo || "সনদ তৈরি হয়নি")}
                                </span>
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest italic">ট্র্যাকিং: {enToBnNumber(license.trackingNo)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/40 border border-outline/5 group-hover:bg-white">
                              <UserCircle size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-on-surface">{license.application.fullNameBn}</span>
                              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-black text-[9px] uppercase tracking-widest px-2 py-0.5 w-fit">
                                {license.application.tradeLicenseCategory?.typeBn}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center">
                          <div className="flex flex-col items-center gap-1">
                             <span className="text-xs font-black text-on-surface">{license.fiscalYear.nameBn}</span>
                             <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                                <Clock className="w-3 h-3" />
                                {enToBnNumber(format(new Date(license.expiryDate), "dd/MM/yyyy"))}
                             </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {getPaymentStatusBadge(license.paymentStatus)}
                            <span className="text-[11px] font-black text-on-surface mt-1">৳{enToBnNumber(license.totalAmount)}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex justify-end gap-2">
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
                              <DropdownMenuContent align="end" className="w-56 rounded-2xl border-outline/10 shadow-ambient p-1.5">
                                <DropdownMenuItem asChild className="cursor-pointer font-bold py-3 px-4 rounded-xl">
                                  <Link href={`/trade-license/applications/view/${license.applicationId}`}>
                                    <Eye className="w-4 h-4 mr-3 opacity-60" /> বিস্তারিত দেখুন
                                  </Link>
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator className="bg-outline/5 my-1" />
                                
                                 {license.paymentStatus === "PAID" && (
                                  <DropdownMenuItem asChild className="cursor-pointer font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-3 px-4 rounded-xl">
                                    <Link href={`/trade-license/applications/view/${license.applicationId}/invoice`}>
                                      <Printer className="w-4 h-4 mr-3 opacity-60" /> ইনভয়েস প্রিন্ট
                                    </Link>
                                  </DropdownMenuItem>
                                )}

                                {license.paymentStatus === "UNPAID" && (
                                  <DropdownMenuItem 
                                    className="cursor-pointer font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 py-3 px-4 rounded-xl"
                                    onClick={() => {
                                      setSelectedLicense(license);
                                      setIsCollectPaymentModalOpen(true);
                                    }}
                                  >
                                    <Banknote className="w-4 h-4 mr-3 opacity-60" /> পেমেন্ট সংগ্রহ
                                  </DropdownMenuItem>
                                )}

                                {license.paymentStatus === "PAID" && (
                                  <DropdownMenuItem asChild className="cursor-pointer font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 py-3 px-4 rounded-xl">
                                    <Link href={`/trade-license/applications/view/${license.applicationId}/certificate`}>
                                      <ShieldCheck className="w-4 h-4 mr-3 opacity-60" /> সনদ প্রিন্ট করুন
                                    </Link>
                                  </DropdownMenuItem>
                                )}
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

            {meta && <TradeLicensePagination total={meta.total} />}
          </div>
        </div>
      </main>

      <CollectPaymentModal
        isOpen={isCollectPaymentModalOpen}
        onClose={() => setIsCollectPaymentModalOpen(false)}
        application={selectedLicense ? { ...selectedLicense.application, TradeLicense: selectedLicense, tradeLicense: selectedLicense } : null}
      />
    </div>
  );
};
