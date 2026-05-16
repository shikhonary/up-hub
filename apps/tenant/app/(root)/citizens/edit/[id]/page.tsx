import { Metadata } from "next";
import { EditCitizenView } from "@/modules/citizen/ui/views/edit-citizen-view";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "তথ্য এডিট | UP-Hub",
  description: "নাগরিকের অফিসিয়াল নিবন্ধিত তথ্য সংশোধন করুন।",
};

export default async function EditCitizenPage({
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
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-emerald-200/20 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl -z-10 pointer-events-none"
      />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Link
              href="/citizens"
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              রেজিস্ট্রিতে ফিরে যান
            </Link>

            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
              />
              <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline relative">
                নাগরিক তথ্য এডিট করুন
              </h1>
              <div className="mt-2 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
              <p className="mt-4 text-sm leading-6 text-on-surface-variant max-w-lg italic opacity-70">
                নাগরিকের অফিসিয়াল নিবন্ধিত তথ্য আপডেট করুন। যেকোনো পরিবর্তন ইউনিয়ন পরিষদের রেজিস্ট্রিতে অবিলম্বে প্রতিফলিত হবে।
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-ambient border border-outline/5 overflow-hidden pt-12">
            <EditCitizenView id={id} />
          </div>
        </div>
      </main>
    </div>
  );
}
