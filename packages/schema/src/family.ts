import { z } from "zod";
import {
  FAMILY_APPLICATION_STATUS,
  FAMILY_MARITAL_STATUS,
  VITAL_STATUS,
} from "@workspace/utils";

export const familyMemberSchema = z.object({
  id: z.string().optional(),
  nameBengali: z.string().min(1, "নাম (বাংলায়) আবশ্যক"),
  nameEnglish: z.string().optional().nullable(),
  relationBengali: z.string().min(1, "সম্পর্ক (বাংলায়) আবশ্যক"),
  relationEnglish: z.string().optional().nullable(),
  dateOrAge: z.string().min(1, "বয়স/ জন্ম তারিখ/ মৃত্যু তারিখ আবশ্যক"),
  identityNumber: z.string().min(1, "পরিচয় পত্র নং আবশ্যক"),
  maritalStatus: z.nativeEnum(FAMILY_MARITAL_STATUS),
  vitalStatus: z.nativeEnum(VITAL_STATUS),
  citizenId: z.string().optional().nullable(),
});

export const familyApplicationSchema = z.object({
  applicantName: z.string().min(1, "আবেদনকারীর নাম আবশ্যক"),
  citizenId: z.string().min(1, "Citizen ID is required"),
  status: z.nativeEnum(FAMILY_APPLICATION_STATUS).default(FAMILY_APPLICATION_STATUS.PENDING),
  members: z.array(familyMemberSchema).min(1, "অন্তত একজন সদস্য থাকতে হবে"),
});

export type FamilyMemberValues = z.infer<typeof familyMemberSchema>;
export type FamilyApplicationValues = z.infer<typeof familyApplicationSchema>;
