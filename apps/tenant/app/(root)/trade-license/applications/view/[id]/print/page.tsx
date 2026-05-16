"use client";

import { use } from "react";
import { TradeLicenseApplicationPrintView } from "@/modules/trade-license-application/ui/views/trade-license-application-print-view";

interface PrintTradeLicenseApplicationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PrintTradeLicenseApplicationPage({ params }: PrintTradeLicenseApplicationPageProps) {
  const { id } = use(params);

  return <TradeLicenseApplicationPrintView id={id} />;
}
