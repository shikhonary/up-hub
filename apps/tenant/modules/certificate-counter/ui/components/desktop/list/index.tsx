"use client";

import { useState } from "react";
import { Header } from "./header";
import { Filters } from "./filters";
import { CertificateCounterTable } from "../../certificate-counter-table";
import { Pagination } from "./pagination";
import { TenantTypes } from "@workspace/db";

type ViewMode = "table" | "grid";

interface CertificateCounterListProps {
  counters: TenantTypes.CertificateCounter[];
  isLoading: boolean;
  total: number;
  onEdit: (counter: TenantTypes.CertificateCounter) => void;
  onDelete: (id: string, name: string) => void;
  onAdd: () => void;
}

export const List = ({
  counters,
  isLoading,
  total,
  onEdit,
  onDelete,
  onAdd,
}: CertificateCounterListProps) => {
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
          title="সনদপত্র কাউন্টারসমূহ"
          description="বিভিন্ন ধরনের সনদপত্রের কাউন্টার পরিচালনা করুন। প্রতিটি সনদপত্রের জন্য একটি অনন্য কাউন্টার ট্র্যাক করা হয়।"
          onAdd={onAdd}
        />

        <div className="mt-12 bg-surface-container-lowest rounded-3xl shadow-ambient overflow-hidden flex flex-col border border-outline/5">
          <Filters viewMode={viewMode} onViewModeChange={setViewMode} />

          <div className="relative flex-grow">
            {viewMode === "table" ? (
              <CertificateCounterTable
                counters={counters}
                isLoading={isLoading}
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
