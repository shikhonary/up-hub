"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../client";

/**
 * Hook for getting all divisions
 */
export function useDivisions() {
  const trpc = useTRPC();
  return useQuery(trpc.location.getDivisions.queryOptions());
}

/**
 * Hook for getting districts by division ID
 */
export function useDistricts(divisionId?: string | null) {
  const trpc = useTRPC();
  return useQuery(trpc.location.getDistricts.queryOptions({ divisionId }));
}

/**
 * Hook for getting upazilas by district ID
 */
export function useUpazilas(districtId?: string | null) {
  const trpc = useTRPC();
  return useQuery(trpc.location.getUpazilas.queryOptions({ districtId }));
}

/**
 * Hook for getting unions by upazila ID
 */
export function useUnions(upazilaId?: string | null) {
  const trpc = useTRPC();
  return useQuery(trpc.location.getUnions.queryOptions({ upazilaId }));
}

/**
 * Hook for getting post offices by upazila ID
 */
export function usePostOffices(upazilaId?: string | null) {
  const trpc = useTRPC();
  return useQuery(trpc.location.getPostOffices.queryOptions({ upazilaId }));
}

/**
 * Hook for getting post offices for the current tenant
 */
export function useTenantPostOffices() {
  const trpc = useTRPC();
  return useQuery(trpc.location.getTenantPostOffices.queryOptions());
}
