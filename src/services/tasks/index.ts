import { createMockTaskService } from "./mockTaskService";
import type { TaskService } from "./types";

/**
 * The single task service instance the app talks to. Replacing the mock with a
 * real HTTP client later means changing only this line.
 */
export const taskService: TaskService = createMockTaskService();

export * from "./types";
export { createMockTaskService } from "./mockTaskService";
