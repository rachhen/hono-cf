import { pinoLogger as logger } from "hono-pino";
import { getContext } from "hono/context-storage";
import pino from "pino";
import pretty from "pino-pretty";

import type { AppEnv } from "~/types";

export function pinoLogger() {
  const ctx = getContext<AppEnv>();
  return logger({
    pino: pino(
      {
        level: ctx.env.LOG_LEVEL || "info",
      },
      ctx.env.NODE_ENV === "production" ? undefined : pretty(),
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
