"use client";

import { useCitizens } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  CheckCircle2,
  Eye,
  UserCircle,
  FileText,
  MapPin,
  Phone,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Search,
  Filter,
  UserCheck,
  Plus
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { CitizenStats } from "@/modules/citizen/ui/components/desktop/list/citizen-stats";
import { CitizenFilters } from "@/modules/citizen/ui/components/desktop/list/citizen-filters";
import { CitizenPagination } from "@/modules/citizen/ui/components/desktop/list/citizen-pagination";
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

export const CitizensView = () => {
  const { data, isLoading } = useCitizens();
  const { openDeleteModal } = useDeleteModal();

  const handleDelete = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "citizenApplication", // Using application type for now until direct citizen delete is mapped
      entityName: name,
      onConfirm: async (id) => {
        // Implementation for delete citizen record
      },
    });
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
                অফিসিয়াল নাগরিকবৃন্দ
            </h1>
            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
                নিবন্ধিত নাগরিকদের বিস্তারিত তথ্য পরিচালনা করুন। পরিচয়পত্র, আবাসস্থল এবং যোগাযোগের তথ্য যাচাই করুন।
            </p>
          </div>

          <div className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <Link href="/citizens/applications/apply">
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
                <span className="relative">নাগরিক যোগ করুন</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <CitizenStats />

        {/* Filters and Table Wrapper */}
        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5">
          <CitizenFilters />

          <div className="relative flex-grow border-t border-surface-container">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">নাগরিকের তথ্য</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">পরিচয় ও যোগাযোগ</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">আবাসিক তথ্য</th>
                    <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">অবস্থা</th>
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
                          <span className="text-xs font-black uppercase tracking-widest text-slate-500">রেজিস্ট্রিতে কোনো নাগরিক খুঁজে পাওয়া যায়নি</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data?.data?.items.map((citizen: any, index: number) => (
                      <tr
                        key={citizen.id}
                        className="hover:bg-surface-container-low/30 transition-colors group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary transition-colors group-hover:bg-white shadow-sm border border-outline/5">
                              <UserCircle size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-black text-on-surface tracking-tight">{citizen.fullNameBn}</span>
                              <span className="text-[11px] text-on-surface-variant font-bold opacity-60 uppercase tracking-wider">{citizen.fullNameEn || "N/A"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-primary/60" />
                              <span className="text-sm font-bold tracking-tight text-on-surface">{enToBnNumber(citizen.nid)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-on-surface-variant/40" />
                              <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/60">
                                {enToBnNumber(citizen.mobile) || "ফোন নেই"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-primary/60" />
                              <span className="text-sm font-bold tracking-tight text-on-surface">{citizen.presentVillageBn}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-6">
                              <Badge variant="outline" className="bg-surface-container text-on-surface-variant border-outline/5 font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                                ওয়ার্ড নং: {enToBnNumber(citizen.presentWardNo)}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1 px-2.5 rounded-lg font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> নিবন্ধিত
                          </Badge>
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
                                  <Link href={`/citizens/view/${citizen.id}`}>
                                    <Eye className="w-4 h-4 mr-2" /> প্রোফাইল দেখুন
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors py-2.5 px-3 rounded-lg">
                                  <Link href={`/citizens/edit/${citizen.id}`}>
                                    <Edit className="w-4 h-4 mr-2" /> তথ্য এডিট করুন
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-outline/5 my-1" />
                                <DropdownMenuItem
                                  className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer font-bold py-2.5 px-3 rounded-xl"
                                  onClick={() => handleDelete(citizen.id, citizen.fullNameBn)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> ডিলিট করুন
                                </DropdownMenuItem>
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
              <CitizenPagination total={data.data.total} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
