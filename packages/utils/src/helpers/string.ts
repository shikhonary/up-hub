/**
 * String manipulation helpers
 */

/**
 * Converts text into a URL-friendly slug
 * Example: "My School Name!" => "my-school-name"
 */
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

/**
 * Capitalizes first letter of each word
 */
export const capitalize = (text: string) => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Gets initials from a name
 * Example: "John Doe" => "JD"
 */
export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Converts English digits to Bengali digits
 */
export const enToBnNumber = (number: string | number | undefined | null): string => {
  if (number === undefined || number === null) return "";
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return number
    .toString()
    .replace(/\d/g, (d) => bnDigits[parseInt(d)] as string);
};

/**
 * Converts Bengali digits to English digits
 */
export const bnToEnNumber = (number: string | undefined | null): string => {
  if (!number) return "";
  const enDigits = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return number.replace(/[০-৯]/g, (d) => enDigits[d as keyof typeof enDigits] as string);
};
