import { BulkGenerateTaxView } from "@/modules/assessment/ui/views/bulk-generate-tax-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ট্যাক্স জেনারেট | Upazila Hub",
  description: "ইউনিয়ন পরিষদের সকল হোল্ডিং ট্যাক্স একসাথে জেনারেট করুন",
};

export default function BulkGenerateTaxPage() {
  return <BulkGenerateTaxView />;
}
