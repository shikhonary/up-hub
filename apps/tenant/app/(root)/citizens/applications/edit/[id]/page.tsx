import { Metadata } from "next";
import { EditCitizenApplicationView } from "@/modules/citizen/ui/views/edit-citizen-application-view";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "আবেদন এডিট | UP-Hub",
  description: "নাগরিক নিবন্ধন আবেদন সংশোধন করুন",
};

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-surface-container-lowest relative isolate">
      {/* Background Ambience */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Link 
              href="/citizens/applications" 
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              আবেদনের তালিকায় ফিরে যান
            </Link>
            
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
              />
              <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline relative">
                আবেদন এডিট করুন
              </h1>
              <div className="mt-2 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
              <p className="mt-4 text-sm leading-6 text-on-surface-variant max-w-lg">
                নিচে প্রদত্ত তথ্যগুলো সংশোধন করুন। পরিবর্তনের পর পুনরায় যাচাই করে জমা দিন।
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-ambient border border-outline/5 overflow-hidden pt-12">
            <EditCitizenApplicationView id={id} />
          </div>
        </div>
      </main>
    </div>
  );
}
