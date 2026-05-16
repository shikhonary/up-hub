"use client";

import { useCitizenApplications, useApproveCitizenApplication, useRejectCitizenApplication, useCitizenApplicationFilters, useDeleteCitizenApplication } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  CheckCircle2,
  XCircle,
  Eye,
  UserCheck,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Printer,
  UserCircle,
  FileText,
  Trash2,
  MapPin
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { CitizenApplicationFilters } from "../components/desktop/list/filters";
import { CitizenApplicationStats } from "../components/desktop/list/stats";
import { CitizenApplicationPagination } from "../components/desktop/list/pagination";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useApproveCitizenModal } from "@workspace/ui/hooks/use-approve-citizen-modal";
import { useRejectCitizenModal } from "@workspace/ui/hooks/use-reject-citizen-modal";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import { ApproveCitizenModal } from "../components/desktop/modal/approve-modal";
import { RejectCitizenModal } from "../components/desktop/modal/reject-modal";
import { enToBnNumber } from "@workspace/utils";

export const CitizenApplicationsView = () => {
  const { data, isLoading } = useCitizenApplications();
  const approveMutation = useApproveCitizenApplication();
  const rejectMutation = useRejectCitizenApplication();
  const deleteMutation = useDeleteCitizenApplication();
  const { openApproveModal } = useApproveCitizenModal();
  const { openRejectModal } = useRejectCitizenModal();
  const { openDeleteModal } = useDeleteModal();

  const handleApprove = (id: string, name: string) => {
    openApproveModal({
      applicationId: id,
      applicantName: name,
      onConfirm: async (id) => {
        await approveMutation.mutateAsync(id);
      },
    });
  };

  const handleReject = (id: string, name: string) => {
    openRejectModal({
      applicationId: id,
      applicantName: name,
      onConfirm: async (id) => {
        await rejectMutation.mutateAsync(id);
      },
    });
  };

  const handleDelete = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "citizenApplication",
      entityName: name,
      onConfirm: async (id) => {
        await deleteMutation.mutateAsync(id);
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 py-1 px-2.5 rounded-lg font-bold text-[10px]">
            <Clock className="w-3 h-3" /> অপেক্ষমান
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1 px-2.5 rounded-lg font-bold text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> অনুমোদিত
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1.5 py-1 px-2.5 rounded-lg font-bold text-[10px]">
            <XCircle className="w-3 h-3" /> প্রত্যাখ্যাত
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-surface relative isolate">
      {/* Background blobs for depth */}
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-emerald-200/20 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl -z-10 pointer-events-none"
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
              নাগরিক আবেদনসমূহ
            </h1>
            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              নাগরিকদের নিবন্ধনের আবেদনগুলো পর্যালোচনা এবং যাচাই করুন। অফিসিয়াল রেকর্ড তৈরি করতে অনুমোদন করুন অথবা নথিপত্র অপর্যাপ্ত হলে প্রত্যাখ্যান করুন।
            </p>
          </div>

          <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 flex items-end gap-4">
            <Button
              asChild
              className="
                group relative overflow-hidden
                inline-flex items-center gap-2
                bg-gradient-to-br from-primary to-primary-container
                text-on-primary font-bold text-sm
                h-auto px-5 py-2.5 rounded-2xl
                border-0
                shadow-[0_4px_20px_-4px] shadow-primary/40
                hover:shadow-[0_6px_28px_-4px] hover:shadow-primary/60
                hover:scale-[1.03]
                active:scale-[0.97]
                transition-all duration-200 ease-out
              "
            >
              <Link href="/citizen/application/apply">
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
                  <UserCircle size={16} strokeWidth={3} />
                </span>
                <span className="relative">এখনই আবেদন করুন</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <CitizenApplicationStats />

        {/* Filters and Table Wrapper */}
        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5">
          <CitizenApplicationFilters />

          <div className="relative flex-grow border-t border-surface-container">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">আবেদনকারী</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">পরিচয়</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">ঠিকানা</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">অবস্থা</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">পদক্ষেপ</th>
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
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-36 bg-surface-container" />
                            <Skeleton className="h-3 w-16 bg-surface-container opacity-60" />
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <Skeleton className="h-6 w-24 bg-surface-container rounded-lg" />
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
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-40">
                          <UserCheck className="w-10 h-10" />
                          <span className="text-xs font-black uppercase tracking-widest">কোনো আবেদন পাওয়া যায়নি</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data?.data?.items.map((app: any, index: number) => (
                      <tr
                        key={app.id}
                        className="hover:bg-surface-container-low/30 transition-colors group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary transition-colors group-hover:bg-white shadow-sm border border-outline/5">
                              <UserCircle size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-black text-on-surface tracking-tight">{app.fullNameBn}</span>
                              <span className="text-[11px] text-on-surface-variant font-bold opacity-60 uppercase tracking-wider">{app.fullNameEn || "N/A"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-primary/60" />
                              <span className="text-sm font-bold tracking-tight text-on-surface">{enToBnNumber(app.nid)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-on-surface-variant/40" />
                              <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/60">
                                {app.dateOfBirth ? enToBnNumber(format(new Date(app.dateOfBirth), "dd MMM, yyyy")) : "N/A"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-primary/60" />
                              <span className="text-sm font-bold tracking-tight text-on-surface">{app.presentVillageBn}</span>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-6">ওয়ার্ড নং: {enToBnNumber(app.presentWardNo)}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          {getStatusBadge(app.status)}
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
                              <DropdownMenuContent align="end" className="w-48 rounded-xl border-outline/10 shadow-ambient">
                                <DropdownMenuItem asChild className="cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors py-2.5 px-3 rounded-lg">
                                  <Link href={`/citizens/applications/view/${app.id}`}>
                                    <Eye className="w-4 h-4 mr-2" /> বিস্তারিত দেখুন
                                  </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors py-2.5 px-3 rounded-lg">
                                  <Link href={`/citizens/applications/view/${app.id}/print`}>
                                    <Printer className="w-4 h-4 mr-2" /> আবেদন ফরম প্রিন্ট
                                  </Link>
                                </DropdownMenuItem>

                                {(app.status === "PENDING" || app.status === "REJECTED") && (
                                  <>
                                    <DropdownMenuSeparator className="bg-outline/5" />
                                    <DropdownMenuItem
                                      className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer font-bold py-2.5 px-3 rounded-lg"
                                      onClick={() => handleApprove(app.id, app.fullNameBn)}
                                      disabled={approveMutation.isPending}
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-2" /> অনুমোদন করুন
                                    </DropdownMenuItem>

                                    {app.status === "PENDING" && (
                                      <DropdownMenuItem
                                        className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer font-bold py-2.5 px-3 rounded-lg"
                                        onClick={() => handleReject(app.id, app.fullNameBn)}
                                        disabled={rejectMutation.isPending}
                                      >
                                        <XCircle className="w-4 h-4 mr-2" /> প্রত্যাখ্যান করুন
                                      </DropdownMenuItem>
                                    )}
                                  </>
                                )}

                                {app.status !== "APPROVED" && (
                                  <>
                                    <DropdownMenuSeparator className="bg-outline/5" />
                                    <DropdownMenuItem asChild className="cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors py-2.5 px-3 rounded-lg">
                                      <Link href={`/citizens/applications/edit/${app.id}`}>
                                        <Edit className="w-4 h-4 mr-2" /> তথ্য এডিট করুন
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer font-bold py-2.5 px-3 rounded-lg"
                                      onClick={() => handleDelete(app.id, app.fullNameBn)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" /> ডিলিট করুন
                                    </DropdownMenuItem>
                                  </>
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
          </div>

          <CitizenApplicationPagination total={data?.data?.total || 0} />
        </div>
      </main>

      <ApproveCitizenModal />
      <RejectCitizenModal />
    </div>
  );
};
