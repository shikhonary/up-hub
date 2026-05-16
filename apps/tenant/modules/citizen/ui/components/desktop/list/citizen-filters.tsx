"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, MapPin, UserCircle, Home } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  useCitizenFilters,
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
import { enToBnNumber } from "@workspace/utils";

export function CitizenFilters() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useCitizenFilters();
  const { data: wards = [] } = useWardsForSelection();

  // Find selected ward ID for village filtering
  const selectedWard = wards.find(w => w.name === filters.wardNo?.toString());
  const { data: villages = [] } = useVillagesByWardId(selectedWard?.id);

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || null, page: 1 });
  }, [debouncedSearch, setFilters]);

  const hasActiveFilters =
    !!filters.wardNo ||
    !!filters.village ||
    !!filters.gender ||
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
      village: null,
      gender: null,
    });
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="bg-white p-4 flex flex-wrap items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0b1c30]/50" />
          <Input
            className="w-full bg-[#f8f9ff] py-2.5 pl-10 pr-4 rounded-[12px] border-slate-200 focus:border-none focus:ring-2 focus:ring-primary/60 text-sm text-[#0b1c30] placeholder:text-[#0b1c30]/40 h-10 transition-all font-bold"
            placeholder="নাম, এনআইডি বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                village: null, // Reset village when ward changes
                page: 1
              });
            }}
          >
            <SelectTrigger className="h-10 bg-[#f8f9ff] border-slate-200 rounded-[12px] px-4 text-sm font-bold text-[#0b1c30] focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-600/60" />
                <SelectValue placeholder="সব ওয়ার্ড" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-ambient">
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
            value={filters.village || "all"}
            onValueChange={(val) => {
              setFilters({ ...filters, village: val === "all" ? null : val, page: 1 });
            }}
            disabled={!filters.wardNo}
          >
            <SelectTrigger className={cn(
              "h-10 bg-[#f8f9ff] border-slate-200 rounded-[12px] px-4 text-sm font-bold text-[#0b1c30] focus:ring-2 focus:ring-primary/60",
              !filters.wardNo && "opacity-50 cursor-not-allowed"
            )}>
              <div className="flex items-center gap-2">
                <Home size={14} className="text-emerald-600/60" />
                <SelectValue placeholder={filters.wardNo ? "সব গ্রাম" : "আগে ওয়ার্ড সিলেক্ট করুন"} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব গ্রাম</SelectItem>
              {villages.map((village: any) => (
                <SelectItem key={village.id} value={village.displayName} className="font-bold">
                  {village.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gender Filter */}
        <div className="w-full sm:w-40">
          <Select
            value={filters.gender || "all"}
            onValueChange={(val) => {
              setFilters({ ...filters, gender: val === "all" ? null : val, page: 1 });
            }}
          >
            <SelectTrigger className="h-10 bg-[#f8f9ff] border-slate-200 rounded-[12px] px-4 text-sm font-bold text-[#0b1c30] focus:ring-2 focus:ring-primary/60">
              <div className="flex items-center gap-2">
                <UserCircle size={14} className="text-emerald-600/60" />
                <SelectValue placeholder="লিঙ্গ" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-ambient">
              <SelectItem value="all" className="font-bold">সব লিঙ্গ</SelectItem>
              <SelectItem value="MALE" className="font-bold">পুরুষ</SelectItem>
              <SelectItem value="FEMALE" className="font-bold">মহিলা</SelectItem>
              <SelectItem value="OTHER" className="font-bold">অন্যান্য</SelectItem>
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
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
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
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    ওয়ার্ড:
                  </span>
                  <span className="font-bold text-[11px]">
                    ওয়ার্ড নং {enToBnNumber(filters.wardNo)}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, wardNo: null, village: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.village && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    গ্রাম:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.village}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, village: null })}
                    className="hover:text-rose-500 transition-colors ml-1"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </Badge>
              )}

              {filters.gender && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    লিঙ্গ:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.gender === "MALE" ? "পুরুষ" : filters.gender === "FEMALE" ? "মহিলা" : "অন্যান্য"}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, gender: null })}
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
                className="ml-auto text-[10px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-1.5 px-3 h-8 rounded-lg text-destructive"
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
