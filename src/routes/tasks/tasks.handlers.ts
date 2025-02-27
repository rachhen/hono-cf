import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "~/types";

import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "~/constants/schema";
import { tasks } from "~/db/schema";

import type { CreateTaskRoute, GetOneTaskRoute, ListTasksRoute, PatchTaskRoute, RemoveTaskRoute } from "./tasks.routes";

export const list: AppRouteHandler<ListTasksRoute> = async (c) => {
  const db = c.get("db");
  const tasks = await db.query.tasks.findMany();

  return c.json(tasks, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateTaskRoute> = async (c) => {
  const db = c.get("db");
  const task = c.req.valid("json");

  const [inserted] = await db
    .insert(tasks)
    .values(task)
    .returning();

  return c.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneTaskRoute> = async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");

  const task = await db.query.tasks.findFirst({
    where: (tasks, { eq }) => eq(tasks.id, id),
  });

  if (!task) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchTaskRoute> = async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");
  const task = c.req.valid("json");

  if (Object.keys(task).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [updated] = await db
    .update(tasks)
    .set(task)
    .where(eq(tasks.id, id))
    .returning();

  if (!updated) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(updated, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveTaskRoute> = async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");

  const [task] = await db.delete(tasks)
    .where(eq(tasks.id, id))
    .returning();

  if (!task) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(task, HttpStatusCodes.OK);
};
