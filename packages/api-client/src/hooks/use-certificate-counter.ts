"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/sonner";
import { useTRPC } from "../client";

// ============================================================================
// CERTIFICATE COUNTER MUTATIONS
// ============================================================================

/**
 * Mutation hook for creating a certificate counter
 */
export function useCreateCertificateCounter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.certificateCounter.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create counter");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.certificateCounter.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for updating a certificate counter
 */
export function useUpdateCertificateCounter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.certificateCounter.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update counter");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.certificateCounter.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for deleting a certificate counter
 */
export function useDeleteCertificateCounter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.certificateCounter.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete counter");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({
          queryKey: trpc.certificateCounter.list.queryKey(),
        });
      } else {
        toast.error(data.message);
      }
    },
  });
}

/**
 * Mutation hook for incrementing a certificate counter
 */
export function useIncrementCertificateCounter() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.certificateCounter.increment.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to increment counter");
    },
    onSuccess: async (data: any, variables) => {
      if (data.success) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.certificateCounter.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.certificateCounter.getByType.queryKey({ typeEn: variables.typeEn }),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// CERTIFICATE COUNTER QUERIES
// ============================================================================

/**
 * Hook for listing certificate counters
 */
export function useCertificateCounters(filters: any = {}) {
  const trpc = useTRPC();
  return useQuery(trpc.certificateCounter.list.queryOptions(filters));
}

/**
 * Hook for getting a certificate counter by ID
 */
export function useCertificateCounterById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.certificateCounter.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting a certificate counter by English type name
 */
export function useCertificateCounterByType(typeEn: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.certificateCounter.getByType.queryOptions({ typeEn }),
    select: (data) => data.data,
    enabled: !!typeEn,
  });
}
