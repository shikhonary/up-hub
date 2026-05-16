"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X, Filter } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useCitizenApplicationFilters } from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { cn } from "@workspace/ui/lib/utils";

export function CitizenApplicationFilters() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useCitizenApplicationFilters();

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || null });
  }, [debouncedSearch, setFilters]);

  const handleStatusChange = (status: string | null) => {
    setFilters({
      ...filters,
      status: status,
      page: 1, // Reset to first page on filter change
    });
  };

  const hasActiveFilters =
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
      status: null,
      wardNo: null,
    });
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="bg-white p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0b1c30]/50" />
          <Input
            className="w-full bg-[#f8f9ff] py-2.5 pl-10 pr-4 rounded-[12px] border-slate-200 focus:border-none focus:ring-2 focus:ring-primary/60 text-sm text-[#0b1c30] placeholder:text-[#0b1c30]/40 h-10 transition-all font-bold"
            placeholder="আবেদন খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-[#f1f5f9]/50 p-1 rounded-[12px] border border-slate-100">
          {[
            { label: "সব", value: null },
            { label: "অপেক্ষমান", value: "PENDING" },
            { label: "অনুমোদিত", value: "APPROVED" },
            { label: "প্রত্যাখ্যাত", value: "REJECTED" },
          ].map((s) => (
            <Button
              key={s.label}
              variant="ghost"
              size="sm"
              onClick={() => handleStatusChange(s.value)}
              className={cn(
                "h-8 px-4 rounded-lg text-xs font-bold transition-all duration-200",
                filters.status === s.value
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
              )}
            >
              {s.label}
            </Button>
          ))}
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

              {filters.status && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 text-xs text-emerald-700 shadow-sm rounded-lg hover:bg-white"
                >
                  <span className="font-bold text-[10px] uppercase opacity-50 mr-1">
                    অবস্থা:
                  </span>
                  <span className="font-bold text-[11px]">
                    {filters.status === "PENDING" ? "অপেক্ষমান" : filters.status === "APPROVED" ? "অনুমোদিত" : "প্রত্যাখ্যাত"}
                  </span>
                  <button
                    onClick={() => handleStatusChange(null)}
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
