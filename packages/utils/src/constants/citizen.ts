export enum RESIDENT_STATUS {
  RESIDENT = "RESIDENT",
  NON_RESIDENT = "NON_RESIDENT",
}

export const residentStatusOptions = [
  { value: RESIDENT_STATUS.RESIDENT, labelEn: "Resident", labelBn: "স্থায়ী" },
  { value: RESIDENT_STATUS.NON_RESIDENT, labelEn: "Non-Resident", labelBn: "অস্থায়ী" },
] as const;

export enum MARITAL_STATUS {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  WIDOWED = "WIDOWED",
  DIVORCED = "DIVORCED",
}

export const maritalStatusOptions = [
  { value: MARITAL_STATUS.SINGLE, labelEn: "Single", labelBn: "অবিবাহিত" },
  { value: MARITAL_STATUS.MARRIED, labelEn: "Married", labelBn: "বিবাহিত" },
  { value: MARITAL_STATUS.WIDOWED, labelEn: "Widowed", labelBn: "বিপত্নীক/বিধবা" },
  { value: MARITAL_STATUS.DIVORCED, labelEn: "Divorced", labelBn: "তালাকপ্রাপ্ত" },
] as const;

export const genderOptions = [
  { value: "MALE", labelEn: "Male", labelBn: "পুরুষ" },
  { value: "FEMALE", labelEn: "Female", labelBn: "মহিলা" },
  { value: "THIRD_GENDER", labelEn: "Third Gender", labelBn: "তৃতীয় লিঙ্গ" },
] as const;
