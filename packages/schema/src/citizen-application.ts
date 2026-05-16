import { z } from "zod";

export const citizenApplicationSchema = z.object({
  // Basic Info
  fullNameEn: z.string().optional().nullable(),
  fullNameBn: z.string().min(1, "পূর্ণ নাম আবশ্যক"),
  nid: z.string().min(1, "এনআইডি নম্বর আবশ্যক"),
  birthRegistrationNo: z.string().optional().nullable(),
  passportNo: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date({
    required_error: "জন্ম তারিখ আবশ্যক",
    invalid_type_error: "অকার্যকর তারিখ ফরম্যাট",
  }),
  fatherNameEn: z.string().optional().nullable(),
  fatherNameBn: z.string().min(1, "পিতার নাম আবশ্যক"),
  motherNameEn: z.string().optional().nullable(),
  motherNameBn: z.string().min(1, "মাতার নাম আবশ্যক"),
  occupationEn: z.string().optional().nullable(),
  occupationBn: z.string().min(1, "পেশা আবশ্যক"),

  residentStatusEn: z.string().optional().nullable(),
  residentStatusBn: z.string().min(1, "অবস্থানের ধরণ আবশ্যক"),
  educationalQualificationEn: z.string().optional().nullable(),
  educationalQualificationBn: z.string().optional().nullable(),
  religionEn: z.string().optional().nullable(),
  religionBn: z.string().min(1, "ধর্ম আবশ্যক"),
  genderEn: z.string().optional().nullable(),
  genderBn: z.string().min(1, "লিঙ্গ আবশ্যক"),
  maritalStatusEn: z.string().optional().nullable(),
  maritalStatusBn: z.string().min(1, "বৈবাহিক অবস্থা আবশ্যক"),

  // Present Address
  presentVillageEn: z.string().optional().nullable(),
  presentVillageBn: z.string().min(1, "গ্রামের নাম আবশ্যক"),
  presentRoadBlockSectorEn: z.string().optional().nullable(),
  presentRoadBlockSectorBn: z.string().optional().nullable(),
  presentHoldingNo: z.string().optional().nullable(),
  presentWardNo: z.coerce.number().int().positive("ওয়ার্ড নম্বর আবশ্যক"),
  presentDistrictEn: z.string().optional().nullable(),
  presentDistrictBn: z.string().min(1, "জেলার নাম আবশ্যক"),
  presentUpazilaEn: z.string().optional().nullable(),
  presentUpazilaBn: z.string().min(1, "উপজেলার নাম আবশ্যক"),
  presentPostOfficeEn: z.string().optional().nullable(),
  presentPostOfficeBn: z.string().min(1, "ডাকঘরের নাম আবশ্যক"),

  // Permanent Address
  permanentVillageEn: z.string().optional().nullable(),
  permanentVillageBn: z.string().min(1, "স্থায়ী গ্রামের নাম আবশ্যক"),
  permanentRoadBlockSectorEn: z.string().optional().nullable(),
  permanentRoadBlockSectorBn: z.string().optional().nullable(),
  permanentHoldingNo: z.string().optional().nullable(),
  permanentWardNo: z.coerce.number().int().positive("স্থায়ী ওয়ার্ড নম্বর আবশ্যক"),
  permanentDistrictEn: z.string().optional().nullable(),
  permanentDistrictBn: z.string().min(1, "স্থায়ী জেলার নাম আবশ্যক"),
  permanentUpazilaEn: z.string().optional().nullable(),
  permanentUpazilaBn: z.string().min(1, "স্থায়ী উপজেলার নাম আবশ্যক"),
  permanentPostOfficeEn: z.string().optional().nullable(),
  permanentPostOfficeBn: z.string().min(1, "স্থায়ী ডাকঘরের নাম আবশ্যক"),

  // Contact
  mobile: z.string().min(11, "মোবাইল নম্বর কমপক্ষে ১১ ডিজিট হতে হবে"),
  email: z.string().email("অকার্যকর ইমেইল ঠিকানা").optional().nullable().or(z.literal("")),
  commentsEn: z.string().optional().nullable(),
  commentsBn: z.string().optional().nullable(),
});

export type CitizenApplicationFormValues = z.infer<typeof citizenApplicationSchema>;
