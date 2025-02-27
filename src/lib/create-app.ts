import { OpenAPIHono } from "@hono/zod-openapi";
import { contextStorage } from "hono/context-storage";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import { databaseMiddleware } from "~/middleware/database";

export function createRouter() {
  return new OpenAPIHono({
    strict: true,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(contextStorage());
  app.use(serveEmojiFavicon("📝"));
  // app.use(pinoLogger());
  app.use(databaseMiddleware);

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
