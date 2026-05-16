import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../client";
import { toast } from "@workspace/ui/components/sonner";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";

import { GENDER } from "@workspace/utils";
import { useCitizenFilters } from "../filters/client";

// ============================================================================
// CITIZEN MUTATIONS
// ============================================================================

export function useCreateCitizen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.citizen.create.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to create citizen record");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.citizen.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.citizen.getStats.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

export function useUpdateCitizen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.citizen.update.mutationOptions(),
    onError: (error) => {
      toast.error(error.message || "Failed to update citizen record");
    },
    onSuccess: async (data: any) => {
      if (data.success) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.citizen.list.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.citizen.getStats.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.citizen.getById.queryKey(),
          }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
  });
}

// ============================================================================
// CITIZEN QUERIES
// ============================================================================


export function useCitizens() {
  const trpc = useTRPC();
  const [filters] = useCitizenFilters();

  return useQuery(trpc.citizen.list.queryOptions(filters));
}

export function useCitizenById(id: string) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.citizen.getById.queryOptions(id),
    select: (data) => data.data,
  });
}

export function useCitizenStats() {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.citizen.getStats.queryOptions(),
    select: (data) => data.data,
  });
}

export function useCitizenByNid(nid: string, enabled = false) {
  const trpc = useTRPC();
  return useQuery({
    ...trpc.citizen.getByNid.queryOptions(nid),
    enabled: enabled && nid.length >= 10,
    select: (data) => data.data,
  });
}
