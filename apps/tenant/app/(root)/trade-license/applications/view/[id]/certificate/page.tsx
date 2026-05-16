"use client";

import React from "react";
import { useParams } from "next/navigation";
import { TradeLicenseCertificatePrintView } from "@/modules/trade-license-application/ui/views/trade-license-certificate-print-view";

export default function TradeLicenseCertificatePage() {
  const params = useParams();
  const id = params.id as string;

  return <TradeLicenseCertificatePrintView id={id} />;
}
