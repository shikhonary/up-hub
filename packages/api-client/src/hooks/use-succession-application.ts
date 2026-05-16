import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";
import { toast } from "@workspace/ui/components/sonner";
import { useSuccessionApplicationFilters } from "../filters/client";

// ============================================================================
// SUCCESSION APPLICATION MUTATIONS
// ============================================================================

export function useCreateSuccessionApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.successionApplication.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "আবেদন তৈরি করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.successionApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.successionApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateSuccessionApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.successionApplication.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "আবেদন আপডেট করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.successionApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.successionApplication.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.successionApplication.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteSuccessionApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.successionApplication.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "আবেদন মুছতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.successionApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.successionApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateSuccessionApplicationStatus() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.successionApplication.updateStatus.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.successionApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.successionApplication.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.successionApplication.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// SUCCESSION APPLICATION QUERIES
// ============================================================================

/**
 * Hook for listing succession applications with filters
 */
export function useSuccessionApplications() {
  const trpc = useTRPC();
  const [filters] = useSuccessionApplicationFilters();
  return useQuery(trpc.successionApplication.list.queryOptions(filters));
}

export function useSuccessionApplicationById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.successionApplication.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useSuccessionApplicationStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.successionApplication.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
