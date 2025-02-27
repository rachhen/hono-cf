import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/e683851f0a63854e5c377d932045f0dcf51f6bb7aadbdfaff1440bbcaadd6fb4.sqlite",
  },
});
