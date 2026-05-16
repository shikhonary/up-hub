import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";
import { toast } from "@workspace/ui/components/sonner";

// ============================================================================
// FAMILY APPLICATION MUTATIONS
// ============================================================================

export function useCreateFamilyApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.familyApplication.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create application");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateFamilyApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.familyApplication.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update application");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteFamilyApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.familyApplication.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to delete application");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useApproveFamilyApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.familyApplication.approve.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to approve application");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useRejectFamilyApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.familyApplication.reject.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to reject application");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.familyApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// FAMILY APPLICATION QUERIES
// ============================================================================

/**
 * Hook for listing family applications with filters
 */
export function useFamilyApplications(
  filters: Parameters<
    ReturnType<typeof useTRPC>["familyApplication"]["list"]["queryOptions"]
  >[0]
) {
  const trpc = useTRPC();
  return useQuery(trpc.familyApplication.list.queryOptions(filters as any));
}

export function useFamilyApplicationById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.familyApplication.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useFamilyApplicationStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.familyApplication.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
