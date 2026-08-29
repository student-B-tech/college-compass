import { Temporal as PolyfillTemporal } from "@js-temporal/polyfill";

if (!(globalThis as any).Temporal) {
  (globalThis as any).Temporal = PolyfillTemporal;
}

import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/schema.d";
import contractJson from "../prisma/schema.json" with { type: "json" };

export const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL!,
});