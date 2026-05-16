import { Metadata } from "next";
import { EditAssessmentView } from "@/modules/assessment/ui/views/edit-assessment-view";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "এসেসমেন্ট এডিট | UP-Hub",
  description: "বিদ্যমান এসেসমেন্ট রেকর্ডের তথ্য সংশোধন বা হালনাগাদ করুন।",
};

export default async function EditAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-surface relative isolate">
      {/* Background blobs for depth */}
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none"
      />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/holding-tax/assessments"
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              এসেসমেন্ট তালিকায় ফিরে যান
            </Link>

            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
              />
              <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline relative">
                এসেসমেন্ট তথ্য আপডেট
              </h1>
              <div className="mt-2 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
              <p className="mt-4 text-sm leading-6 text-on-surface-variant max-w-lg font-bold opacity-70">
                বিদ্যমান এসেসমেন্ট রেকর্ডের তথ্য সংশোধন বা হালনাগাদ করুন। পরিবর্তনের পর 'তথ্য আপডেট করুন' বাটনে ক্লিক করুন।
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-ambient border border-outline/5 overflow-hidden pt-12 relative">
             <div className="absolute top-0 left-0 w-full h-1 gradient-primary opacity-50" />
            <EditAssessmentView id={id} />
          </div>
        </div>
      </main>
    </div>
  );
}
