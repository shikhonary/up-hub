"use client";

import React, { useRef } from "react";
import { useCitizenApplicationById } from "@workspace/api-client";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { enToBnNumber } from "@workspace/utils";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { Printer, Download } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { cn } from "@workspace/ui/lib/utils";

interface CitizenApplicationFormViewProps {
  id: string;
}

export const CitizenApplicationFormView = ({ id }: CitizenApplicationFormViewProps) => {
  const { data: application, isLoading } = useCitizenApplicationById(id);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-[800px] mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-10 w-64 mx-auto rounded-xl" />
        <div className="grid grid-cols-2 gap-8">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 print:p-0 print:bg-white">
      {/* Control Bar */}
      <div className="max-w-[850px] mx-auto mb-8 flex justify-between items-center print:hidden bg-white p-4 rounded-3xl shadow-ambient border border-outline/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Printer size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-on-surface">আবেদন ফরম প্রিন্ট করুন</h3>
            <p className="text-[10px] font-bold text-on-surface-variant/60">সঠিকভাবে প্রিন্ট করতে A4 সাইজ সিলেক্ট করুন</p>
          </div>
        </div>
        <Button
          onClick={handlePrint}
          className="rounded-2xl bg-primary text-white font-black hover:bg-primary/90 shadow-glow px-6"
        >
          <Printer className="w-4 h-4 mr-2" /> প্রিন্ট / ডাউনলোড PDF
        </Button>
      </div>

      {/* Printable Area */}
      <div
        ref={printRef}
        className="max-w-[850px] mx-auto bg-white shadow-2xl print:shadow-none print:w-full p-[40px] relative isolate"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-5">
          <div className="w-20 h-20 relative">
            <Image src="/gob-logo.jpg" alt="Gov Logo" width={50} height={50} className="w-full h-full object-contain" />
          </div>

          <div className="text-center flex-1 px-4">
            <h1 className="text-2xl font-black text-blue-800 leading-tight">শিকারী পাড়া ইউনিয়ন পরিষদ</h1>
            <p className="text-sm font-bold text-slate-800">শিকারী পাড়া, নবাবগঞ্জ, ঢাকা-১৩২২</p>
            <p className="text-xs font-bold text-slate-600 mt-1">মোবাইল: ০১৭১৪৩২৯৪৪৬, ই-মেইল: shikariparaup@gmail.com</p>
            <p className="text-[10px] font-bold text-blue-600">ওয়েব সাইট: https://lgdhaka.com</p>
          </div>

          <div className="w-20 h-20 relative bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-600 p-2 overflow-hidden">
            <Image src="/union-logo.jpg" alt="UP Logo" className="w-full h-full object-contain" width={50} height={50} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="inline-block border-b-2 border-slate-900 pb-1 text-xl font-black text-slate-900 tracking-wider">
            নাগরিকত্ব সনদের আবেদন
          </h2>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-8">
          <InfoRow label="আবেদনের তারিখ" value={enToBnNumber(format(new Date(application.createdAt), "dd-MM-yyyy"))} />
          <InfoRow label="ট্র্যাকিং আইডি" value={enToBnNumber(id.slice(0, 10).toUpperCase())} />

          <InfoRow label="নাম (বাংলা)" value={application.fullNameBn} />
          <InfoRow label="নাম (ইংরেজি)" value={application.fullNameEn} />

          <InfoRow label="পিতার নাম" value={application.fatherNameBn} />
          <InfoRow label="মাতার নাম" value={application.motherNameBn} />

          <InfoRow label="লিঙ্গ" value={application.genderBn} />
          <InfoRow label="বৈবাহিক অবস্থা" value={application.maritalStatusBn} />

          <InfoRow label="ধর্ম" value={application.religionBn} />
          <InfoRow label="পেশা" value={application.occupationBn} />

          <InfoRow label="শিক্ষাগত যোগ্যতা" value={application.educationalQualificationBn} />
          <InfoRow label="মোবাইল" value={enToBnNumber(application.mobile)} />

          <InfoRow label="জন্ম তারিখ" value={application.dateOfBirth ? enToBnNumber(format(new Date(application.dateOfBirth), "dd-MM-yyyy")) : "—"} />
          <InfoRow label="এনআইডি নম্বর" value={enToBnNumber(application.nid)} />

          <InfoRow label="জন্ম নিবন্ধন নং" value={enToBnNumber(application.birthRegistrationNo)} />
          <InfoRow label="পাসপোর্ট নম্বর" value={enToBnNumber(application.passportNo)} />
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full" /> বর্তমান ঠিকানা
            </h3>
            <div className="grid grid-cols-1 gap-2 text-[11px] leading-relaxed">
              <p><span className="font-bold">গ্রাম/মহল্লা:</span> {application.presentVillageBn}</p>
              <p><span className="font-bold">ওয়ার্ড নং:</span> {enToBnNumber(application.presentWardNo)}</p>
              <p><span className="font-bold">ডাকঘর:</span> {application.presentPostOfficeBn}</p>
              <p><span className="font-bold">উপজেলা:</span> {application.presentUpazilaBn}</p>
              <p><span className="font-bold">জেলা:</span> {application.presentDistrictBn}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-primary rounded-full" /> স্থায়ী ঠিকানা
            </h3>
            <div className="grid grid-cols-1 gap-2 text-[11px] leading-relaxed">
              <p><span className="font-bold">গ্রাম/মহল্লা:</span> {application.permanentVillageBn}</p>
              <p><span className="font-bold">ওয়ার্ড নং:</span> {enToBnNumber(application.permanentWardNo)}</p>
              <p><span className="font-bold">ডাকঘর:</span> {application.permanentPostOfficeBn}</p>
              <p><span className="font-bold">উপজেলা:</span> {application.permanentUpazilaBn}</p>
              <p><span className="font-bold">জেলা:</span> {application.permanentDistrictBn}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-4">
          <h3 className="text-sm font-black mb-4 border-b border-slate-300 pb-2">নির্দেশনাবলী / Instruction</h3>
          <ul className="text-[11px] font-bold space-y-2 text-slate-700">
            <li>১) এলাকার ১ জন ওয়ার্ড মেম্বার কর্তৃক সত্যায়িত করে ইউনিয়ন পরিষদে জমা দিন।</li>
            <li>২) ১ কপি পাসপোর্ট সাইজ ছবি (সত্যায়িত) সহ আবেদনপত্রের সাথে যুক্ত করুন।</li>
            <li>৩) আবেদনপত্রের অবস্থা জানার জন্য ট্র্যাকিং নাম্বার দিয়ে ওয়েব সাইট থেকে যাচাই করুন।</li>
          </ul>
        </div>

        {/* Verification Section */}
        <div className="">
          <div className="text-center">
            <h3 className="text-sm font-black border-b-2 border-slate-900 inline-block pb-1">
              সত্যায়ন / Verification
            </h3>
          </div>

          <div className="flex justify-between items-end">
            <div className="flex gap-16">
              <div className="text-center">
                <div className="w-32 h-px bg-slate-900 mb-2" />
                <p className="text-[10px] font-black text-slate-800">স্বাক্ষর</p>
                <p className="text-[9px] font-bold text-slate-600">আবেদনকারী</p>
              </div>

              <div className="text-center">
                <div className="w-40 h-px bg-slate-900 mb-2" />
                <p className="text-[10px] font-black text-slate-800">স্বাক্ষর</p>
                <p className="text-[9px] font-bold text-slate-600">ইউপি সদস্য/ওয়ার্ড মেম্বার</p>
              </div>
            </div>

            <div className="w-24 h-24 relative border border-slate-900 p-1.5 rounded-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-50 flex items-center justify-center overflow-hidden">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://lgdhaka.com/verify/${id}`}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="absolute -bottom-5 right-0 text-[7px] font-black text-slate-400 uppercase tracking-tighter">Scan for Verification</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-slate-100 pt-2 flex justify-between items-end text-[9px] font-bold text-slate-400">
          <div className="space-y-0.5">
            <p className="text-slate-500">E-mail: shikariparaup@gmail.com</p>
            <p>Printed on: {format(new Date(), "dd/MM/yyyy")}</p>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary" />
              <p className="text-slate-600 font-black">Developed By: ANImegh IT Care</p>
            </div>
            <p className="tracking-widest opacity-60">WWW.ANIMEGH.COM</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background-color: white;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

const InfoRow = ({ label, value, className }: { label: string; value: any; className?: string }) => (
  <div className={cn("flex items-baseline gap-4", className)}>
    <span className="text-[12px] font-bold text-slate-600 min-w-[110px]">{label}</span>
    <span className="text-[12px] font-black text-slate-900 flex-1 border-b border-dotted border-slate-300 pb-0.5">
      : {value || "—"}
    </span>
  </div>
);
