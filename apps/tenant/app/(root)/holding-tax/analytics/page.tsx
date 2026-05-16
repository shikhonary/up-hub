import { HoldingTaxAnalyticsView } from "@/modules/holding-tax/ui/views/holding-tax-analytics-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "রিপোর্ট ও অ্যানালিটিক্স | Upazila Hub",
  description: "হোল্ডিং ট্যাক্স রিপোর্ট ও আর্থিক অ্যানালিটিক্স",
};

export default function HoldingTaxAnalyticsPage() {
  return <HoldingTaxAnalyticsView />;
}
