import { HoldingTaxListView } from "@/modules/holding-tax/ui/views/holding-tax-list-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "হোল্ডিং ট্যাক্স রেকর্ড | Upazila Hub",
  description: "ইউনিয়ন পরিষদের সকল হোল্ডিং ট্যাক্স রেকর্ড ও আদায় ব্যবস্থাপনা",
};

export default function HoldingTaxRecordsPage() {
  return <HoldingTaxListView />;
}
