"use client";

import { Edit, Hash, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { TenantTypes } from "@workspace/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { enToBnNumber } from "@workspace/utils";

interface CertificateCounterTableProps {
  counters: TenantTypes.CertificateCounter[];
  isLoading: boolean;
  onEdit: (counter: TenantTypes.CertificateCounter) => void;
  onDelete: (id: string, name: string) => void;
}

export const CertificateCounterTable = ({
  counters,
  isLoading,
  onEdit,
  onDelete,
}: CertificateCounterTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest overflow-hidden border-t border-outline/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">
                  সনদপত্রের ধরন ও আইডি
                </th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">
                  বাংলা নাম
                </th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-center border-b border-outline/5">
                  বর্তমান কাউন্টার
                </th>
                <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {[...Array(5)].map((_, i) => (
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
                    <Skeleton className="h-4 w-40 bg-surface-container" />
                  </td>
                  <td className="py-5 px-6">
                    <Skeleton className="h-6 w-16 mx-auto bg-surface-container rounded-lg" />
                  </td>
                  <td className="py-5 px-6 text-right">
                    <Skeleton className="w-10 h-10 rounded-xl ml-auto bg-surface-container" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (counters.length === 0) {
    return (
      <div className="bg-surface-container-lowest py-24 text-center border-t border-outline/5">
        <div className="flex flex-col items-center gap-4 opacity-40 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 rounded-[32px] bg-surface-container flex items-center justify-center text-slate-400">
            <Hash size={40} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
              কোনো রেকর্ড পাওয়া যায়নি
            </h3>
            <p className="text-[10px] font-bold text-on-surface-variant/40 italic">
              এখনো কোনো সনদপত্র কাউন্টার তৈরি করা হয়নি।
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest overflow-hidden border-t border-outline/5 relative isolate">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">
                সনদপত্রের ধরন ও আইডি
              </th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">
                বাংলা নাম
              </th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-center border-b border-outline/5">
                বর্তমান কাউন্টার
              </th>
              <th className="py-3 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant text-right border-b border-outline/5">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/5">
            {counters.map((counter, index) => (
              <tr
                key={counter.id}
                className="hover:bg-surface-container-low/30 transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary transition-all group-hover:bg-white shadow-sm border border-outline/5">
                      <Hash size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-black text-on-surface tracking-tight group-hover:text-primary transition-colors leading-tight uppercase">
                        {counter.typeEn}
                      </span>
                      <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mt-0.5">
                        আইডি: {counter.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="text-sm font-bold text-on-surface-variant">
                    {counter.typeBn}
                  </span>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary border border-primary/10 shadow-sm">
                    {enToBnNumber(counter.count)}
                  </span>
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
                        <DropdownMenuItem
                          onClick={() => onEdit(counter)}
                          className="py-3 px-4 rounded-xl cursor-pointer font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-3 opacity-60" /> কাউন্টার এডিট
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-outline/5 my-1" />
                        <DropdownMenuItem
                          className="py-3 px-4 rounded-xl cursor-pointer font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors flex items-center"
                          onClick={() => onDelete(counter.id, counter.typeBn)}
                        >
                          <Trash2 className="w-4 h-4 mr-3 opacity-60" /> কাউন্টার ডিলিট
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
