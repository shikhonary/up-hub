import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";
import { toast } from "@workspace/ui/components/sonner";
import { useAssessmentFilters } from "../filters/client";

// ============================================================================
// ASSESSMENT MUTATIONS
// ============================================================================

export function useCreateAssessment() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.assessment.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "এসেসমেন্ট তৈরি করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.assessment.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.assessment.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateAssessment() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.assessment.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "এসেসমেন্ট আপডেট করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.assessment.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.assessment.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.assessment.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useDeleteAssessment() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.assessment.delete.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "এসেসমেন্ট মুছতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.assessment.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.assessment.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useBulkGenerateTax() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.assessment.bulkGenerateTax.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "ট্যাক্স জেনারেট করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.assessment.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// ASSESSMENT QUERIES
// ============================================================================

/**
 * Hook for listing assessments with filters
 */
export function useAssessments() {
  const trpc = useTRPC();
  const [filters] = useAssessmentFilters();
  return useQuery(trpc.assessment.list.queryOptions(filters));
}

export function useAssessmentById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.assessment.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useAssessmentStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.assessment.getStats.queryOptions(),
    select: (data) => data.data,
  });
}
