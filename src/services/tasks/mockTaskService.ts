import {
  TASK_STATUSES,
  TaskNotFoundError,
  TaskValidationError,
  type CreateTaskInput,
  type Task,
  type TaskService,
  type UpdateTaskInput,
} from "./types";

/** Fake/local data source seeding the mock backend. */
const seedTasks: Task[] = [
  {
    id: "task-1",
    title: "Draft onboarding empty states",
    description: "Define what a fresh board looks like before the first task is created.",
    status: "todo",
  },
  {
    id: "task-2",
    title: "Add rate limiting to task API",
    description: "Cap mutations per client to protect the service layer from bursts.",
    status: "todo",
  },
  {
    id: "task-3",
    title: "Refactor task card component",
    description: "Split controls into a small presentational API for reuse.",
    status: "in_progress",
  },
  {
    id: "task-4",
    title: "Document the service contract",
    description: "So the FastAPI port can derive an OpenAPI spec cleanly.",
    status: "in_progress",
  },
  {
    id: "task-5",
    title: "Scaffold the mock service",
    description: "Async getTasks, createTask, updateTask, deleteTask.",
    status: "done",
  },
  {
    id: "task-6",
    title: "Lock the board layout grid",
    description: "Three equal columns, responsive stacking on mobile.",
    status: "done",
  },
];

const DEFAULT_LATENCY_MS = 220;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clone(task: Task): Task {
  return { ...task };
}

function assertValidTitle(title: unknown): string {
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new TaskValidationError("Title is required.");
  }
  return title.trim();
}

function assertValidStatus(status: unknown): Task["status"] {
  if (!TASK_STATUSES.includes(status as Task["status"])) {
    throw new TaskValidationError(`Unknown status: ${String(status)}`);
  }
  return status as Task["status"];
}

export interface MockTaskServiceOptions {
  /** Simulated network latency in ms. */
  latencyMs?: number;
  /** Override the initial data set (useful in tests). */
  initialTasks?: Task[];
}

/**
 * In-memory implementation of `TaskService` that simulates an asynchronous
 * backend. Swap this for an HTTP implementation without touching the UI.
 */
export function createMockTaskService(options: MockTaskServiceOptions = {}): TaskService {
  const latencyMs = options.latencyMs ?? DEFAULT_LATENCY_MS;
  let tasks: Task[] = (options.initialTasks ?? seedTasks).map(clone);
  let counter = tasks.length;

  return {
    async getTasks() {
      await delay(latencyMs);
      return tasks.map(clone);
    },

    async createTask(input: CreateTaskInput) {
      await delay(latencyMs);
      const title = assertValidTitle(input.title);
      const status = assertValidStatus(input.status);
      counter += 1;
      const task: Task = {
        id: `task-${counter}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        description: (input.description ?? "").trim(),
        status,
      };
      tasks = [...tasks, task];
      return clone(task);
    },

    async updateTask(id: string, changes: UpdateTaskInput) {
      await delay(latencyMs);
      const existing = tasks.find((task) => task.id === id);
      if (!existing) throw new TaskNotFoundError(id);

      const next: Task = {
        ...existing,
        ...(changes.title !== undefined ? { title: assertValidTitle(changes.title) } : {}),
        ...(changes.description !== undefined
          ? { description: changes.description.trim() }
          : {}),
        ...(changes.status !== undefined ? { status: assertValidStatus(changes.status) } : {}),
      };

      tasks = tasks.map((task) => (task.id === id ? next : task));
      return clone(next);
    },

    async deleteTask(id: string) {
      await delay(latencyMs);
      if (!tasks.some((task) => task.id === id)) throw new TaskNotFoundError(id);
      tasks = tasks.filter((task) => task.id !== id);
    },
  };
}
