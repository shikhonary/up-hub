"use client";

import React, { useRef, useState } from "react";
import { useTradeLicenseApplicationById } from "@workspace/api-client";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { enToBnNumber } from "@workspace/utils";
import { format } from "date-fns";
import { Printer, Download, Loader2, AlertCircle, Award } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { cn } from "@workspace/ui/lib/utils";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";

interface TradeLicenseCertificatePrintViewProps {
  id: string;
}

export const TradeLicenseCertificatePrintView = ({ id }: TradeLicenseCertificatePrintViewProps) => {
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
      const el = printRef.current;
      const dataUrl = await toPng(el, { 
        quality: 1.0, 
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        width: el.clientWidth,
        height: el.clientHeight,
        style: {
          margin: '0',
          padding: '0',
          transform: 'none',
        }
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      
      const fileName = `${application?.orgNameBn || "TradeLicense"}-${application?.trackingId}`;
      pdf.save(`${fileName}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-[850px] mx-auto bg-white rounded-3xl mt-10">
        <Skeleton className="h-[1000px] w-full rounded-3xl" />
      </div>
    );
  }

  if (!application || !application.tradeLicense) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[40px] shadow-sm max-w-[600px] mx-auto mt-20 border border-slate-100">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">সনদ পাওয়া যায়নি</h3>
        <p className="text-slate-500 mt-2">আগে পেমেন্ট সম্পন্ন করুন।</p>
      </div>
    );
  }

  const license = application.tradeLicense;
  const licenseNoStr = (license.licenseNo || "").toString().padStart(14, "0");

  return (
    <div className="min-h-screen bg-slate-200/50 py-12 px-4 print:p-0 print:bg-white print:min-h-0 font-bangla">
      {/* Control Bar */}
      <div className="max-w-[850px] mx-auto mb-10 flex justify-between items-center print:hidden bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-ambient border border-white/20 sticky top-5 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 shadow-inner">
            <Award size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-none">ট্রেড লাইসেন্স সনদ</h3>
            <p className="text-xs font-bold text-slate-500 mt-1.5 opacity-70">অফিসিয়াল সার্টিফিকেট প্রিন্ট / ডাউনলোড</p>
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
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-emerald-600" />
            )}
            ডাউনলোড (PDF)
          </Button>
          <Button
            onClick={handlePrint}
            disabled={isDownloading}
            className="rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 shadow-xl px-8 h-auto gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Printer className="w-5 h-5" /> প্রিন্ট করুন
          </Button>
        </div>
      </div>

      {/* Main Certificate Content */}
      <div
        ref={printRef}
        className="max-w-[850px] mx-auto bg-white shadow-none w-full p-[25px] relative isolate flex flex-col overflow-hidden print:p-[25px]"
      >
        {/* Aggressive CSS Triangle Border */}
        <div className="absolute inset-0 border-[16px] border-transparent pointer-events-none -z-10 bg-white" 
             style={{
               borderImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpolygon points=\'0,0 20,40 40,0\' fill=\'%23006a4e\' /%3E%3Cpolygon points=\'40,40 20,0 0,40\' fill=\'%23f42a41\' /%3E%3C/svg%3E") 40 repeat',
               padding: '2px',
               boxSizing: 'border-box'
             }} 
        />

        {/* Header Section */}
        <div className="flex justify-between items-start mb-1 relative">
          {/* Left: QR and Issue Details */}
          <div className="flex flex-col items-start gap-1">
             <div className="border border-slate-200 p-1 bg-white">
                <QRCodeSVG 
                  value={`https://lgdhaka.com/verify/trade-license/${id}`}
                  size={70}
                />
             </div>
             <div className="text-[8px] font-bold text-slate-800 leading-tight">
                <p>লাইসেন্স ইস্যুর বিবরণ</p>
                <p>ইস্যুর তারিখ (Date of issue):</p>
                <p className="font-black">{enToBnNumber(format(new Date(license.createdAt), "dd/MM/yyyy"))}</p>
                <p>ইস্যুর সময় (Issue Time): {enToBnNumber(format(new Date(license.createdAt), "HH:mm:ss"))}</p>
             </div>
          </div>

          {/* Center: UP Information */}
          <div className="text-center flex-1 mt-0">
            <h1 className="text-3xl font-black text-blue-800 leading-none mb-0.5">শিকারী পাড়া ইউনিয়ন পরিষদ</h1>
            <p className="text-xs font-bold text-slate-800">শিকারী পাড়া, নবাবগঞ্জ, ঢাকা</p>
            <p className="text-[10px] font-bold text-slate-800 leading-tight">মোবাইল: ০১ ১৯৭১৪৩২৯৪৪৬, ই-মেইল: shikariparaup@gmail.com</p>
            <p className="text-[9px] font-bold text-blue-600 mt-0.5">ওয়েব সাইট : https://lgdhaka.com/</p>
          </div>

          {/* Right: Union Logo */}
          <div className="w-20 h-20 relative flex items-center justify-end">
             <Image src="/union-logo.jpg" alt="Union Logo" width={80} height={80} className="object-contain" />
          </div>
        </div>

        {/* Government Logo Centered */}
        <div className="flex justify-center mb-1">
           <div className="w-16 h-16 relative">
              <Image src="/gob-logo.jpg" alt="Gov Logo" width={64} height={64} className="object-contain" />
           </div>
        </div>

        {/* Title */}
        <div className="text-center mb-1">
           <h2 className="text-2xl font-black text-slate-900 border-b-2 border-slate-900 inline-block px-8 pb-0.5">
             ট্রেড লাইসেন্স
           </h2>
        </div>

        {/* License Number Boxes */}
        <div className="flex items-center justify-center gap-0 mb-1.5">
           <span className="text-xs font-black mr-3">লাইসেন্স নং :</span>
           <div className="flex border-l border-slate-900">
             {licenseNoStr.slice(0, 8).split("").map((digit, i) => (
               <div key={i} className="w-6 h-6 border-r border-y border-slate-900 flex items-center justify-center font-black text-base">
                 {enToBnNumber(digit)}
               </div>
             ))}
             <div className="w-6 h-6 border-r border-y border-slate-900 flex items-center justify-center font-black text-base">
                -
             </div>
             {licenseNoStr.slice(8, 14).split("").map((digit, i) => (
               <div key={i+8} className="w-6 h-6 border-r border-y border-slate-900 flex items-center justify-center font-black text-base">
                 {enToBnNumber(digit)}
               </div>
             ))}
           </div>
        </div>

        {/* Disclaimer Text */}
        <div className="text-[9px] font-bold text-slate-800 leading-tight text-center mb-2 px-10">
           স্থানীয় সরকার (ইউনিয়ন পরিষদ) আইন, ২০০৯ (২০০৯ সনের ৬১ নং আইন) এর ধারা ৬৬-তে প্রদত্ত ক্ষমতাবলে সরকার প্রণীত আদর্শ কর তফসিল, ২০১৩ এবং 
           ৬ ও ১৭ নং অনুচ্ছেদ অনুযায়ী ব্যবসা, বৃত্তি, পেশা বা শিল্প প্রতিষ্ঠানের উপর আরোপিত কর আদায়ের লক্ষ্যে নির্ধারিত শর্তে নিম্নবর্ণিত ব্যক্তি/প্রতিষ্ঠানের অনুকূলে 
           এই ট্রেড লাইসেন্সটি ইস্যু করা হলো :
        </div>

        {/* Main Data Section */}
        <div className="grid grid-cols-12 gap-x-4 gap-y-0 text-[12px] relative isolate">
           {/* Watermark Logo Background */}
           <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none -z-10 scale-125">
              <Image src="/gob-logo.jpg" alt="Watermark" width={500} height={500} />
           </div>

           <CertificateRow label="ব্যবসা প্রতিষ্ঠানের নাম" value={application.orgNameBn} />
           <CertificateRow label="মালিক/স্বত্বাধিকারীর নাম" value={application.fullNameBn} />
           <CertificateRow label="মাতার নাম" value={application.motherNameBn} />
           <CertificateRow label="পিতার নাম" value={application.fatherNameBn} />
           <CertificateRow label="ব্যবসার প্রকৃতি" value={application.ownershipTypeBn} />
           <CertificateRow label="ব্যবসার ধরণ" value={application.tradeLicenseCategory?.typeBn} />
           <CertificateRow label="ব্যবসা প্রতিষ্ঠানের ঠিকানা" value={`${application.businessVillageBn}, গ্রাম/ মহল্লা: ${application.businessVillageBn}, ওয়ার্ড নং- ${enToBnNumber(application.businessWardNo)}, পোস্ট অফিস: ${application.businessPostOfficeBn}, উপজেলা: ${application.businessUpazilaBn}, জেলা: ${application.businessDistrictBn}।`} />
           <CertificateRow label="অঞ্চল (প্রযোজ্য ক্ষেত্রে)" value="" />
           
           <div className="col-span-12 grid grid-cols-2 gap-4">
             <CertificateRow label="পরিচয় পত্র/ জন্ম নিবন্ধন/পাসপোর্ট" value={enToBnNumber(application.nidBn || application.birthRegistrationBn || application.passportBn)} colSpan={6} />
             <div className="col-span-6 flex gap-4">
                <span className="font-black min-w-[60px]">বিআইএন(BIN):</span>
                <span className="flex-1 border-b border-dotted border-slate-400">{enToBnNumber(application.binBn) || ""}</span>
             </div>
           </div>

           <div className="col-span-12 grid grid-cols-2 gap-4">
             <CertificateRow label="টিআইএন (TIN)" value={enToBnNumber(application.tinBn)} colSpan={6} />
             <div className="col-span-6 flex gap-4">
                <span className="font-black min-w-[60px]">ই-মেইল:</span>
                <span className="flex-1 border-b border-dotted border-slate-400 font-sans">{application.email}</span>
             </div>
           </div>

           <div className="col-span-12 grid grid-cols-2 gap-4">
             <CertificateRow label="মোবাইল" value={enToBnNumber(application.mobileBn)} colSpan={6} />
             <div className="col-span-6 flex gap-4">
                <span className="font-black min-w-[60px]">ব্যবসা শুরুর তারিখ:</span>
                <span className="flex-1 border-b border-dotted border-slate-400">{application.businessStartDate ? enToBnNumber(format(new Date(application.businessStartDate), "dd/MM/yyyy")) : ""}</span>
             </div>
           </div>

           <CertificateRow label="অর্থবছর" value={application.fiscalYear?.nameBn} />
        </div>

        {/* Addresses Side by Side */}
        <div className="grid grid-cols-2 gap-8 mt-2 mb-2">
           <AddressTable title="মালিক/স্বত্বাধিকারী/কোম্পানির বর্তমান ঠিকানা" data={{
             village: application.presentVillageBn,
             post: application.presentPostOfficeBn,
             upazila: application.presentUpazilaBn,
             district: application.presentDistrictBn,
             holding: application.presentHoldingNoBn || "—"
           }} />
           <AddressTable title="মালিক/স্বত্বাধিকারী/কোম্পানির স্থায়ী ঠিকানা" data={{
             village: application.permanentVillageBn,
             post: application.permanentPostOfficeBn,
             upazila: application.permanentUpazilaBn,
             district: application.permanentDistrictBn,
             holding: application.permanentHoldingNoBn || "—"
           }} />
        </div>

        {/* Fees Breakdown */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-0 mb-2">
           <FeeRow label="লাইসেন্স ফি (উত্তীর্ণ)" value={license.licenseFee} />
           <FeeRow label="সাইনবোর্ড কর(বার্ষিক)" value={license.signboardTax} />
           <FeeRow label="ভ্যাট(VAT)" value={license.vatAmount} />
           <FeeRow label="সারচার্জ" value={license.subCharge} />
           <FeeRow label="আয়কর/উৎসে কর" value={0} />
           <FeeRow label="পেশা ও বাণিজ্যিক কর" value={license.professionalTax} />
           <div className="col-span-1 border-t border-slate-400 mt-0.5 pt-0.5 flex justify-between font-black text-sm">
             <span>সর্বমোট</span>
             <span>: ৳{enToBnNumber(license.totalAmount)}</span>
           </div>
        </div>

        {/* Validity Footer */}
        <div className="text-[11px] font-black text-slate-900 mb-4 text-center leading-tight">
           অত্র ট্রেড লাইসেন্সের মেয়াদ(Validity of this trade License):-------------{enToBnNumber("30-06-2024")}------------- পর্যন্ত (Up to) <br/>
           উল্লেখিত প্রতিষ্ঠানের অনুকূলে প্রদত্ত লাইসেন্স ফি গ্রহণ করিয়া ({application.fiscalYear?.nameBn}) ইং অর্থ বছরের জন্য।
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-auto px-10 pb-4">
           <div className="text-center">
              <div className="w-48 border-t border-slate-900 pt-1">
                 <p className="text-sm font-black">ইউপি প্রশাসনিক কর্মকর্তা</p>
              </div>
           </div>
           <div className="text-center">
              <div className="w-48 border-t border-slate-900 pt-1">
                 <p className="text-sm font-black text-lg">চেয়ারম্যান</p>
              </div>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-end text-[10px] font-bold">
           <div className="text-slate-600">
              <p>অল্প সময়ে, স্বল্প খরচে সঠিক বিচার পেতে চলো যাই গ্রাম আদালতে।</p>
              <p className="font-black text-emerald-800">230147001-Email:shikariparaup@gmail.com</p>
           </div>
           <div className="text-right flex flex-col items-end">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px]">Developed by Innovation IT.</p>
              <p className="font-black text-emerald-900 font-sans tracking-tight">www.innovationit.com.bd</p>
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
            margin: 0;
          }
          ::-webkit-scrollbar {
            display: none !important;
          }
        }

        .font-bangla {
          font-family: 'SolaimanLipi', sans-serif !important;
        }
        
        .font-sans {
          font-family: sans-serif !important;
        }
      `}</style>
    </div>
  );
};

const CertificateRow = ({ label, value, colSpan = 12 }: { label: string; value: any; colSpan?: number }) => (
  <div className={cn("flex gap-2 items-baseline", colSpan === 12 ? "col-span-12" : `col-span-${colSpan}`)}>
    <span className="font-black min-w-[150px]">{label}</span>
    <span className="mr-1">:</span>
    <span className="flex-1 border-b border-dotted border-slate-400 font-black text-slate-900 pb-0.5 leading-none">
       {value || ""}
    </span>
  </div>
);

const AddressTable = ({ title, data }: { title: string; data: any }) => (
  <div className="space-y-1">
     <h4 className="text-[11px] font-black border-b-2 border-slate-900 inline-block pb-0.5 mb-1 underline decoration-double">{title}</h4>
     <div className="space-y-0.5 text-[10px]">
        <AddressRow label="রোড/ব্লক/সেক্টর" value="" />
        <AddressRow label="হোল্ডিং নং(Holding No)" value={enToBnNumber(data.holding)} />
        <AddressRow label="গ্রাম/মহল্লা" value={data.village} />
        <AddressRow label="ডাকঘর" value={data.post} />
        <AddressRow label="উপজেলা/থানা" value={data.upazila} />
        <AddressRow label="জেলা" value={data.district} />
        <AddressRow label="বিভাগ" value="ঢাকা" />
        <AddressRow label="দেশ" value="বাংলাদেশ" />
     </div>
  </div>
);

const AddressRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-baseline gap-2">
    <span className="font-bold text-slate-700 min-w-[90px]">{label}</span>
    <span className="mr-1">:</span>
    <span className="flex-1 border-b border-dotted border-slate-300 font-black">{value || ""}</span>
  </div>
);

const FeeRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between items-baseline text-[10px]">
    <span className="font-bold text-slate-700">{label}</span>
    <div className="flex-1 border-b border-dotted border-slate-300 mx-2" />
    <span className="font-black min-w-[50px] text-right">: {value ? enToBnNumber(value) : "—"}</span>
  </div>
);
