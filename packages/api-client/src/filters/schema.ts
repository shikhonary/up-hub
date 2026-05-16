import {
  parseAsString,
  parseAsInteger,
  parseAsStringEnum,
  parseAsBoolean,
} from "nuqs/server";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  ACADEMIC_LEVEL,
  SORT,
  SORT_WITH_POSITION,
  TENANT_TYPE,
  MCQ_TYPE,
} from "@workspace/utils/constants";

// Common constants if not found in utils
export const ACTIVE_STATUS = ["ACTIVE", "INACTIVE"];
export const SORT_ORDER = ["asc", "desc"];

/**
 * Base pagination and search filters used across most list endpoints
 */
export const baseFilterSchema = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  limit: parseAsInteger
    .withDefault(DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
  sortBy: parseAsString.withOptions({ clearOnDefault: true }),
  sortOrder: parseAsStringEnum(["asc", "desc"]).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Academic Class Filters
 */
export const academicClassFilterSchema = {
  ...baseFilterSchema,
  level: parseAsStringEnum(Object.values(ACADEMIC_LEVEL)).withOptions({
    clearOnDefault: true,
  }),
  isActive: parseAsBoolean.withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringEnum(Object.values(SORT_WITH_POSITION)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Academic Subject Filters
 */
export const academicSubjectFilterSchema = {
  ...baseFilterSchema,
  classId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsBoolean.withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringEnum(Object.values(SORT_WITH_POSITION)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Academic Chapter Filters
 */
export const academicChapterFilterSchema = {
  ...baseFilterSchema,
  classId: parseAsString.withOptions({ clearOnDefault: true }),
  subjectId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsBoolean.withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringEnum(Object.values(SORT_WITH_POSITION)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Academic Topic Filters
 */
export const academicTopicFilterSchema = {
  ...baseFilterSchema,
  classId: parseAsString.withOptions({ clearOnDefault: true }),
  subjectId: parseAsString.withOptions({ clearOnDefault: true }),
  chapterId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsBoolean.withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringEnum(Object.values(SORT_WITH_POSITION)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Academic Subtopic Filters
 */
export const academicSubTopicFilterSchema = {
  ...baseFilterSchema,
  classId: parseAsString.withOptions({ clearOnDefault: true }),
  subjectId: parseAsString.withOptions({ clearOnDefault: true }),
  chapterId: parseAsString.withOptions({ clearOnDefault: true }),
  topicId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsBoolean.withOptions({
    clearOnDefault: true,
  }),
  sort: parseAsStringEnum(Object.values(SORT_WITH_POSITION)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * MCQ Filters
 */
export const mcqFilterSchema = {
  ...baseFilterSchema,
  subjectId: parseAsString.withOptions({ clearOnDefault: true }),
  chapterId: parseAsString.withOptions({ clearOnDefault: true }),
  topicId: parseAsString.withOptions({ clearOnDefault: true }),
  subtopicId: parseAsString.withOptions({ clearOnDefault: true }),
  type: parseAsStringEnum(Object.values(MCQ_TYPE)).withOptions({
    clearOnDefault: true,
  }),
  isMath: parseAsBoolean.withOptions({ clearOnDefault: true }),
  questionTypeId: parseAsString.withOptions({ clearOnDefault: true }),
  reference: parseAsString.withOptions({ clearOnDefault: true }),
  sort: parseAsStringEnum(Object.values(SORT)).withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Question Type Filters
 */
export const questionTypeFilterSchema = {
  ...baseFilterSchema,
  subjectId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsBoolean.withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Student Filters
 */
export const studentFilterSchema = {
  ...baseFilterSchema,
  batchId: parseAsString.withOptions({ clearOnDefault: true }),
  classId: parseAsString.withOptions({ clearOnDefault: true }),
  academicYearId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsBoolean.withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Tenant Filters
 */
export const tenantFilterSchema = {
  ...baseFilterSchema,
  type: parseAsStringEnum(Object.values(TENANT_TYPE)).withOptions({
    clearOnDefault: true,
  }),
  isActive: parseAsBoolean.withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Subscription Plan Filters
 */
export const subscriptionPlanFilterSchema = {
  ...baseFilterSchema,
  isActive: parseAsBoolean.withOptions({
    clearOnDefault: true,
  }),
};

/**
 * Subscription Filters
 */
export const subscriptionFilterSchema = {
  ...baseFilterSchema,
  status: parseAsString.withOptions({ clearOnDefault: true }),
  tier: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Academic Year Filters
 */
export const academicYearFilterSchema = {
  ...baseFilterSchema,
  isActive: parseAsBoolean.withOptions({ clearOnDefault: true }),
  isCurrent: parseAsBoolean.withOptions({ clearOnDefault: true }),
};

/**
 * Batch Filters
 */
export const batchFilterSchema = {
  ...baseFilterSchema,
  academicClassId: parseAsString.withOptions({ clearOnDefault: true }),
  academicYearId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsBoolean.withOptions({ clearOnDefault: true }),
};

/**
 * Counter Filters
 */
export const counterFilterSchema = {
  ...baseFilterSchema,
  academicYearId: parseAsString.withOptions({ clearOnDefault: true }),
  academicClassId: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Admission Fee Filters
 */
export const admissionFeeFilterSchema = {
  ...baseFilterSchema,
  academicYearId: parseAsString.withOptions({ clearOnDefault: true }),
  academicClassId: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Monthly Fee Filters
 */
export const monthlyFeeFilterSchema = {
  ...baseFilterSchema,
  academicYearId: parseAsString.withOptions({ clearOnDefault: true }),
  academicClassId: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Ward Filters
 */
export const wardFilterSchema = {
  ...baseFilterSchema,
  isActive: parseAsBoolean.withOptions({ clearOnDefault: true }),
};

/**
 * Village Filters
 */
export const villageFilterSchema = {
  ...baseFilterSchema,
  wardId: parseAsString.withOptions({ clearOnDefault: true }),
  isActive: parseAsBoolean.withOptions({ clearOnDefault: true }),
};

/**
 * Citizen Application Filters
 */
export const citizenApplicationFilterSchema = {
  ...baseFilterSchema,
  status: parseAsString.withOptions({ clearOnDefault: true }),
  wardNo: parseAsInteger.withOptions({ clearOnDefault: true }),
};

/**
 * Citizen Filters
 */
export const citizenFilterSchema = {
  ...baseFilterSchema,
  wardNo: parseAsInteger.withOptions({ clearOnDefault: true }),
  village: parseAsString.withOptions({ clearOnDefault: true }),
  gender: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Assessment Filters
 */
export const assessmentFilterSchema = {
  ...baseFilterSchema,
  wardNo: parseAsInteger.withOptions({ clearOnDefault: true }),
  villageBn: parseAsString.withOptions({ clearOnDefault: true }),
  holdingNo: parseAsString.withOptions({ clearOnDefault: true }),
  fiscalYearId: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Fiscal Year Filters
 */
export const fiscalYearFilterSchema = {
  ...baseFilterSchema,
  isActive: parseAsBoolean.withOptions({ clearOnDefault: true }),
  isCurrent: parseAsBoolean.withOptions({ clearOnDefault: true }),
};

/**
 * Holding Tax Filters
 */
export const holdingTaxFilterSchema = {
  ...baseFilterSchema,
  status: parseAsString.withOptions({ clearOnDefault: true }),
  assessmentId: parseAsString.withOptions({ clearOnDefault: true }),
  citizenId: parseAsString.withOptions({ clearOnDefault: true }),
  fiscalYearId: parseAsString.withOptions({ clearOnDefault: true }),
  wardNo: parseAsInteger.withOptions({ clearOnDefault: true }),
  villageBn: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Certificate Counter Filters
 */
export const certificateCounterFilterSchema = {
  ...baseFilterSchema,
};

/**
 * Trade License Category Filters
 */
export const tradeLicenseCategoryFilterSchema = {
  ...baseFilterSchema,
};
/**
 * Trade License Application Filters
 */
export const tradeLicenseApplicationFilterSchema = {
  ...baseFilterSchema,
  wardNo: parseAsInteger.withOptions({ clearOnDefault: true }),
  categoryId: parseAsString.withOptions({ clearOnDefault: true }),
  fiscalYearId: parseAsString.withOptions({ clearOnDefault: true }),
  status: parseAsString.withOptions({ clearOnDefault: true }),
};

/**
 * Trade License Filters
 */
export const tradeLicenseFilterSchema = {
  ...baseFilterSchema,
  fiscalYearId: parseAsString.withOptions({ clearOnDefault: true }),
  paymentStatus: parseAsString.withOptions({ clearOnDefault: true }),
  isExpired: parseAsBoolean.withOptions({ clearOnDefault: true }),
};

/**
 * Succession Application Filters
 */
export const successionApplicationFilterSchema = {
  ...baseFilterSchema,
  wardNo: parseAsInteger.withOptions({ clearOnDefault: true }),
  status: parseAsString.withOptions({ clearOnDefault: true }),
};
