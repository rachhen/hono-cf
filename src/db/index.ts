import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export function createDatabase(env: CloudflareBindings) {
  return drizzle(env.DB, { schema });
}

export type DrizzleDatabase = ReturnType<typeof createDatabase>;
