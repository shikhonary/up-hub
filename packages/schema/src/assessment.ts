import { z } from "zod";

export const assessmentApplicationSchema = z.object({
  // Relation to Citizen
  citizenId: z.string().optional().nullable(),

  // Personal Information (Required)
  fullNameBn: z.string().min(1, "পূর্ণ নাম আবশ্যক"),
  genderBn: z.string().min(1, "লিঙ্গ নির্বাচন করুন"),
  genderEn: z.string().optional().nullable(),
  maritalStatusBn: z.string().min(1, "বৈবাহিক অবস্থা নির্বাচন করুন"),

  // Personal Information (Optional Snapshots)
  mobile: z.string().optional().nullable(),
  nid: z.string().optional().nullable(),
  birthRegistrationNo: z.string().optional().nullable(),
  passportNo: z.string().optional().nullable(),
  dateOfBirth: z.coerce.date({
    invalid_type_error: "অকার্যকর তারিখ ফরম্যাট",
  }).optional().nullable(),
  fatherNameBn: z.string().optional().nullable(),
  motherNameBn: z.string().optional().nullable(),
  occupationBn: z.string().optional().nullable(),
  residentType: z.string().optional().nullable(),
  educationalQualificationBn: z.string().optional().nullable(),
  religionBn: z.string().optional().nullable(),

  // Permanent Address (Required)
  holdingNo: z.string().min(1, "হোল্ডিং/এসেসমেন্ট নং আবশ্যক"),
  wardNo: z.coerce
    .number()
    .int()
    .min(1, "ওয়ার্ড নম্বর ১-৯ এর মধ্যে হতে হবে")
    .max(9, "ওয়ার্ড নম্বর ১-৯ এর মধ্যে হতে হবে"),
  villageBn: z.string().min(1, "গ্রাম/মহল্লা/পাড়া আবশ্যক"),
  districtBn: z.string().min(1, "জেলার নাম আবশ্যক"),
  upazilaBn: z.string().min(1, "উপজেলার নাম আবশ্যক"),
  postOfficeBn: z.string().min(1, "ডাকঘরের নাম আবশ্যক"),
  roadBlockSectorBn: z.string().optional().nullable(),

  // Survey Data (Required)
  maleCount: z.coerce.number().int().min(0, "পুরুষ সংখ্যা কমপক্ষে ০ হতে হবে"),
  femaleCount: z.coerce.number().int().min(0, "মহিলা সংখ্যা কমপক্ষে ০ হতে হবে"),

  // Survey Data (Optional)
  childCount: z.coerce.number().int().min(0).optional().nullable(),
  disabledCount: z.coerce.number().int().min(0).optional().nullable(),
  earningMembers: z.coerce.number().int().min(0).optional().nullable(),
  dependentMembers: z.coerce.number().int().min(0).optional().nullable(),
  jobSeekersSscPlus: z.coerce.number().int().min(0).optional().nullable(),
  entrepreneurSeekersSscPlus: z.coerce.number().int().min(0).optional().nullable(),
  landOwnership: z.string().optional().nullable(),
  annualIncomeSource: z.string().optional().nullable(),
  annualIncome: z.coerce.number().min(0).optional().nullable(),
  hasTubewell: z.boolean().default(false).optional(),
  majorExpenditureSectors: z.string().optional().nullable(),
  remittanceSenders: z.coerce.number().int().min(0).optional().nullable(),
  sanitationStatus: z.string().optional().nullable(),
  hasUtilities: z.boolean().default(false).optional(),
  isSocialSafetyNetCovered: z.boolean().default(false).optional(),

  // Housing Details (Optional)
  multiStoriedBuildingCount: z.coerce.number().int().min(0).optional().nullable(),
  pakaBuildingCount: z.coerce.number().int().min(0).optional().nullable(),
  semiPakaBuildingCount: z.coerce.number().int().min(0).optional().nullable(),
  tinShedCount: z.coerce.number().int().min(0).optional().nullable(),
  kachaHouseCount: z.coerce.number().int().min(0).optional().nullable(),

  // Tax & Assessment (Required)
  annualValuation: z.coerce.number().min(0, "বার্ষিক মূল্যায়ন আবশ্যক"),
  taxRatePercent: z.coerce
    .number()
    .min(1, "কর % কমপক্ষে ১ হতে হবে")
    .max(7, "কর % সর্বোচ্চ ৭ হতে হবে"),
  totalTax: z.coerce.number().min(0, "মোট কর অবশ্যই ০ বা তার বেশি হতে হবে"),

  remarks: z.string().optional().nullable(),
});

export type AssessmentApplicationFormValues = z.infer<typeof assessmentApplicationSchema>;
