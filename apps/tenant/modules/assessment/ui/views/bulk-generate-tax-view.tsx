"use client";

import React, { useState, useEffect } from "react";
import {
  useAssessments,
  useFiscalYearsForSelection,
  useBulkGenerateTax,
} from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Calculator,
  Calendar,
  FileSpreadsheet,
  MapPin,
  UserCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { AssessmentFilters } from "../components/desktop/list/assessment-filters";
import { AssessmentPagination } from "../components/desktop/list/assessment-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { enToBnNumber } from "@workspace/utils";

export const BulkGenerateTaxView = () => {
  const { data, isLoading } = useAssessments();
  const { data: fiscalYears = [] } = useFiscalYearsForSelection();
  const { mutateAsync: bulkGenerateTax, isPending: isGenerating } = useBulkGenerateTax();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>("");
  
  // Auto-select current fiscal year
  useEffect(() => {
    if (!selectedFiscalYear && fiscalYears.length > 0) {
      const currentFY = fiscalYears.find((fy: any) => fy.isCurrent);
      if (currentFY) {
        setSelectedFiscalYear(currentFY.id);
      }
    }
  }, [fiscalYears, selectedFiscalYear]);

  const assessments = data?.data?.items || [];
  const totalItems = data?.data?.total || 0;

  const toggleSelectAll = () => {
    if (selectedIds.length === assessments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(assessments.map((a: any) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!selectedFiscalYear || selectedIds.length === 0) return;
    try {
      await bulkGenerateTax({
        assessmentIds: selectedIds,
        fiscalYearId: selectedFiscalYear,
      });
      setSelectedIds([]);
    } catch (error) {
      // Error is handled by the hook's toast
    }
  };

  const selectedTotalTax = assessments
    .filter((a: any) => selectedIds.includes(a.id))
    .reduce((sum: number, a: any) => sum + (a.totalTax || 0), 0);

  return (
    <div className="min-h-screen bg-surface relative isolate">
      {/* Background blobs for depth */}
      <div
        aria-hidden
        className="absolute top-[10%] -left-16 w-72 h-72 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[20%] -right-16 w-96 h-96 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none"
      />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              ট্যাক্স জেনারেট (Bulk)
            </h1>
            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              এসেসমেন্টসমূহ নির্বাচন করুন এবং অর্থবছর অনুযায়ী হোল্ডিং ট্যাক্স জেনারেট করুন।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="w-full sm:w-64">
              <Select value={selectedFiscalYear} onValueChange={setSelectedFiscalYear}>
                <SelectTrigger className="h-12 bg-white/50 backdrop-blur-sm border-outline/10 rounded-2xl px-4 text-sm font-bold shadow-sm focus:ring-primary/20 transition-all hover:bg-white">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-primary/60" />
                    <SelectValue placeholder="অর্থবছর নির্বাচন করুন" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-outline/10 shadow-ambient p-1.5">
                  {fiscalYears.map((fy: any) => (
                    <SelectItem key={fy.id} value={fy.id} className="font-bold rounded-xl py-2.5">
                      {fy.nameBn} {fy.isCurrent && "(বর্তমান)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={selectedIds.length === 0 || !selectedFiscalYear || isGenerating}
              className={cn(
                "group relative overflow-hidden h-12 px-8 rounded-2xl font-bold text-sm shadow-lg transition-all duration-300",
                selectedIds.length > 0 && selectedFiscalYear
                  ? "bg-primary text-white hover:scale-105 hover:shadow-primary/40 active:scale-95"
                  : "bg-surface-container-high text-on-surface-variant/40"
              )}
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  জেনারেট করুন ({enToBnNumber(selectedIds.length)})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Selection Stats Bar */}
        {selectedIds.length > 0 && (
          <div className="mb-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">নির্বাচিত আইটেম</p>
                  <p className="text-lg font-black text-primary leading-tight">
                    {enToBnNumber(selectedIds.length)} টি এসেসমেন্ট
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">মোট ট্যাক্স পরিমাণ</p>
                  <p className="text-xl font-black text-primary leading-tight">
                    ৳{enToBnNumber(selectedTotalTax)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Wrapper */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate">
          <AssessmentFilters />

          <div className="relative flex-grow border-t border-surface-container">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="py-4 px-6 w-12 border-b border-outline/5">
                      <Checkbox
                        checked={selectedIds.length === assessments.length && assessments.length > 0}
                        onCheckedChange={toggleSelectAll}
                        className="rounded-md border-outline/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </th>
                    <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">আবেদনকারীর তথ্য</th>
                    <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5">হোল্ডিং ও এলাকা</th>
                    <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant border-b border-outline/5 text-right">ধার্যকৃত কর</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/5">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="py-5 px-6">
                          <Skeleton className="w-5 h-5 rounded bg-surface-container" />
                        </td>
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
                        <td className="py-5 px-6 text-right">
                          <Skeleton className="h-6 w-24 ml-auto bg-surface-container rounded-lg" />
                        </td>
                      </tr>
                    ))
                  ) : assessments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-40">
                          <div className="w-20 h-20 rounded-[32px] bg-surface-container flex items-center justify-center text-slate-400">
                            <FileSpreadsheet className="w-10 h-10" />
                          </div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">কোনো রেকর্ড পাওয়া যায়নি</h3>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    assessments.map((assessment: any, index: number) => (
                      <tr
                        key={assessment.id}
                        className={cn(
                          "hover:bg-surface-container-low/30 transition-colors group cursor-pointer",
                          selectedIds.includes(assessment.id) && "bg-primary/[0.03]"
                        )}
                        onClick={() => toggleSelect(assessment.id)}
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="py-5 px-6">
                          <Checkbox
                            checked={selectedIds.includes(assessment.id)}
                            onCheckedChange={() => toggleSelect(assessment.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-md border-outline/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-sm border border-outline/5 group-hover:bg-white transition-all">
                              <UserCircle size={20} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">{assessment.fullNameBn}</span>
                              <div className="flex items-center gap-1.5 opacity-60">
                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest py-0 px-1.5 border-outline/10 h-4 min-h-0">
                                  NID: {enToBnNumber(assessment.nid) || "N/A"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-primary/60" />
                              <span className="text-sm font-bold text-on-surface">{assessment.villageBn}</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-60">
                              <span className="text-[10px] font-black uppercase tracking-widest">হোল্ডিং: {enToBnNumber(assessment.holdingNo)}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest">ওয়ার্ড: {enToBnNumber(assessment.wardNo)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-black text-primary tracking-tight">৳{enToBnNumber(assessment.totalTax)}</span>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">রেট: {enToBnNumber(assessment.taxRatePercent)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalItems > 0 && (
              <div className="p-6 border-t border-outline/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                   মোট {enToBnNumber(totalItems)} টি রেকর্ডের মধ্যে {enToBnNumber(assessments.length)} টি দেখানো হচ্ছে
                </p>
                <AssessmentPagination total={totalItems} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
