import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "~/constants/schema";
import { insertTasksSchema, selectTasksSchema } from "~/db/schema";

import { createTaskSchema, updateTaskSchema } from "./tasks.validators";

const tags = ["Tasks"];

export const list = createRoute({
  tags,
  method: "get",
  path: "/tasks",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTasksSchema),
      "List of tasks",
    ),
  },
});

export const create = createRoute({
  tags,
  method: "post",
  path: "/tasks",
  request: {
    body: jsonContentRequired(createTaskSchema, "Task to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      "Created task",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  tags,
  method: "get",
  path: "/tasks/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      "The requested task",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      "The validation error(s)",
    ),
  },
});

export const patch = createRoute({
  tags,
  method: "patch",
  path: "/tasks/{id}",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateTaskSchema, "Task to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      "The updated task",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema).or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  tags,
  method: "delete",
  path: "/tasks/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      "The deleted task",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      "The validation error(s)",
    ),
  },
});

export type ListTasksRoute = typeof list;
export type CreateTaskRoute = typeof create;
export type GetOneTaskRoute = typeof getOne;
export type PatchTaskRoute = typeof patch;
export type RemoveTaskRoute = typeof remove;
