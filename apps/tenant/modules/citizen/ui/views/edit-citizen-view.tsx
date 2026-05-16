"use client";

import { useCitizenById } from "@workspace/api-client";
import { CitizenEditForm } from "../components/desktop/form/citizen-edit-form";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface EditCitizenViewProps {
  id: string;
}

export const EditCitizenView = ({ id }: EditCitizenViewProps) => {
  const { data, isLoading } = useCitizenById(id);
  const citizen = data;

  if (isLoading) {
    return (
      <div className="pb-20 px-4 md:px-8 w-full max-w-5xl mx-auto space-y-8 animate-pulse">
        <div className="flex justify-between items-center mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <Skeleton className="h-2 w-10" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!citizen) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-xl font-bold text-slate-900">Citizen not found</h3>
        <p className="text-slate-500">The citizen record you are trying to edit does not exist or you don't have access.</p>
      </div>
    );
  }

  return (
    <CitizenEditForm
      id={id}
      initialData={citizen as any}
    />
  );
};
