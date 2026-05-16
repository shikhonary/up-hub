import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../client";
import { toast } from "@workspace/ui/components/sonner";
import { useHoldingTaxFilters } from "../filters/client";

// ============================================================================
// HOLDING TAX MUTATIONS
// ============================================================================

export function useCollectTax() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.holdingTax.collect.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "ট্যাক্স সংগ্রহ করতে ব্যর্থ হয়েছে");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.holdingTax.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.holdingTax.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// HOLDING TAX QUERIES
// ============================================================================

export function useHoldingTaxes() {
  const trpc = useTRPC();
  const [filters] = useHoldingTaxFilters();
  return useQuery(trpc.holdingTax.list.queryOptions(filters));
}

export function useHoldingTaxById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.holdingTax.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useHoldingTaxStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.holdingTax.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

export function useHoldingTaxAnalytics(filters: { fiscalYearId?: string | null; wardNo?: number | null; villageBn?: string | null }) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.holdingTax.getAnalytics.queryOptions(filters),
    select: (data) => data.data,
  });
}

export function useHoldingTaxReport(filters: { fiscalYearId?: string | null; wardNo?: number | null; villageBn?: string | null; status?: string | null }) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.holdingTax.getReportData.queryOptions(filters),
    select: (data) => data.data,
  });
}
