"use client";

import React from "react";
import {
  useTradeLicenseCategories,
  useCreateTradeLicenseCategory,
  useUpdateTradeLicenseCategory,
  useDeleteTradeLicenseCategory,
  useTradeLicenseCategoryFilters
} from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";
import {
  useCreateTradeLicenseCategoryModal,
  useEditTradeLicenseCategoryModal
} from "@workspace/ui/hooks/use-trade-license-category-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Plus, Save, Briefcase } from "lucide-react";
import { TradeLicenseCategoryForm } from "../components/trade-license-category-form";
import { TradeLicenseCategoryTable } from "../components/trade-license-category-table";
import { TradeLicenseCategoryFilters } from "../components/desktop/list/filters";
import { TradeLicenseCategoryPagination } from "../components/desktop/list/pagination";

export const TradeLicenseCategoryView = () => {
  const { openDeleteModal } = useDeleteModal();
  const createModal = useCreateTradeLicenseCategoryModal();
  const editModal = useEditTradeLicenseCategoryModal();
  const [filters] = useTradeLicenseCategoryFilters();

  const { data: categories, isLoading } = useTradeLicenseCategories(filters);

  const createMutation = useCreateTradeLicenseCategory();
  const updateMutation = useUpdateTradeLicenseCategory();
  const deleteMutation = useDeleteTradeLicenseCategory();

  const categoryItems = categories?.data?.items || [];
  const total = categories?.data?.total || 0;

  const handleDeleteCategory = (id: string, name: string) => {
    openDeleteModal({
      entityId: id,
      entityType: "category",
      entityName: name,
      onConfirm: (id) => {
        deleteMutation.mutateAsync({ id });
      },
    });
  };

  return (
    <div className="min-h-screen bg-surface relative isolate">
      {/* Background blobs */}
      <div className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none" />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              ট্রেড লাইসেন্স ক্যাটাগরি ব্যবস্থাপনা
            </h1>
            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              ব্যবসার বিভিন্ন ধরণ ও ক্যাটাগরি পরিচালনা করুন।
            </p>
          </div>

          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <Button
              onClick={createModal.onOpen}
              className="
                group relative overflow-hidden
                inline-flex items-center gap-2
                bg-gradient-to-br from-primary to-primary-container
                text-white font-bold text-sm
                px-5 py-2.5 rounded-2xl
                border-0
                shadow-[0_4px_20px_-4px] shadow-primary/40
                hover:shadow-[0_6px_28px_-4px] hover:shadow-primary/60
                hover:scale-[1.03]
                active:scale-[0.97]
                transition-all duration-200 ease-out
                h-auto
              "
            >
              <Plus size={16} strokeWidth={3} />
              নতুন ক্যাটাগরি
            </Button>
          </div>
        </div>

        {/* Filters & Table Wrapper */}
        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate">
          <TradeLicenseCategoryFilters />

          <div className="relative flex-grow border-t border-surface-container">
            <TradeLicenseCategoryTable
              categories={categoryItems}
              isLoading={isLoading}
              onEdit={editModal.onOpen}
              onDelete={handleDeleteCategory}
            />

            {total > 0 && (
              <TradeLicenseCategoryPagination total={total} />
            )}
          </div>
        </div>
      </main>

      {/* Create Modal */}
      <Dialog open={createModal.isOpen} onOpenChange={createModal.onClose}>
        <DialogContent className="max-w-md bg-white border-none p-6 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary" strokeWidth={3} />
              </div>
              নতুন ক্যাটাগরি তৈরি করুন
            </DialogTitle>
          </DialogHeader>
          <TradeLicenseCategoryForm
            mode="create"
            isLoading={createMutation.isPending}
            onSubmit={async (values) => {
              await createMutation.mutateAsync(values);
              createModal.onClose();
            }}
            onCancel={createModal.onClose}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModal.isOpen} onOpenChange={editModal.onClose}>
        <DialogContent className="max-w-md bg-white border-none p-6 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Save className="w-4 h-4 text-primary" />
              </div>
              ক্যাটাগরি তথ্য আপডেট করুন
            </DialogTitle>
          </DialogHeader>
          <TradeLicenseCategoryForm
            mode="edit"
            initialData={editModal.category || undefined}
            isLoading={updateMutation.isPending}
            onSubmit={async (values) => {
              if (editModal.category) {
                await updateMutation.mutateAsync({ id: editModal.category.id, ...values });
                editModal.onClose();
              }
            }}
            onCancel={editModal.onClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
