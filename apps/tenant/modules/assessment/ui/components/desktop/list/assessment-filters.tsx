"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, MapPin, Building2, Home } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  useAssessmentFilters,
  useWardsForSelection,
  useVillagesByWardId
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

export function AssessmentFilters() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useAssessmentFilters();
  const { data: wards = [] } = useWardsForSelection();

  // Find selected ward ID for village filtering
  const selectedWard = wards.find(w => w.name === filters.wardNo?.toString());
  const { data: villages = [] } = useVillagesByWardId(selectedWard?.id);

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || null, page: 1 });
  }, [debouncedSearch, setFilters]);

  const hasActiveFilters =
    !!filters.wardNo ||
    !!filters.villageBn ||
    !!filters.holdingNo ||
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
      villageBn: null,
      holdingNo: null,
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
            placeholder="নাম, এনআইডি, মোবাইল বা হোল্ডিং নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        {/* Holding No Filter (Quick Search) */}
        <div className="w-full sm:w-40">
          <div className="relative group">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40 z-10" />
            <Input
              inputMode="numeric"
              placeholder="হোল্ডিং নং"
              value={enToBnNumber(filters.holdingNo) || ""}
              onChange={(e) => setFilters({ ...filters, holdingNo: bnToEnNumber(e.target.value) || null, page: 1 })}
              className="pl-9 h-10 bg-surface-container-low border-none rounded-[12px] focus:ring-2 focus:ring-primary/60 font-bold text-sm w-full"
            />
          </div>
        </div>

        {/* Ward Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={filters.wardNo?.toString() || "0"}
            onValueChange={(val) => {
              const wardNo = parseInt(val);
              setFilters({
                ...filters,
                wardNo: wardNo || null,
                villageBn: null, // Reset village when ward changes
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
            disabled={!filters.wardNo}
          >
            <SelectTrigger className={cn(
              "h-10 bg-surface-container-low border-none rounded-[12px] px-4 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/60",
              !filters.wardNo && "opacity-50 cursor-not-allowed"
            )}>
              <div className="flex items-center gap-2 text-left overflow-hidden">
                <Home size={14} className="text-primary/60 flex-shrink-0" />
                <SelectValue placeholder={filters.wardNo ? "সব গ্রাম" : "আগে ওয়ার্ড সিলেক্ট করুন"} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব গ্রাম</SelectItem>
              {villages.map((village: any) => (
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
                    onClick={() => setFilters({ ...filters, wardNo: null, villageBn: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.villageBn && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    গ্রাম:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.villageBn}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, villageBn: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.holdingNo && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/10 text-xs text-primary shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1 text-on-surface">
                    হোল্ডিং:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.holdingNo}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, holdingNo: null })}
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
