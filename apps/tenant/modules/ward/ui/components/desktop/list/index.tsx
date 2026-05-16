"use client";

import { useState } from "react";
import { Header } from "./header";
import { Stats } from "./stats";
import { Filters } from "./filters";
import { WardTable } from "./ward-table";
import { Pagination } from "./pagination";
import { TenantTypes } from "@workspace/db";

type ViewMode = "table" | "grid";

interface WardListProps {
  wards: TenantTypes.Ward[];
  isLoading: boolean;
  total: number;
  onToggleActive: (id: string) => Promise<void> | void;
  onEdit: (ward: TenantTypes.Ward) => void;
  onDelete: (id: string, name: string) => void;
  onAdd: () => void;
}

export const List = ({
  wards,
  isLoading,
  total,
  onToggleActive,
  onEdit,
  onDelete,
  onAdd,
}: WardListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <div className="hidden md:block min-h-screen bg-surface relative isolate">
      {/* Background blobs for depth */}
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none"
      />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        <Header
          title="ইউনিয়ন ওয়ার্ডসমূহ"
          description="ইউনিয়ন পরিষদের প্রশাসনিক ওয়ার্ডসমূহ পরিচালনা করুন। প্রতিটি ওয়ার্ডের সীমানা এবং তদারকি নিশ্চিত করুন।"
          onAdd={onAdd}
        />

        <div className="mt-8">
          <Stats />
        </div>

        <div className="mt-12 bg-surface-container-lowest rounded-3xl shadow-ambient overflow-hidden flex flex-col border border-outline/5">
          <Filters viewMode={viewMode} onViewModeChange={setViewMode} />

          <div className="relative flex-grow">
            {viewMode === "table" ? (
              <WardTable
                wards={wards}
                isLoading={isLoading}
                onToggleActive={onToggleActive}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ) : (
              <div className="p-8 text-center text-on-surface-variant font-medium italic opacity-60">
                Grid view coming soon...
              </div>
            )}
          </div>

          <Pagination total={total} />
        </div>
      </main>
    </div>
  );
};
