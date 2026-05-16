"use client";

import React, { useRef, useState } from "react";
import { useTradeLicenseApplicationById } from "@workspace/api-client";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { enToBnNumber } from "@workspace/utils";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { Printer, Download, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { cn } from "@workspace/ui/lib/utils";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface TradeLicenseApplicationPrintViewProps {
  id: string;
}

export const TradeLicenseApplicationPrintView = ({ id }: TradeLicenseApplicationPrintViewProps) => {
  const { data: application, isLoading } = useTradeLicenseApplicationById(id);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(printRef.current, { 
        quality: 1.0, 
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        width: 850,
        style: {
          transform: "scale(1)",
          margin: "0",
          padding: "20px"
        }
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pdfWidth - 10;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      const xOffset = (pdfWidth - imgWidth) / 2;
      
      pdf.addImage(dataUrl, "PNG", xOffset, 5, imgWidth, imgHeight);
      const fileName = `${application?.orgNameBn || "Application"}-${application?.trackingId || id}`;
      pdf.save(`${fileName}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-[850px] mx-auto space-y-8 animate-pulse bg-white rounded-3xl mt-10">
        <div className="flex justify-between items-center border-b pb-8">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-16 w-16 rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[40px] shadow-sm max-w-[600px] mx-auto mt-20 border border-slate-100">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">আবেদন পাওয়া যায়নি</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/50 py-12 px-4 print:p-0 print:bg-white print:min-h-0">
      {/* Control Bar */}
      <div className="max-w-[850px] mx-auto mb-10 flex justify-between items-center print:hidden bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-ambient border border-white/20 sticky top-5 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Printer size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-none">আবেদন ফরম প্রিন্ট / ডাউনলোড</h3>
            <p className="text-xs font-bold text-slate-500 mt-1.5 opacity-70">সঠিকভাবে প্রিন্ট করতে A4 সাইজ সিলেক্ট করুন</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            variant="outline"
            className="rounded-2xl border-slate-200 text-slate-700 font-black hover:bg-slate-50 shadow-sm px-6 h-auto gap-2.5 transition-all"
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-blue-600" />
            )}
            ডাউনলোড (PDF)
          </Button>
          <Button
            onClick={handlePrint}
            disabled={isDownloading}
            className="rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 shadow-xl px-8 h-auto gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Printer className="w-5 h-5" /> প্রিন্ট করুন
          </Button>
        </div>
      </div>

      {/* Main UI View - Now matches print view exactly */}
      <div
        ref={printRef}
        className="max-w-[850px] mx-auto bg-white shadow-none w-full p-[40px] relative isolate flex flex-col border-2 border-slate-200 print:border-none print:p-0 print-container print-color-adjust-exact"
        style={{ WebkitPrintColorAdjust: 'exact' }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-5">
          <div className="w-20 h-20 relative">
            <Image src="/gob-logo.jpg" alt="Gov Logo" width={80} height={80} className="w-full h-full object-contain" />
          </div>

          <div className="text-center flex-1 px-4">
            <h1 className="text-3xl font-black text-blue-800 leading-tight">শিকারী পাড়া ইউনিয়ন পরিষদ</h1>
            <p className="text-sm font-bold text-slate-800">শিকারী পাড়া, নবাবগঞ্জ, ঢাকা-১৩২২</p>
            <p className="text-xs font-bold text-slate-600 mt-1">মোবাইল: ০১৭১৪৩২৯৪৪৬, ই-মেইল: shikariparaup@gmail.com</p>
            <p className="text-[10px] font-bold text-blue-600">ওয়েব সাইট: https://lgdhaka.com</p>
          </div>

          <div className="w-20 h-20 relative bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-600 p-2 overflow-hidden">
            <Image src="/union-logo.jpg" alt="UP Logo" className="w-full h-full object-contain" width={80} height={80} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="inline-block border-b-2 border-slate-900 pb-1 text-2xl font-black text-slate-900 tracking-wider">
            ট্রেড লাইসেন্স আবেদন
          </h2>
        </div>

        {/* Top Info Grid */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-6">
          <InfoRow label="ট্র্যাকিং নং" value={enToBnNumber(application.trackingId || application.id.slice(0, 10).toUpperCase())} />
          <InfoRow label="আবেদনের তারিখ" value={enToBnNumber(format(new Date(application.createdAt), "dd-MM-yyyy"))} />

          <InfoRow label="ব্যবসা প্রতিষ্ঠানের নাম" value={application.orgNameBn} />
          <InfoRow label="ব্যবসার ধরন" value={application.tradeLicenseCategory?.typeBn} />

          <InfoRow label="মোবাইল" value={enToBnNumber(application.mobileBn)} />
          <InfoRow label="ই-মেইল" value={application.email} />
        </div>

        {/* Owner Table */}
        <div className="mb-6 overflow-hidden border border-slate-900">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-slate-100 print-color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact' }}>
                <th className="border border-slate-900 p-1 text-center w-8">ক্র.নং</th>
                <th className="border border-slate-900 p-1 text-left">মালিকের নাম</th>
                <th className="border border-slate-900 p-1 text-left">পিতা/স্বামীর নাম</th>
                <th className="border border-slate-900 p-1 text-center">পরিচয় পত্র/ জন্ম নিবন্ধন</th>
                <th className="border border-slate-900 p-1 text-center w-12">TIN</th>
                <th className="border border-slate-900 p-1 text-center w-12">BIN</th>
                <th className="border border-slate-900 p-1 text-center">মোবাইল</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-2 text-center">১</td>
                <td className="border border-slate-900 p-2 font-bold">{application.fullNameBn}</td>
                <td className="border border-slate-900 p-2">{application.fatherNameBn}</td>
                <td className="border border-slate-900 p-2 text-center">{enToBnNumber(application.nidBn || application.birthRegistrationBn)}</td>
                <td className="border border-slate-900 p-2 text-center">{enToBnNumber(application.tinBn)}</td>
                <td className="border border-slate-900 p-2 text-center">{enToBnNumber(application.binBn)}</td>
                <td className="border border-slate-900 p-2 text-center">{enToBnNumber(application.mobileBn)}</td>
              </tr>
              <tr>
                <td colSpan={7} className="border border-slate-900 p-2">
                  <span className="font-bold">ঠিকানা : </span>
                  {application.presentVillageBn},
                  ওয়ার্ড নং: {enToBnNumber(application.presentWardNo)},
                  ডাকঘর: {application.presentPostOfficeBn},
                  উপজেলা: {application.presentUpazilaBn},
                  জেলা: {application.presentDistrictBn}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* More Details */}
        <div className="space-y-2">
          <InfoRow label="পরিচিতিমূলক সাইনবোর্ড এর আয়তন (স্কয়ার ফিট)" value={enToBnNumber(application.signboardSize)} />
          <InfoRow label="ব্যবসা প্রতিষ্ঠান অথবা দোকানের মালিকানা" value={application.ownershipStatusBn} />
          <InfoRow label="ব্যবসা আরম্ভ করার সম্ভাব্য তারিখ" value={application.businessStartDate ? enToBnNumber(format(new Date(application.businessStartDate), "dd-MM-yyyy")) : "—"} />
          <InfoRow label="ব্যবসা প্রতিষ্ঠানের ঠিকানা" value={`${application.businessVillageBn}, ওয়ার্ড নং: ${enToBnNumber(application.businessWardNo)}, ডাকঘর: ${application.businessPostOfficeBn}, উপজেলা: ${application.businessUpazilaBn}, জেলা: ${application.businessDistrictBn}`} />
          <InfoRow label="আবেদনকারীর নাম" value={application.applicantNameBn} />
        </div>

        {/* Instructions */}
        <div className="mt-8">
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-dotted border-slate-400">
            <h3 className="text-sm font-black border-b border-slate-300 pb-1 inline-block">নির্দেশনাবলী / Instruction</h3>
            <ul className="text-[11px] font-bold space-y-1.5 text-slate-700">
              <li>১) এলাকার ১ জন ওয়ার্ড মেম্বার কর্তৃক সত্যায়িত করে ইউনিয়ন পরিষদে জমা দিন।</li>
              <li>২) ১ কপি পাসপোর্ট সাইজ ছবি (সত্যায়িত) সহ আবেদনপত্রের সাথে যুক্ত করুন।</li>
              <li>৩) আবেদনপত্রের অবস্থা জানার জন্য ট্র্যাকিং নাম্বার দিয়ে ওয়েব সাইট থেকে যাচাই করুন।</li>
            </ul>
            <p className="text-[9px] font-bold text-slate-500 mt-4 italic">
              নোট: আমি ঘোষণা করিতেছি যে উপরের উল্লেখিত যাবতীয় তথ্য অথবা বিবরণ সঠিক যদি কোন অসত্য তথ্য বিবরণী পাওয়া যায় তবে ইউনিয়ন পরিষদ বিধি মোতাবেক লাইসেন্স বাতিল করতে পারবে।
            </p>
          </div>

          {/* Verification Section */}
          <div className="relative pt-0 pb-0 mt-8">
            <div className="text-center mb-0">
              <h3 className="text-sm font-black border-b-2 border-slate-900 inline-block pb-1">সত্যায়ন / Verification</h3>
            </div>

            <div className="flex justify-between items-end mt-12">
              <div className="text-center ml-20">
                <div className="w-40 h-px bg-slate-900 mb-2" />
                <p className="text-[10px] font-black text-slate-800">স্বাক্ষর</p>
                <p className="text-[9px] font-bold text-slate-600">আবেদনকারী</p>
              </div>

              <div className="w-28 h-28 relative border-2 border-slate-900 p-1.5 rounded-lg flex items-center justify-center bg-white shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://lgdhaka.com/verify/trade-license/${id}`}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
                <p className="absolute -bottom-5 right-0 text-[7px] font-black text-slate-400 uppercase tracking-tighter">Scan for Verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-end text-[9px] font-bold text-slate-400">
          <div className="space-y-0.5">
            <p className="text-slate-500">E-mail: shikariparaup@gmail.com</p>
            <p className="text-blue-500">Website: https://lgdhaka.com</p>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary" />
              <p className="text-slate-600 font-black">Develop By: Innovation IT</p>
            </div>
            <p className="tracking-widest opacity-60 uppercase">www.innovationit.com.bd</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
        
        @media print {
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: hidden !important;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
          ::-webkit-scrollbar {
            display: none !important;
          }
        }

        .print-container {
          font-family: 'SolaimanLipi', sans-serif !important;
        }
      `}</style>
    </div>
  );
};

const InfoRow = ({ label, value, className }: { label: string; value: any; className?: string }) => (
  <div className={cn("flex items-baseline gap-2", className)}>
    <span className="text-[12px] font-bold text-slate-700 min-w-[160px]">{label}</span>
    <span className="text-[12px] font-black text-slate-900 flex-1 border-b border-dotted border-slate-300 pb-0.5 flex items-center">
      <span className="mr-2">:</span> {value || "—"}
    </span>
  </div>
);
