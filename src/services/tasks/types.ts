/**
 * Task service contract.
 *
 * This file is the single source of truth for the shape of task data and the
 * operations the UI is allowed to perform. Implementations (mock today, HTTP
 * later) must satisfy `TaskService` without any change to React components.
 */

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
}

export type UpdateTaskInput = Partial<Omit<Task, "id">>;

/** Thrown when an operation targets a task id that does not exist. */
export class TaskNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Task not found: ${id}`);
    this.name = "TaskNotFoundError";
  }
}

/** Thrown when input fails validation before reaching the data source. */
export class TaskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskValidationError";
  }
}

export interface TaskService {
  getTasks(): Promise<Task[]>;
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(id: string, changes: UpdateTaskInput): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};
