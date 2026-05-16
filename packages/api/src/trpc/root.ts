import { t } from "./index";
import { authRouter } from "../routers/auth";
import { tenantRouter } from "../routers/tenant";
import { batchRouter } from "../routers/batch";
import { wardRouter } from "../routers/ward";
import { villageRouter } from "../routers/village";
import { citizenApplicationRouter } from "../routers/citizen-application";
import { citizenRouter } from "../routers/citizen";
import { familyApplicationRouter } from "../routers/family-application";
import { assessmentRouter } from "../routers/assessment";
import { fiscalYearRouter } from "../routers/fiscal-year";
import { holdingTaxRouter } from "../routers/holding-tax";

import { locationRouter } from "../routers/location";
import { certificateCounterRouter } from "../routers/certificate-counter";
import { tradeLicenseCategoryRouter } from "../routers/trade-license-category";
import { tradeLicenseApplicationRouter } from "../routers/trade-license-application";
import { tradeLicenseRouter } from "../routers/trade-license";
import { successionApplicationRouter } from "../routers/succession-application";

// Explicitly import branded types to ensure they are available for inference in this module
import type { TRPCContext, PrismaClient, TenantPrismaClient } from "./context";

/**
 * Root Router Composition.
 */
export const appRouter = t.router({
  auth: authRouter,
  tenant: tenantRouter,
  batch: batchRouter,
  ward: wardRouter,
  village: villageRouter,
  citizenApplication: citizenApplicationRouter,
  citizen: citizenRouter,
  familyApplication: familyApplicationRouter,
  assessment: assessmentRouter,
  fiscalYear: fiscalYearRouter,
  holdingTax: holdingTaxRouter,
  location: locationRouter,
  certificateCounter: certificateCounterRouter,
  tradeLicenseCategory: tradeLicenseCategoryRouter,
  tradeLicenseApplication: tradeLicenseApplicationRouter,
  tradeLicense: tradeLicenseRouter,
  successionApplication: successionApplicationRouter,
});


/**
 * Export AppRouter type for frontend consumption.
 */
export type AppRouter = typeof appRouter;

/**
 * Re-exporting these here as well just to be absolutely sure the compiler
 * can name them when resolving AppRouter.
 */
export type { TRPCContext, PrismaClient, TenantPrismaClient };
