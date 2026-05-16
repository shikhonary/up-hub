"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, X } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  useTradeLicenseCategoryFilters,
} from "@workspace/api-client";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { Badge } from "@workspace/ui/components/badge";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@workspace/utils/constants";
import { cn } from "@workspace/ui/lib/utils";

export function TradeLicenseCategoryFilters() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useTradeLicenseCategoryFilters();

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch || null });
  }, [debouncedSearch, setFilters]);

  const hasActiveFilters =
    !!filters.sortBy ||
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
            placeholder="ক্যাটাগরি খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                <button onClick={() => { setSearch(""); setFilters({ ...filters, search: null }); }} className="ml-2 hover:text-rose-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="ml-auto text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg h-8 px-3 transition-all"
            >
              <RotateCcw className="w-3 h-3 mr-1.5" /> রিসেট
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
