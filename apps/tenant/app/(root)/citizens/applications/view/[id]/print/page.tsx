"use client";

import { use } from "react";
import { CitizenApplicationFormView } from "@/modules/citizen/ui/views/citizen-application-form-view";

interface PrintApplicationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PrintApplicationPage({ params }: PrintApplicationPageProps) {
  const { id } = use(params);

  return <CitizenApplicationFormView id={id} />;
}
