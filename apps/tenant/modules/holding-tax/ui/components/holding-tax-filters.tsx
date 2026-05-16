"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, MapPin, Building2, Calendar, Filter } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  useHoldingTaxFilters,
  useWardsForSelection,
  useFiscalYearsForSelection,
  useVillagesForSelection,
} from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { cn } from "@workspace/ui/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { bnToEnNumber, enToBnNumber } from "@workspace/utils";

export function HoldingTaxFilters() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useHoldingTaxFilters();
  const { data: wards = [] } = useWardsForSelection();
  const { data: fiscalYears = [] } = useFiscalYearsForSelection();
  const { data: villages = [] } = useVillagesForSelection();

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || null, page: 1 });
  }, [debouncedSearch, setFilters]);

  const hasActiveFilters =
    !!filters.wardNo ||
    !!filters.status ||
    !!filters.fiscalYearId ||
    !!filters.villageBn ||
    !!filters.search ||
    filters.limit !== DEFAULT_PAGE_SIZE ||
    filters.page !== 1;

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      search: null,
      limit: null,
      page: null,
      sortBy: null,
      wardNo: null,
      status: null,
      fiscalYearId: null,
      villageBn: null,
    });
  };

  return (
    <div className="bg-white overflow-hidden border-b border-outline/5">
      <div className="bg-white p-4 flex flex-wrap items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <Input
            className="w-full bg-surface-container-low py-2.5 pl-10 pr-4 rounded-[12px] border-none focus:ring-2 focus:ring-primary/60 text-sm text-on-surface placeholder:text-on-surface-variant/40 h-10 transition-all font-bold"
            placeholder="নাম, এনআইডি বা হোল্ডিং নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-40">
          <Select
            value={filters.status || "all"}
            onValueChange={(val) => {
              setFilters({ ...filters, status: val === "all" ? null : val, page: 1 });
            }}
          >
            <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2 text-left">
                <Filter size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="সব স্ট্যাটাস" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব স্ট্যাটাস</SelectItem>
              <SelectItem value="UNPAID" className="font-bold">বকেয়া (UNPAID)</SelectItem>
              <SelectItem value="PARTIAL" className="font-bold">আংশিক (PARTIAL)</SelectItem>
              <SelectItem value="PAID" className="font-bold">পরিশোধিত (PAID)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fiscal Year Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={filters.fiscalYearId || "all"}
            onValueChange={(val) => {
              setFilters({ ...filters, fiscalYearId: val === "all" ? null : val, page: 1 });
            }}
          >
            <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2 text-left">
                <Calendar size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="সব অর্থবছর" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব অর্থবছর</SelectItem>
              {fiscalYears.map((fy) => (
                <SelectItem key={fy.id} value={fy.id} className="font-bold">
                  {fy.nameBn} {fy.isCurrent && "(বর্তমান)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ward Filter */}
        <div className="w-full sm:w-40">
          <Select
            value={filters.wardNo?.toString() || "0"}
            onValueChange={(val) => {
              setFilters({ ...filters, wardNo: parseInt(val) || null, page: 1 });
            }}
          >
            <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2 text-left">
                <MapPin size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="সব ওয়ার্ড" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="0" className="font-bold">সব ওয়ার্ড</SelectItem>
              {wards.map((ward) => (
                <SelectItem key={ward.id} value={ward.name} className="font-bold">
                  {ward.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Village Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={filters.villageBn || "all"}
            onValueChange={(val) => {
              setFilters({ ...filters, villageBn: val === "all" ? null : val, page: 1 });
            }}
          >
            <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2 text-left">
                <Building2 size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="সব গ্রাম" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব গ্রাম</SelectItem>
              {villages.map((village) => (
                <SelectItem key={village.id} value={village.displayName} className="font-bold">
                  {village.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-0"
          >
            {filters.search && (
              <Badge variant="secondary" className="bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg py-1 px-3">
                <span className="opacity-50 mr-1">সার্চ:</span> {filters.search}
                <button onClick={() => { setSearch(""); setFilters({ ...filters, search: null }); }} className="ml-2 hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.status && (
              <Badge variant="secondary" className="bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg py-1 px-3">
                <span className="opacity-50 mr-1">স্ট্যাটাস:</span> {filters.status}
                <button onClick={() => setFilters({ ...filters, status: null })} className="ml-2 hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.fiscalYearId && (
              <Badge variant="secondary" className="bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg py-1 px-3">
                <span className="opacity-50 mr-1">অর্থবছর:</span> {fiscalYears.find(f => f.id === filters.fiscalYearId)?.nameBn}
                <button onClick={() => setFilters({ ...filters, fiscalYearId: null })} className="ml-2 hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.wardNo && (
              <Badge variant="secondary" className="bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg py-1 px-3">
                <span className="opacity-50 mr-1">ওয়ার্ড:</span> {enToBnNumber(filters.wardNo)}
                <button onClick={() => setFilters({ ...filters, wardNo: null })} className="ml-2 hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.villageBn && (
              <Badge variant="secondary" className="bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg py-1 px-3">
                <span className="opacity-50 mr-1">গ্রাম:</span> {filters.villageBn}
                <button onClick={() => setFilters({ ...filters, villageBn: null })} className="ml-2 hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="ml-auto text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg h-8 px-3"
            >
              <RotateCcw className="w-3 h-3 mr-1.5" /> রিসেট
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
