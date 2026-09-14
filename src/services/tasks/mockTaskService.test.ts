import { describe, expect, it } from "vitest";
import { createMockTaskService } from "./mockTaskService";
import { TaskNotFoundError, TaskValidationError, type Task } from "./types";

const initialTasks: Task[] = [
  { id: "a", title: "Alpha", description: "First", status: "todo" },
  { id: "b", title: "Beta", description: "Second", status: "in_progress" },
];

const makeService = () => createMockTaskService({ latencyMs: 0, initialTasks });

describe("mock task service", () => {
  it("returns the seeded tasks", async () => {
    const service = makeService();
    const tasks = await service.getTasks();
    expect(tasks.map((task) => task.id)).toEqual(["a", "b"]);
  });

  it("does not leak internal state through returned objects", async () => {
    const service = makeService();
    const tasks = await service.getTasks();
    tasks[0].title = "mutated";
    const again = await service.getTasks();
    expect(again[0].title).toBe("Alpha");
  });

  it("creates a task with a generated id and persists it", async () => {
    const service = makeService();
    const created = await service.createTask({
      title: "  Gamma  ",
      description: " third ",
      status: "done",
    });
    expect(created.id).toBeTruthy();
    expect(created.title).toBe("Gamma");
    expect(created.description).toBe("third");
    expect(created.status).toBe("done");
    expect(await service.getTasks()).toHaveLength(3);
  });

  it("rejects a task without a title", async () => {
    const service = makeService();
    await expect(
      service.createTask({ title: "   ", description: "", status: "todo" }),
    ).rejects.toBeInstanceOf(TaskValidationError);
  });

  it("rejects an unknown status", async () => {
    const service = makeService();
    await expect(
      // @ts-expect-error deliberately invalid status
      service.createTask({ title: "X", description: "", status: "archived" }),
    ).rejects.toBeInstanceOf(TaskValidationError);
  });

  it("updates only the provided fields", async () => {
    const service = makeService();
    const updated = await service.updateTask("a", { status: "done" });
    expect(updated).toMatchObject({ id: "a", title: "Alpha", status: "done" });
  });

  it("moves a task between statuses", async () => {
    const service = makeService();
    await service.updateTask("b", { status: "done" });
    const tasks = await service.getTasks();
    expect(tasks.find((task) => task.id === "b")?.status).toBe("done");
  });

  it("throws when updating a missing task", async () => {
    const service = makeService();
    await expect(service.updateTask("nope", { title: "x" })).rejects.toBeInstanceOf(
      TaskNotFoundError,
    );
  });

  it("deletes a task", async () => {
    const service = makeService();
    await service.deleteTask("a");
    expect((await service.getTasks()).map((task) => task.id)).toEqual(["b"]);
  });

  it("throws when deleting a missing task", async () => {
    const service = makeService();
    await expect(service.deleteTask("nope")).rejects.toBeInstanceOf(TaskNotFoundError);
  });

  it("is asynchronous — results are not available synchronously", async () => {
    const service = createMockTaskService({ latencyMs: 5, initialTasks });
    let resolved = false;
    const promise = service.getTasks().then(() => {
      resolved = true;
    });
    expect(resolved).toBe(false);
    await promise;
    expect(resolved).toBe(true);
  });

  it("keeps separate instances isolated", async () => {
    const one = makeService();
    const two = makeService();
    await one.deleteTask("a");
    expect(await two.getTasks()).toHaveLength(2);
  });
});
