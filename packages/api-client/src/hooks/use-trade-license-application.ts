import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";
import { toast } from "@workspace/ui/components/sonner";
import { useTradeLicenseApplicationFilters } from "../filters/client";

// ============================================================================
// TRADE LICENSE APPLICATION MUTATIONS
// ============================================================================

export function useCreateTradeLicenseApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tradeLicenseApplication.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "আবেদন তৈরি করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateTradeLicenseApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tradeLicenseApplication.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "আবেদন আপডেট করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteTradeLicenseApplication() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tradeLicenseApplication.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "আবেদন মুছতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateTradeLicenseApplicationStatus() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tradeLicenseApplication.updateStatus.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useGenerateTradeLicense() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tradeLicenseApplication.generateLicense.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "লাইসেন্স জেনারেট করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useCollectTradeLicensePayment() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.tradeLicenseApplication.collectPayment.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "পেমেন্ট সংগ্রহ করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message || "পেমেন্ট সফলভাবে সংগ্রহ করা হয়েছে");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicense.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.tradeLicenseApplication.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// TRADE LICENSE APPLICATION QUERIES
// ============================================================================

/**
 * Hook for listing trade license applications with filters
 */
export function useTradeLicenseApplications() {
  const trpc = useTRPC();
  const [filters] = useTradeLicenseApplicationFilters();
  return useQuery(trpc.tradeLicenseApplication.list.queryOptions(filters));
}

export function useTradeLicenseApplicationById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.tradeLicenseApplication.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useTradeLicenseApplicationStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.tradeLicenseApplication.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
