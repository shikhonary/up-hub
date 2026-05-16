import { z } from "zod";

/**
 * Trade License Application Schema
 */
export const tradeLicenseApplicationSchema = z.object({
  // --- Organization Info ---
  orgNameEn: z.string().optional().nullable(),
  orgNameBn: z.string().min(1, "প্রতিষ্ঠানের নাম (বাংলা) আবশ্যক"),
  ownershipTypeBn: z.string().min(1, "মালিকানার ধরন নির্বাচন করুন"),
  ownershipTypeEn: z.string().optional().nullable(),

  // --- Owner Info ---
  fullNameEn: z.string().optional().nullable(),
  fullNameBn: z.string().min(1, "মালিকের নাম (বাংলা) আবশ্যক"),
  tinBn: z.string().optional().nullable(),
  tinEn: z.string().optional().nullable(),
  binBn: z.string().optional().nullable(),
  binEn: z.string().optional().nullable(),
  fatherNameEn: z.string().optional().nullable(),
  fatherNameBn: z.string().min(1, "পিতার নাম (বাংলা) আবশ্যক"),
  motherNameEn: z.string().optional().nullable(),
  motherNameBn: z.string().min(1, "মাতার নাম (বাংলা) আবশ্যক"),
  nidBn: z.string().optional().nullable(),
  nidEn: z.string().optional().nullable(),
  birthRegistrationBn: z.string().optional().nullable(),
  birthRegistrationEn: z.string().optional().nullable(),
  passportBn: z.string().optional().nullable(),
  passportEn: z.string().optional().nullable(),

  // --- Present Address ---
  presentVillageEn: z.string().optional().nullable(),
  presentVillageBn: z.string().min(1, "গ্রাম/মহল্লা (বাংলা) আবশ্যক"),
  presentRoadBlockEn: z.string().optional().nullable(),
  presentRoadBlockBn: z.string().optional().nullable(),
  presentHoldingNoBn: z.string().optional().nullable(),
  presentHoldingNoEn: z.string().optional().nullable(),
  presentWardNo: z.coerce.number().min(1, "ওয়ার্ড নম্বর আবশ্যক"),
  presentDistrictEn: z.string().default(""),
  presentDistrictBn: z.string().default(""),
  presentUpazilaEn: z.string().default(""),
  presentUpazilaBn: z.string().default(""),
  presentDivisionEn: z.string().default(""),
  presentDivisionBn: z.string().default(""),
  presentPostOfficeEn: z.string().optional().nullable(),
  presentPostOfficeBn: z.string().min(1, "ডাকঘর (বাংলা) আবশ্যক"),

  // --- Permanent Address ---
  permanentIsSameAsPresent: z.boolean().default(false),
  permanentVillageEn: z.string().optional().nullable(),
  permanentVillageBn: z.string().min(1, "গ্রাম/মহল্লা (বাংলা) আবশ্যক"),
  permanentRoadBlockEn: z.string().optional().nullable(),
  permanentRoadBlockBn: z.string().optional().nullable(),
  permanentHoldingNoBn: z.string().optional().nullable(),
  permanentHoldingNoEn: z.string().optional().nullable(),
  permanentWardNo: z.coerce.number().min(1, "ওয়ার্ড নম্বর আবশ্যক"),
  permanentDistrictEn: z.string().default(""),
  permanentDistrictBn: z.string().default(""),
  permanentUpazilaEn: z.string().default(""),
  permanentUpazilaBn: z.string().default(""),
  permanentDivisionEn: z.string().default(""),
  permanentDivisionBn: z.string().default(""),
  permanentPostOfficeEn: z.string().optional().nullable(),
  permanentPostOfficeBn: z.string().min(1, "ডাকঘর (বাংলা) আবশ্যক"),

  // --- Business Details ---
  vatIdBn: z.string().optional().nullable(),
  vatIdEn: z.string().optional().nullable(),
  taxIdBn: z.string().optional().nullable(),
  taxIdEn: z.string().optional().nullable(),
  paidUpCapital: z.coerce.number().min(0).optional().nullable(),
  businessStartDate: z.coerce.date({
    invalid_type_error: "অকার্যকর তারিখ ফরম্যাট",
  }).optional().nullable(),
  ownershipStatusBn: z.string().optional().nullable(),
  ownershipStatusEn: z.string().optional().nullable(),
  signboardSize: z.coerce.number().min(0).optional().nullable(),

  // Relation to category
  tradeLicenseCategoryId: z.string().min(1, "ব্যবসার ধরন নির্বাচন করুন"),

  // Relation to fiscal year
  fiscalYearId: z.string().min(1, "অর্থবছর নির্বাচন করুন"),

  // --- Business Address ---
  businessVillageEn: z.string().optional().nullable(),
  businessVillageBn: z.string().min(1, "গ্রাম/মহল্লা (বাংলা) আবশ্যক"),
  businessRoadBlockEn: z.string().optional().nullable(),
  businessRoadBlockBn: z.string().optional().nullable(),
  businessHoldingNoBn: z.string().optional().nullable(),
  businessHoldingNoEn: z.string().optional().nullable(),
  businessWardNo: z.coerce.number().min(1, "ওয়ার্ড নম্বর আবশ্যক"),
  businessDistrictEn: z.string().default(""),
  businessDistrictBn: z.string().default(""),
  businessUpazilaEn: z.string().default(""),
  businessUpazilaBn: z.string().default(""),
  businessDivisionEn: z.string().default(""),
  businessDivisionBn: z.string().default(""),
  businessPostOfficeEn: z.string().optional().nullable(),
  businessPostOfficeBn: z.string().min(1, "ডাকঘর (বাংলা) আবশ্যক"),

  // --- Contact Info ---
  mobileBn: z.string().min(1, "মোবাইল নম্বর আবশ্যক"),
  mobileEn: z.string().optional().nullable(),
  email: z.string().email("সঠিক ইমেইল এড্রেস প্রদান করুন").optional().nullable().or(z.literal("")),
  applicantNameEn: z.string().optional().nullable(),
  applicantNameBn: z.string().min(1, "আবেদনকারীর নাম (বাংলা) আবশ্যক"),
  phoneBn: z.string().optional().nullable(),
  phoneEn: z.string().optional().nullable(),

  status: z.string().default("PENDING"),
});

export type TradeLicenseApplicationFormValues = z.infer<typeof tradeLicenseApplicationSchema>;

/**
 * Generate Trade License Schema
 */
export const generateTradeLicenseSchema = z.object({
  applicationId: z.string().min(1),
  licenseFee: z.coerce.number().min(0, "লাইসেন্স ফি আবশ্যক"),
  arrears: z.coerce.number().min(0),
  arrearsFiscalYear: z.string().optional().nullable(),
  discount: z.coerce.number().min(0),
  vatAmount: z.coerce.number().min(0),
  signboardTax: z.coerce.number().min(0),
  professionalTax: z.coerce.number().min(0),
  subCharge: z.coerce.number().min(0),
  totalAmount: z.coerce.number().min(0),
  paymentStatus: z.string().default("UNPAID"),
  paymentType: z.string().optional().nullable(),
  paymentDate: z.coerce.date().optional().nullable(),
});

export type GenerateTradeLicenseValues = z.infer<typeof generateTradeLicenseSchema>;
