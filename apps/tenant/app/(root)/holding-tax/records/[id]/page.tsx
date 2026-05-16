import { HoldingTaxDetailsView } from "@/modules/holding-tax/ui/views/holding-tax-details-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ট্যাক্স রেকর্ড বিস্তারিত | Upazila Hub",
  description: "হোল্ডিং ট্যাক্স রেকর্ডের বিস্তারিত তথ্য ও আদায় ব্যবস্থাপনা",
};

export default async function HoldingTaxDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HoldingTaxDetailsView id={id} />;
}
