import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

import type { DrizzleDatabase } from "~/db";

export interface AppEnv {
  Variables: {
    logger: PinoLogger;
    db: DrizzleDatabase;
  };
  Bindings: CloudflareBindings;
}

export type AppOpenAPI = OpenAPIHono<AppEnv>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppEnv>;
