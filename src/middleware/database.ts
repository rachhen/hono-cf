import { createMiddleware } from "hono/factory";

import type { AppEnv } from "~/types";

import { createDatabase } from "~/db";

export const databaseMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const db = createDatabase(c.env);
  c.set("db", db);

  await next();
});
