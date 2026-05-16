"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useTradeLicenseCategoryFilters } from "../filters/client";

// ============================================================================
// TRADE LICENSE CATEGORY MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a trade license category
 */
export function useCreateTradeLicenseCategory() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tradeLicenseCategory.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tradeLicenseCategory.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a trade license category
 */
export function useUpdateTradeLicenseCategory() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tradeLicenseCategory.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tradeLicenseCategory.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a trade license category
 */
export function useDeleteTradeLicenseCategory() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tradeLicenseCategory.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.tradeLicenseCategory.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// TRADE LICENSE CATEGORY QUERIES
// ============================================================================

/**
 * Hook for listing trade license categories
 */
export function useTradeLicenseCategories(filters: any = {}) {
  const trpc = useTRPC();
  return useQuery(trpc.tradeLicenseCategory.list.queryOptions(filters));
}

/**
 * Hook for getting a trade license category by ID
 */
export function useTradeLicenseCategoryById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.tradeLicenseCategory.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

/**
 * Hook for listing trade license categories with automated filters
 */
export function useTradeLicenseCategoriesWithFilters() {
  const [filters] = useTradeLicenseCategoryFilters();
  return useTradeLicenseCategories(filters);
}
