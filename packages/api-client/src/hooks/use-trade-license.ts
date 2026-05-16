import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";
import { useTradeLicenseFilters } from "../filters/client";

// ============================================================================
// TRADE LICENSE QUERIES
// ============================================================================

/**
 * Hook for listing trade licenses with filters
 */
export function useTradeLicenses() {
  const trpc = useTRPC();
  const [filters] = useTradeLicenseFilters();
  return useQuery(trpc.tradeLicense.list.queryOptions(filters));
}

export function useTradeLicenseById(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.tradeLicense.getById.queryOptions(id),
  });
}

export function useTradeLicenseStats() {
  const trpc = useTRPC();
  return useQuery(trpc.tradeLicense.getStats.queryOptions());
}
