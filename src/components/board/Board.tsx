import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import {
  TASK_STATUSES,
  type CreateTaskInput,
  type Task,
  type TaskService,
  type TaskStatus,
} from "@/services/tasks";
import { BoardColumn } from "./BoardColumn";
import { TaskFormPanel } from "./TaskFormPanel";
import { ThemeSwitcher } from "./ThemeSwitcher";

type PanelState = { mode: "create"; status: TaskStatus } | { mode: "edit"; task: Task } | null;

export function Board({ service }: { service?: TaskService }) {
  const { tasks, isLoading, error, createTask, updateTask, deleteTask, moveTask } =
    useTasks(service);
  const { theme, setTheme } = useTheme();
  const [panel, setPanel] = useState<PanelState>(null);

  const counts = {
    total: tasks.length,
    in_progress: tasks.filter((task) => task.status === "in_progress").length,
    done: tasks.filter((task) => task.status === "done").length,
  };

  const handleSubmit = async (values: CreateTaskInput) => {
    if (panel?.mode === "edit") {
      await updateTask(panel.task.id, values);
    } else {
      await createTask(values);
    }
    setPanel(null);
  };

  const handleDelete = async (task: Task) => {
    if (window.confirm(`Delete "${task.title}"?`)) await deleteTask(task.id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="board-in sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div>
              <span className="font-display font-bold tracking-tight text-xl leading-none">
                Flow
              </span>
              <span className="font-display font-medium text-muted-foreground text-xl leading-none">
                Board
              </span>
            </div>
            <span className="hidden sm:inline-flex h-5 items-center rounded-full bg-secondary px-2.5 text-[11px] font-medium text-muted-foreground">
              Mock service
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher theme={theme} onChange={setTheme} />
            <button
              type="button"
              onClick={() => setPanel({ mode: "create", status: "todo" })}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-medium text-sm px-4 py-2.5 shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              + New task
            </button>
          </div>
        </div>
      </header>

      <main className="board-in max-w-7xl mx-auto px-5 md:px-8 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl md:text-[34px] font-bold tracking-tight text-balance">
              Task board
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {isLoading
                ? "Loading tasks…"
                : `${counts.total} tasks · ${counts.in_progress} in progress · ${counts.done} done`}
            </p>
          </div>
        </div>

        {error ? (
          <p role="alert" className="mb-6 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {TASK_STATUSES.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
              onAdd={(next) => setPanel({ mode: "create", status: next })}
              onEdit={(task) => setPanel({ mode: "edit", task })}
              onDelete={handleDelete}
              onMove={(task, next) => void moveTask(task.id, next)}
            />
          ))}
        </div>
      </main>

      {panel ? (
        <TaskFormPanel
          task={panel.mode === "edit" ? panel.task : null}
          initialStatus={panel.mode === "create" ? panel.status : "todo"}
          onClose={() => setPanel(null)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}
