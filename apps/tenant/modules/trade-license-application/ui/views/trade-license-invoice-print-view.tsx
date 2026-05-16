"use client";

import React, { useRef, useState } from "react";
import { useTradeLicenseApplicationById } from "@workspace/api-client";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { enToBnNumber } from "@workspace/utils";
import { format } from "date-fns";
import { Printer, FileText, Building2, User2, MapPin, QrCode, AlertCircle, Download, Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@workspace/ui/lib/utils";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface TradeLicenseInvoicePrintViewProps {
  id: string; // applicationId
}

export const TradeLicenseInvoicePrintView = ({ id }: TradeLicenseInvoicePrintViewProps) => {
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
      // Create a clone or use options to ensure we capture the full width
      const dataUrl = await toPng(printRef.current, {
        quality: 1.0,
        pixelRatio: 3, // Higher resolution for better text
        backgroundColor: "#ffffff",
        width: 850, // Force a consistent width for capture
        style: {
          transform: "scale(1)",
          margin: "0",
          padding: "20px"
        }
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pdfWidth - 10; // Minimal margins (5mm each side)
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Perfectly center
      const xOffset = (pdfWidth - imgWidth) / 2;

      pdf.addImage(dataUrl, "PNG", xOffset, 5, imgWidth, imgHeight);
      const fileName = `${application?.orgNameBn || "Invoice"}-${application?.trackingId || id}`;
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

  if (!application || !application.tradeLicense) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[40px] shadow-sm max-w-[600px] mx-auto mt-20 border border-slate-100">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">ইনভয়েস পাওয়া যায়নি</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-3 font-medium">আবেদনটি এখনো অনুমোদন করা হয়নি অথবা লাইসেন্সটি সঠিকভাবে জেনারেট করা হয়নি।</p>
      </div>
    );
  }

  const license = application.tradeLicense;

  return (
    <div className="min-h-screen bg-slate-100/50 py-12 px-4 print:p-0 print:bg-white print:min-h-0">
      {/* Control Bar */}
      <div className="max-w-[850px] mx-auto mb-10 flex justify-between items-center print:hidden bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-ambient border border-white/20 sticky top-5 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-none">ট্রেড লাইসেন্স চালান / ইনভয়েস</h3>
            <p className="text-xs font-bold text-slate-500 mt-1.5 opacity-70">প্রিন্ট করে ইউনিয়ন পরিষদের ক্যাশ কাউন্টারে জমা দিন</p>
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
      <div ref={printRef} className="max-w-[850px] mx-auto space-y-12 flex flex-col items-center">
        {/* Copy 1: Client Copy */}
        <InvoiceCard application={application} license={license} copyType="গ্রাহক কপি (Client Copy)" />

        {/* Separation Line */}
        <div className="relative h-1 w-full border-b-2 border-dashed border-slate-300 my-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100/50 print:bg-white px-4 py-1 text-[8px] font-black uppercase tracking-[0.5em] text-slate-400">
            কেটে আলাদা করুন (Cut Here)
          </div>
        </div>

        {/* Copy 2: Office Copy */}
        <InvoiceCard application={application} license={license} copyType="অফিস কপি (Office Copy)" />
      </div>
    </div>
  );
};

const InvoiceCard = ({ application, license, copyType }: { application: any; license: any; copyType: string }) => {
  const qrValue = `UP-HUB:INV-${application.trackingId}-${license.totalAmount}`;

  return (
    <div className="bg-white shadow-none w-full max-w-[850px] p-[35px] relative isolate flex flex-col border-2 border-slate-200 print:border-slate-300 rounded-[32px] print:rounded-none overflow-hidden min-h-[550px] print-color-adjust-exact">
      {/* Premium Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none -rotate-12 scale-150">
        <Building2 className="w-[500px] h-[500px]" />
      </div>

      {/* Header Section - Synced with Application View */}
      <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-5">
        <div className="w-20 h-20 relative">
          <Image src="/gob-logo.jpg" alt="Gov Logo" width={80} height={80} className="w-full h-full object-contain" />
        </div>

        <div className="text-center flex-1 px-4">
          <h1 className="text-2xl font-black text-blue-800 leading-tight">শিকারী পাড়া ইউনিয়ন পরিষদ</h1>
          <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mt-0.5">ট্রেড লাইসেন্স পেমেন্ট চালান (Challan)</p>
          <p className="text-[10px] font-bold text-slate-800">শিকারী পাড়া, নবাবগঞ্জ, ঢাকা-১৩২২</p>
          <p className="text-[9px] font-bold text-slate-600 mt-0.5">মোবাইল: ০১৭১৪৩২৯৪৪৬, ই-মেইল: shikariparaup@gmail.com</p>
        </div>

        <div className="w-20 h-20 relative flex flex-col items-center justify-center gap-1">
          <div className="px-2 py-0.5 bg-slate-900 text-white rounded text-[7px] font-black uppercase tracking-widest text-center w-full">
            {copyType}
          </div>
          <div className="border border-slate-200 p-1 rounded-lg bg-white shadow-sm">
            <QRCodeSVG value={qrValue} size={60} />
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-7 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={<Building2 className="w-3 h-3" />} label="প্রতিষ্ঠানের নাম" value={application.orgNameBn} />
            <InfoItem icon={<User2 className="w-3 h-3" />} label="মালিকের নাম" value={application.fullNameBn} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={<MapPin className="w-3 h-3" />} label="ঠিকানা" value={`${application.businessVillageBn}, ওয়ার্ড নং ${enToBnNumber(application.businessWardNo)}`} />
            <InfoItem icon={<QrCode className="w-3 h-3" />} label="ট্র্যাকিং আইডি" value={enToBnNumber(application.trackingId)} isBlue />
          </div>
        </div>

        <div className="col-span-5 bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">চালান নম্বর</p>
              <h3 className="text-sm font-black text-slate-900 tracking-tighter">CH-{enToBnNumber(application.trackingId)}</h3>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">তারিখ</p>
              <h3 className="text-[11px] font-black text-slate-900">{enToBnNumber(format(new Date(), "dd-MM-yyyy"))}</h3>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">পরিশোধের অপেক্ষায় (Unpaid)</span>
          </div>
        </div>
      </div>

      {/* Fees Table */}
      <div className="flex-grow">
        <table className="w-full border-collapse border border-slate-900">
          <thead>
            <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest print-color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact' }}>
              <th className="border border-slate-900 p-1.5 text-center w-10">ক্র.নং</th>
              <th className="border border-slate-900 p-1.5 text-left">বিবরণ</th>
              <th className="border border-slate-900 p-1.5 text-right w-32">পরিমাণ (টাকা)</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-bold text-slate-800">
            <TableRow index={1} label="ট্রেড লাইসেন্স ফি" amount={license.licenseFee} />
            {license.arrears > 0 && (
              <TableRow index={2} label={`বকেয়া ফি (${license.arrearsFiscalYear || "পূর্ববর্তী"})`} amount={license.arrears} />
            )}
            <TableRow index={license.arrears > 0 ? 3 : 2} label="ভ্যাট (১৫%)" amount={license.vatAmount} />
            {license.signboardTax > 0 && <TableRow index={4} label="সাইনবোর্ড কর" amount={license.signboardTax} />}
            {license.professionalTax > 0 && <TableRow index={5} label="পেশা কর" amount={license.professionalTax} />}
            {license.subCharge > 0 && <TableRow index={6} label="সারচার্জ" amount={license.subCharge} />}
            {license.discount > 0 && (
              <tr className="bg-rose-50 text-rose-700">
                <td className="border border-slate-900 p-1 text-center">-</td>
                <td className="border border-slate-900 p-1 font-black uppercase italic">ডিসকাউন্ট / ছাড়</td>
                <td className="border border-slate-900 p-1 text-right font-black">- ৳{enToBnNumber(license.discount)}</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 text-slate-900 font-black print-color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact' }}>
              <td className="border-2 border-slate-900 p-2 text-sm" colSpan={2}>সর্বমোট প্রদেয় (Total Amount)</td>
              <td className="border-2 border-slate-900 p-2 text-right text-base font-black italic">৳{enToBnNumber(license.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
        <div className="mt-1 text-[9px] font-black text-slate-500 italic">
          কথায়: {numberToBnWords(license.totalAmount)} টাকা মাত্র।
        </div>
      </div>

      {/* Signatures & Footer */}
      <div className="mt-4 grid grid-cols-3 gap-6 items-end">
        <div className="text-center space-y-0.5">
          <div className="h-6 w-full" />
          <div className="border-t border-slate-400 pt-1.5">
            <p className="text-[9px] font-black text-slate-900 leading-none">আবেদনকারীর স্বাক্ষর</p>
          </div>
        </div>
        <div className="text-center space-y-0.5">
          <div className="h-6 w-full" />
          <div className="border-t border-slate-400 pt-1.5">
            <p className="text-[9px] font-black text-slate-900 leading-none">ক্যাশিয়ারের স্বাক্ষর</p>
          </div>
        </div>
        <div className="text-center space-y-0.5">
          <div className="h-6 w-full" />
          <div className="border-t border-slate-900 pt-1.5">
            <p className="text-[9px] font-black text-slate-900 leading-none">সচিব / চেয়ারম্যানের স্বাক্ষর</p>
            <p className="text-[7px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">শিকারী পাড়া ইউপি</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-center opacity-40 grayscale">
        <p className="text-[6px] font-bold">Generated by UP-HUB (ANImegh IT Care)</p>
        <p className="text-[6px] font-black">Printed on: {format(new Date(), "PPpp")}</p>
      </div>

      <style jsx global>{`
        @media print {
          body {
            overflow: hidden !important;
          }
          ::-webkit-scrollbar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const TableRow = ({ index, label, amount }: { index: number; label: string; amount: number }) => (
  <tr>
    <td className="border border-slate-900 p-1 text-center text-slate-500">{enToBnNumber(index)}</td>
    <td className="border border-slate-900 p-1 text-slate-800">{label}</td>
    <td className="border border-slate-900 p-1 text-right font-black text-slate-900">৳{enToBnNumber(amount)}</td>
  </tr>
);

const InfoItem = ({ icon, label, value, isBlue }: { icon: React.ReactNode; label: string; value: string; isBlue?: boolean }) => (
  <div>
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
      {icon} {label}
    </p>
    <p className={cn("text-[11px] font-black leading-tight", isBlue ? "text-blue-600" : "text-slate-900")}>
      {value}
    </p>
  </div>
);

// Simple Bengali Number to Words conversion (Simplified for common amounts)
function numberToBnWords(amount: number): string {
  const words: { [key: number]: string } = {
    0: "শূন্য", 1: "এক", 2: "দুই", 3: "তিন", 4: "চার", 5: "পাঁচ", 6: "ছয়", 7: "সাত", 8: "আট", 9: "নয়",
    10: "দশ", 11: "এগারো", 12: "বারো", 13: "তেরো", 14: "চৌদ্দ", 15: "পনেরো", 16: "ষোলো", 17: "সতেরো", 18: "আঠারো", 19: "উনিশ",
    20: "বিশ", 30: "ত্রিশ", 40: "চল্লিশ", 50: "পঞ্চাশ", 60: "ষাট", 70: "সত্তর", 80: "আশি", 90: "নব্বই",
  };

  if (amount === 0) return words[0] as string;

  const process = (n: number): string => {
    if (n < 20) return words[n] as string;
    if (n < 100) return (words[Math.floor(n / 10) * 10] || "") + (n % 10 !== 0 ? (words[n % 10] || "") : "");
    if (n < 1000) return (words[Math.floor(n / 100)] || "") + " শত " + (n % 100 !== 0 ? process(n % 100) : "");
    if (n < 100000) return (process(Math.floor(n / 1000))) + " হাজার " + (n % 1000 !== 0 ? process(n % 1000) : "");
    return n.toString(); // Fallback for very large numbers
  };

  return process(amount);
}
