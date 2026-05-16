"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, Calendar, Filter, CreditCard } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  useTradeLicenseFilters,
  useFiscalYears
} from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { cn } from "@workspace/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { enToBnNumber } from "@workspace/utils";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";

export function TradeLicenseFilters() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useTradeLicenseFilters();
  const { data: fiscalYearsData } = useFiscalYears();

  const fiscalYears = fiscalYearsData?.data?.items || [];

  useEffect(() => {
    setFilters({ search: debouncedSearch || null, page: 1 });
  }, [debouncedSearch, setFilters]);

  const hasActiveFilters =
    !!filters.fiscalYearId ||
    !!filters.paymentStatus ||
    !!filters.isExpired ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== DEFAULT_PAGE;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      fiscalYearId: null,
      paymentStatus: null,
      isExpired: null,
    });
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="bg-white p-4 flex flex-wrap items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <Input
            className="w-full bg-surface-container-low py-2.5 pl-10 pr-4 rounded-[12px] border-none focus:ring-2 focus:ring-primary/60 text-sm text-on-surface placeholder:text-on-surface-variant/40 h-10 transition-all font-bold"
            placeholder="লাইসেন্স নং, ট্র্যাকিং আইডি বা প্রতিষ্ঠানের নাম দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Fiscal Year Filter */}
        <div className="w-full sm:w-56">
          <Select
            value={filters.fiscalYearId || "all"}
            onValueChange={(val) => {
              setFilters({ fiscalYearId: val === "all" ? null : val, page: 1 });
            }}
          >
            <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2 text-left overflow-hidden">
                <Calendar size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="সব অর্থবছর" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব অর্থবছর</SelectItem>
              {fiscalYears.map((fy: any) => (
                <SelectItem key={fy.id} value={fy.id} className="font-bold">
                  {fy.nameBn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-56">
          <Select
            value={filters.paymentStatus || "all"}
            onValueChange={(val) => {
              setFilters({ paymentStatus: val === "all" ? null : val, page: 1 });
            }}
          >
            <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2 text-left overflow-hidden">
                <CreditCard size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="পেমেন্ট স্ট্যাটাস" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব স্ট্যাটাস</SelectItem>
              <SelectItem value="PAID" className="font-bold text-emerald-600">পরিশোধিত (Paid)</SelectItem>
              <SelectItem value="UNPAID" className="font-bold text-amber-600">অপ্রদত্ত (Unpaid)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expiry Filter Toggle */}
        <div className="flex items-center space-x-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100/50 hover:bg-rose-100/50 transition-all group shrink-0">
          <Checkbox 
            id="expired" 
            checked={!!filters.isExpired}
            onCheckedChange={(checked) => {
              setFilters({ isExpired: checked === true ? true : null, page: 1 });
            }}
            className="border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
          />
          <Label 
            htmlFor="expired" 
            className="text-sm font-black text-rose-700 cursor-pointer select-none group-hover:translate-x-0.5 transition-transform"
          >
            মেয়াদোত্তীর্ণ (Expired)
          </Label>
        </div>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-0">
              {filters.search && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    সার্চ:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.search}
                  </span>
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilters({ search: null });
                    }}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.fiscalYearId && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    অর্থবছর:
                  </span>
                  <span className="font-bold text-[11px]">
                    {fiscalYears.find((fy: any) => fy.id === filters.fiscalYearId)?.nameBn || "Fiscal Year"}
                  </span>
                  <button
                    onClick={() => setFilters({ fiscalYearId: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.paymentStatus && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    স্ট্যাটাস:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.paymentStatus === "PAID" ? "পরিশোধিত" : "বকেয়া"}
                  </span>
                  <button
                    onClick={() => setFilters({ paymentStatus: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.isExpired && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-100 text-xs text-rose-600 shadow-sm rounded-lg hover:bg-rose-50"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-rose-900">
                    ফিল্টার:
                  </span>
                  <span className="font-bold text-[11px]">
                    মেয়াদোত্তীর্ণ
                  </span>
                  <button
                    onClick={() => setFilters({ isExpired: null })}
                    className="hover:text-rose-800 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="ml-auto text-[10px] font-bold text-on-surface-variant hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-1.5 px-3 h-8 rounded-lg text-destructive"
              >
                <RotateCcw className="w-3 h-3 text-destructive" />
                সব রিসেট করুন
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
