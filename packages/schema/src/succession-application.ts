import { z } from "zod";

/**
 * Heir Schema
 */
export const heirSchema = z.object({
  serialNo: z.coerce.number().optional().nullable(),
  heirNameBn: z.string().min(1, "উত্তরাধিকারীর নাম (বাংলা) আবশ্যক"),
  heirNameEn: z.string().optional().nullable(),
  relationBn: z.string().min(1, "সম্পর্ক (বাংলা) আবশ্যক"),
  relationEn: z.string().optional().nullable(),
  ageDobDod: z.string().optional().nullable(),
  idNo: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
  isAlive: z.string().optional().nullable(),
});

/**
 * Succession Application Schema
 */
export const successionApplicationSchema = z.object({
  // --- Deceased Info ---
  nameEn: z.string().optional().nullable(),
  nameBn: z.string().min(1, "মৃত ব্যক্তির নাম (বাংলা) আবশ্যক"),
  nidNo: z.string().optional().nullable(),
  deathDate: z.coerce.date({
    invalid_type_error: "অকার্যকর তারিখ ফরম্যাট",
  }).optional().nullable(),
  fatherNameEn: z.string().optional().nullable(),
  fatherNameBn: z.string().min(1, "পিতার নাম (বাংলা) আবশ্যক"),
  motherNameEn: z.string().optional().nullable(),
  motherNameBn: z.string().min(1, "মাতার নাম (বাংলা) আবশ্যক"),
  residentStatus: z.string().min(1, "বাসিন্দা স্ট্যাটাস নির্বাচন করুন"),
  religion: z.string().min(1, "ধর্ম নির্বাচন করুন"),
  gender: z.string().min(1, "লিঙ্গ নির্বাচন করুন"),
  maritalStatus: z.string().min(1, "বৈবাহিক অবস্থা নির্বাচন করুন"),

  // --- Applicant Info ---
  applicantNameEn: z.string().optional().nullable(),
  applicantNameBn: z.string().min(1, "আবেদনকারীর নাম (বাংলা) আবশ্যক"),
  applicantGuardianNameEn: z.string().optional().nullable(),
  applicantGuardianNameBn: z.string().min(1, "আবেদনকারীর পিতা/স্বামীর নাম (বাংলা) আবশ্যক"),
  attachmentFile: z.any().optional().nullable(),
  deceasedPreWarish: z.string().optional().nullable(),

  // --- Present Address ---
  presentVillageEn: z.string().optional().nullable(),
  presentVillageBn: z.string().min(1, "গ্রাম/মহল্লা (বাংলা) আবশ্যক"),
  presentRoadBlockSectorEn: z.string().optional().nullable(),
  presentRoadBlockSectorBn: z.string().optional().nullable(),
  presentHoldingNo: z.string().optional().nullable(),
  presentWardNo: z.coerce.number().min(1, "ওয়ার্ড নম্বর আবশ্যক"),
  presentDistrictEn: z.string().optional().nullable(),
  presentDistrictBn: z.string().min(1, "জেলার নাম আবশ্যক"),
  presentUpazilaEn: z.string().optional().nullable(),
  presentUpazilaBn: z.string().min(1, "উপজেলার নাম আবশ্যক"),
  presentPostOfficeEn: z.string().optional().nullable(),
  presentPostOfficeBn: z.string().min(1, "ডাকঘরের নাম আবশ্যক"),

  // --- Permanent Address ---
  permanentVillageEn: z.string().optional().nullable(),
  permanentVillageBn: z.string().min(1, "গ্রাম/মহল্লা (বাংলা) আবশ্যক"),
  permanentRoadBlockSectorEn: z.string().optional().nullable(),
  permanentRoadBlockSectorBn: z.string().optional().nullable(),
  permanentHoldingNo: z.string().optional().nullable(),
  permanentWardNo: z.coerce.number().min(1, "ওয়ার্ড নম্বর আবশ্যক"),
  permanentDistrictEn: z.string().optional().nullable(),
  permanentDistrictBn: z.string().min(1, "স্থায়ী জেলার নাম আবশ্যক"),
  permanentUpazilaEn: z.string().optional().nullable(),
  permanentUpazilaBn: z.string().min(1, "স্থায়ী উপজেলার নাম আবশ্যক"),
  permanentPostOfficeEn: z.string().optional().nullable(),
  permanentPostOfficeBn: z.string().min(1, "স্থায়ী ডাকঘরের নাম আবশ্যক"),
  permanentIsSameAsPresent: z.boolean().default(false),

  // --- Heirs ---
  heirs: z.array(heirSchema).min(1, "অন্তত একজন উত্তরাধিকারী আবশ্যক"),

  status: z.string().default("PENDING"),
});

export type SuccessionApplicationFormValues = z.infer<typeof successionApplicationSchema>;
export type HeirFormValues = z.infer<typeof heirSchema>;
