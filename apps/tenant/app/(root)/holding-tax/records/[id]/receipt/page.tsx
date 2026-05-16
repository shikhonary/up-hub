import { HoldingTaxReceiptView } from "@/modules/holding-tax/ui/views/holding-tax-receipt-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ট্যাক্স পেমেন্ট রশিদ | Upazila Hub",
  description: "হোল্ডিং ট্যাক্স পেমেন্টের অফিশিয়াল রশিদ",
};

export default async function HoldingTaxReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HoldingTaxReceiptView id={id} />;
}
