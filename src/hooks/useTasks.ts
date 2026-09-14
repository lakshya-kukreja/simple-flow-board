import { useCallback, useEffect, useState } from "react";
import {
  taskService as defaultTaskService,
  type CreateTaskInput,
  type Task,
  type TaskService,
  type TaskStatus,
  type UpdateTaskInput,
} from "@/services/tasks";

/**
 * The only bridge between React and the task service. Components call these
 * callbacks; they never touch the service or the data source directly.
 */
export function useTasks(service: TaskService = defaultTaskService) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setTasks(await service.getTasks());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createTask = useCallback(
    async (input: CreateTaskInput) => {
      try {
        const created = await service.createTask(input);
        setTasks((prev) => [...prev, created]);
        setError(null);
        return created;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not create the task.");
        return null;
      }
    },
    [service],
  );

  const updateTask = useCallback(
    async (id: string, changes: UpdateTaskInput) => {
      try {
        const updated = await service.updateTask(id, changes);
        setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
        setError(null);
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save the task.");
        return null;
      }
    },
    [service],
  );

  const moveTask = useCallback(
    (id: string, status: TaskStatus) => updateTask(id, { status }),
    [updateTask],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        await service.deleteTask(id);
        setTasks((prev) => prev.filter((task) => task.id !== id));
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not delete the task.");
        return false;
      }
    },
    [service],
  );

  return { tasks, isLoading, error, refresh, createTask, updateTask, moveTask, deleteTask };
}
