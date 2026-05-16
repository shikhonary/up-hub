"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, MapPin, Building2, Layers, Calendar, Filter } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  useTradeLicenseApplicationFilters,
  useWardsForSelection,
  useTradeLicenseCategories,
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
import { bnToEnNumber, enToBnNumber } from "@workspace/utils";

export function TradeLicenseApplicationFilters() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useTradeLicenseApplicationFilters();
  const { data: wards = [] } = useWardsForSelection();
  const { data: categoriesData } = useTradeLicenseCategories();
  const { data: fiscalYearsData } = useFiscalYears();

  const categories = categoriesData?.data?.items || [];
  const fiscalYears = fiscalYearsData?.data?.items || [];

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || null, page: 1 });
  }, [debouncedSearch, setFilters]);

  const hasActiveFilters =
    !!filters.wardNo ||
    !!filters.categoryId ||
    !!filters.fiscalYearId ||
    !!filters.status ||
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
      wardNo: null,
      categoryId: null,
      fiscalYearId: null,
      status: null,
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
            placeholder="প্রতিষ্ঠান, মালিক, ট্র্যাকিং আইডি, এনআইডি বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Ward Filter */}
        <div className="w-full sm:w-40">
          <Select
            value={filters.wardNo?.toString() || "all"}
            onValueChange={(val) => {
              setFilters({
                ...filters,
                wardNo: val === "all" ? null : parseInt(val),
                page: 1
              });
            }}
          >
            <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2 text-left overflow-hidden">
                <MapPin size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="সব ওয়ার্ড" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব ওয়ার্ড</SelectItem>
              {wards.map((ward) => (
                <SelectItem key={ward.id} value={ward.name} className="font-bold">
                  {ward.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={filters.categoryId || "all"}
            onValueChange={(val) => {
              setFilters({ ...filters, categoryId: val === "all" ? null : val, page: 1 });
            }}
          >
            <SelectTrigger className="h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2 text-left overflow-hidden">
                <Layers size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="সব ক্যাটাগরি" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব ক্যাটাগরি</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id} className="font-bold">
                  {category.typeBn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fiscal Year Filter */}
        <div className="w-full sm:w-40">
          <Select
            value={filters.fiscalYearId || "all"}
            onValueChange={(val) => {
              setFilters({ ...filters, fiscalYearId: val === "all" ? null : val, page: 1 });
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
              {fiscalYears.map((fy) => (
                <SelectItem key={fy.id} value={fy.id} className="font-bold">
                  {fy.nameBn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <div className="flex items-center gap-2 text-left overflow-hidden">
                <Filter size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder="সব স্ট্যাটাস" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব স্ট্যাটাস</SelectItem>
              <SelectItem value="PENDING" className="font-bold">পেন্ডিং</SelectItem>
              <SelectItem value="APPROVED" className="font-bold">অনুমোদিত</SelectItem>
              <SelectItem value="REJECTED" className="font-bold">বাতিলকৃত</SelectItem>
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
                      setFilters({ ...filters, search: null });
                    }}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.wardNo && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    ওয়ার্ড:
                  </span>
                  <span className="font-bold text-[11px]">
                    ওয়ার্ড নং {enToBnNumber(filters.wardNo)}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, wardNo: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.categoryId && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    ক্যাটাগরি:
                  </span>
                  <span className="font-bold text-[11px]">
                    {categories.find(c => c.id === filters.categoryId)?.typeBn || "Category"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, categoryId: null })}
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
                    {fiscalYears.find(fy => fy.id === filters.fiscalYearId)?.nameBn || "Fiscal Year"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, fiscalYearId: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.status && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    স্ট্যাটাস:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.status === "PENDING" ? "পেন্ডিং" : filters.status === "APPROVED" ? "অনুমোদিত" : "বাতিলকৃত"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, status: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
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
