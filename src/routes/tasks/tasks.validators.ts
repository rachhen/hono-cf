import { z } from "@hono/zod-openapi";

export const createTaskSchema = z.object({
  name: z.string().min(1),
  done: z.boolean().default(false),
});

export const updateTaskSchema = createTaskSchema.partial();
