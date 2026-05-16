"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";
import { useFiscalYearFilters } from "../filters/client";

// ============================================================================
// FISCAL YEAR MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a fiscal year
 */
export function useCreateFiscalYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.fiscalYear.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create fiscal year");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.fiscalYear.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a fiscal year
 */
export function useUpdateFiscalYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.fiscalYear.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update fiscal year");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.fiscalYear.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.fiscalYear.getCurrent.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a fiscal year
 */
export function useDeleteFiscalYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.fiscalYear.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete fiscal year");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.fiscalYear.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for toggling fiscal year active status
 */
export function useToggleFiscalYearActive() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.fiscalYear.toggleActive.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to toggle status");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.fiscalYear.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for setting a fiscal year as current
 */
export function useSetCurrentFiscalYear() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.fiscalYear.setCurrent.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to set current fiscal year");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.fiscalYear.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.fiscalYear.getCurrent.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// FISCAL YEAR QUERIES
// ============================================================================

/**
 * Hook for listing fiscal years with filters
 */
export function useFiscalYears() {
  const trpc = useTRPC();
  const [filters] = useFiscalYearFilters();
  return useQuery(trpc.fiscalYear.list.queryOptions(filters));
}

/**
 * Hook for getting current fiscal year
 */
export function useCurrentFiscalYear() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.fiscalYear.getCurrent.queryOptions(),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting a fiscal year by ID
 */
export function useFiscalYearById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.fiscalYear.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting fiscal years for selection dropdowns
 */
export function useFiscalYearsForSelection() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.fiscalYear.forSelection.queryOptions(),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting fiscal year stats
 */
export function useFiscalYearStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.fiscalYear.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

