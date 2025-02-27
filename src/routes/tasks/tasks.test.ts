import { env } from "cloudflare:test";
import { testClient } from "hono/testing";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { describe, expect, expectTypeOf, it } from "vitest";
import { ZodIssueCode } from "zod";

import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "~/constants/schema";
import createApp from "~/lib/create-app";

import router from "./tasks.index";

const client = testClient(createApp().route("/", router), { DB: env.DB });

describe("tasks routes", () => {
  it("post /tasks validates the body when creating", async () => {
    const response = await client.tasks.$post({
      // @ts-expect-error to make it error
      json: {
        done: true,
      },
    }, {});

    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("name");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });

  const id = 1;
  const name = "Learn vitest";
  it("post /tasks creates task", async () => {
    await createTask(name, id);
  });

  it("get /tasks lists tasks", async () => {
    await createTask(name, id);
    const response = await client.tasks.$get();

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expect(json.length).toBe(1);
    }
  });

  it("get /tasks/{id} validates the id param", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        // @ts-expect-error make it error
        id: "invalid",
      },
    });

    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("get /tasks/{id} returns 404 when task not found", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        id: 1,
      },
    });

    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it("get /tasks/{id} returns the task", async () => {
    await createTask(name, id);
    const response = await client.tasks[":id"].$get({
      param: {
        id,
      },
    });

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.id).toBe(id);
      expect(json.name).toBe(name);
      expect(json.done).toBe(false);
    }
  });

  it("patch /tasks/{id} validates the id param", async () => {
    const response = await client.tasks[":id"].$patch({
      param: {
        // @ts-expect-error make it error
        id: "invalid",
      },
    });

    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("patch /tasks/{id} validates empty body", async () => {
    await createTask(name, id);
    const response = await client.tasks[":id"].$patch({
      param: {
        id,
      },
      json: {},
    });

    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
    }
  });

  it("patch /tasks/{id} validates the body when updating", async () => {
    await createTask(name, id);
    const response = await client.tasks[":id"].$patch({
      param: {
        id,
      },
      json: {
        name: "",
      },
    });

    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("name");
      expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
    }
  });

  it("patch /tasks/{id} updates a single property of task", async () => {
    await createTask(name, id);
    const response = await client.tasks[":id"].$patch({
      param: {
        id,
      },
      json: {
        done: true,
      },
    });

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.id).toBe(id);
      expect(json.name).toBe(name);
      expect(json.done).toBe(true);
    }
  });

  it("delete /tasks/{id} validates the id param", async () => {
    const response = await client.tasks[":id"].$delete({
      param: {
        // @ts-expect-error make it error
        id: "invalid",
      },
    });

    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("delete /tasks/{id} returns 404 when task not found", async () => {
    const response = await client.tasks[":id"].$delete({
      param: {
        id: 1,
      },
    });

    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it("delete /tasks/{id} deletes the task", async () => {
    await createTask(name, id);
    const response = await client.tasks[":id"].$delete({
      param: {
        id,
      },
    });

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.id).toBe(id);
      expect(json.name).toBe(name);
      expect(json.done).toBe(false);
    }
  });
});

async function createTask(name: string, id: number) {
  const response = await client.tasks.$post({
    json: {
      name,
      done: false,
    },
  });

  expect(response.status).toBe(200);
  if (response.status === 200) {
    const json = await response.json();
    expect(json.id).toBe(id);
    expect(json.name).toBe(name);
    expect(json.done).toBe(false);
  }
}
