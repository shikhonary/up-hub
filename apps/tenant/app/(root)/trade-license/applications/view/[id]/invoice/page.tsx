"use client";

import React from "react";
import { useParams } from "next/navigation";
import { TradeLicenseInvoicePrintView } from "@/modules/trade-license-application/ui/views/trade-license-invoice-print-view";

export default function TradeLicenseInvoicePage() {
  const params = useParams();
  const id = params.id as string;

  return <TradeLicenseInvoicePrintView id={id} />;
}
