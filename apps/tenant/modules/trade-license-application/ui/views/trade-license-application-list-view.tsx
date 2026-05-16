"use client";

import { useTradeLicenseApplications, useDeleteTradeLicenseApplication, useUpdateTradeLicenseApplicationStatus } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Eye,
  FileText,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Briefcase,
  UserCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Printer,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { TradeLicenseApplicationStats } from "../components/desktop/list/trade-license-application-stats";
import { TradeLicenseApplicationFilters } from "../components/desktop/list/trade-license-application-filters";
import { TradeLicenseApplicationPagination } from "../components/desktop/list/trade-license-application-pagination";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { enToBnNumber } from "@workspace/utils";
import { useState } from "react";
import { GenerateTradeLicenseModal } from "../components/generate-trade-license-modal";
import { RejectTradeLicenseApplicationModal } from "../components/reject-trade-license-application-modal";

export const TradeLicenseApplicationListView = () => {
  const { data, isLoading } = useTradeLicenseApplications();
  const { mutateAsync: deleteApplication } = useDeleteTradeLicenseApplication();
  const { mutateAsync: updateStatus } = useUpdateTradeLicenseApplicationStatus();
  const { openDeleteModal } = useDeleteModal();

  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleDelete = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "trade-license-application",
      entityName: name,
      onConfirm: async (id) => {
        await deleteApplication(id);
      },
    });
  };

  const handleApprove = (application: any) => {
    setSelectedApplication(application);
    setIsGenerateModalOpen(true);
  };

  const handleReject = (application: any) => {
    setSelectedApplication(application);
    setIsRejectModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-black text-[10px] uppercase tracking-widest gap-1.5 px-2.5 py-1">
            <Clock className="w-3 h-3" /> অপেক্ষমান
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] uppercase tracking-widest gap-1.5 px-2.5 py-1">
            <CheckCircle2 className="w-3 h-3" /> অনুমোদিত
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-black text-[10px] uppercase tracking-widest gap-1.5 px-2.5 py-1">
            <XCircle className="w-3 h-3" /> বাতিলকৃত
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
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none"
      />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
          />

          <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              ট্রেড লাইসেন্স আবেদন তালিকা
            </h1>
            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              ইউনিয়ন পরিষদের নতুন ও পুরাতন ট্রেড লাইসেন্স আবেদনসমূহ পরিচালনা করুন।
            </p>
          </div>

          <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <Link href="/trade-license/apply">
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
                <span
                  aria-hidden
                  className="
                    pointer-events-none absolute inset-0
                    translate-x-[-100%] skew-x-[-20deg]
                    bg-white/20
                    group-hover:translate-x-[120%]
                    transition-transform duration-500 ease-in-out
                  "
                />

                <span className="relative flex items-center justify-center rounded-lg bg-white/20 p-0.5">
                  <Plus size={16} strokeWidth={3} />
                </span>
                <span className="relative">নতুন আবেদন</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <TradeLicenseApplicationStats />

        {/* Filters and Table Wrapper */}
        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate">
          <TradeLicenseApplicationFilters />

          <div className="relative flex-grow border-t border-surface-container">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">প্রতিষ্ঠানের তথ্য</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">মালিকের তথ্য</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">ক্যাটাগরি ও ওয়ার্ড</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-center border-b border-outline/5">স্ট্যাটাস</th>
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
                        <td className="py-5 px-6 text-center">
                          <Skeleton className="h-4 w-24 mx-auto bg-surface-container" />
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-40 bg-surface-container" />
                            <Skeleton className="h-3 w-24 bg-surface-container opacity-60" />
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
                  ) : data?.data?.items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-40 animate-in fade-in zoom-in duration-700">
                          <div className="w-20 h-20 rounded-[32px] bg-surface-container flex items-center justify-center text-slate-400">
                            <FileText className="w-10 h-10" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">কোনো আবেদন পাওয়া যায়নি</h3>
                            <p className="text-[10px] font-bold text-on-surface-variant/40 italic">অনুগ্রহ করে ভিন্ন কোনো ফিল্টার ব্যবহার করে দেখুন</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data?.data?.items.map((application: any, index: number) => (
                      <tr
                        key={application.id}
                        className="hover:bg-surface-container-low/30 transition-colors group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary transition-all group-hover:bg-white shadow-sm border border-outline/5">
                              <Briefcase size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">{application.orgNameBn}</span>
                              <div className="flex items-center gap-3 opacity-60">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                                  {enToBnNumber(application.trackingId || application.id.slice(0, 10).toUpperCase())}
                                </span>
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">মোবাইল: {enToBnNumber(application.mobileBn)}</span>
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
                              <span className="text-sm font-bold text-on-surface">{application.fullNameBn}</span>
                              <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">NID: {enToBnNumber(application.nidBn) || "N/A"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                                {application.tradeLicenseCategory?.typeBn}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 opacity-60">
                              <MapPin size={14} className="text-on-surface-variant" />
                              <span className="text-[11px] font-bold text-on-surface-variant">ওয়ার্ড নং {enToBnNumber(application.businessWardNo)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center">
                          {getStatusBadge(application.status)}
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
                              <DropdownMenuContent align="end" className="w-52 rounded-2xl border-outline/10 shadow-ambient p-1.5">
                                <DropdownMenuItem asChild className="cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors py-3 px-4 rounded-xl">
                                  <Link href={`/trade-license/applications/view/${application.id}`}>
                                    <Eye className="w-4 h-4 mr-3 opacity-60" /> বিস্তারিত দেখুন
                                  </Link>
                                </DropdownMenuItem>
                                {application.status !== "APPROVED" && (
                                  <DropdownMenuItem asChild className="cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors py-3 px-4 rounded-xl">
                                    <Link href={`/trade-license/applications/edit/${application.id}`}>
                                      <Edit className="w-4 h-4 mr-3 opacity-60" /> এডিট করুন
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild className="cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors py-3 px-4 rounded-xl">
                                  <Link href={`/trade-license/applications/view/${application.id}/print`}>
                                    <Printer className="w-4 h-4 mr-3 opacity-60" /> আবেদন প্রিন্ট করুন
                                  </Link>
                                </DropdownMenuItem>
                                {application.status === "PENDING" && (
                                  <>
                                    <DropdownMenuItem
                                      className="cursor-pointer font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors py-3 px-4 rounded-xl"
                                      onClick={() => handleApprove(application)}
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-3 opacity-60" /> অনুমোদন করুন
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="cursor-pointer font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors py-3 px-4 rounded-xl"
                                      onClick={() => handleReject(application)}
                                    >
                                      <XCircle className="w-4 h-4 mr-3 opacity-60" /> বাতিল করুন
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {/* ডিলিট অপশন বন্ধ করা হয়েছে */}
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
              <TradeLicenseApplicationPagination total={data.data.total} />
            )}
          </div>
        </div>
      </main>

      <GenerateTradeLicenseModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        application={selectedApplication}
      />

      <RejectTradeLicenseApplicationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        application={selectedApplication}
      />


    </div>
  );
};
