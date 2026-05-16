import { AssessmentListView } from "@/modules/assessment/ui/views/assessment-list-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ট্যাক্স এসেসমেন্ট তালিকা | Upazila Hub",
  description: "ইউনিয়ন পরিষদের সকল হোল্ডিং ট্যাক্স এসেসমেন্ট তালিকা",
};

export default function AssessmentsPage() {
  return <AssessmentListView />;
}
