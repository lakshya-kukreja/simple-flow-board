import { STATUS_LABELS, type Task, type TaskStatus } from "@/services/tasks";
import { TaskCard } from "./TaskCard";

const DOT: Record<TaskStatus, string> = {
  todo: "bg-status-todo",
  in_progress: "bg-status-progress",
  done: "bg-status-done",
};

export function BoardColumn({
  status,
  tasks,
  onAdd,
  onEdit,
  onDelete,
  onMove,
}: {
  status: TaskStatus;
  tasks: Task[];
  onAdd: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, status: TaskStatus) => void;
}) {
  return (
    <section
      aria-label={STATUS_LABELS[status]}
      className="flex flex-col rounded-2xl bg-surface ring-1 ring-border"
    >
      <header className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <span className={`size-2.5 rounded-full ${DOT[status]}`} aria-hidden="true" />
        <h2 className="font-display font-semibold text-[15px] tracking-tight">
          {STATUS_LABELS[status]}
        </h2>
        <span className="ml-auto text-xs font-medium text-muted-foreground bg-secondary rounded-full px-2.5 py-1">
          {tasks.length}
        </span>
      </header>
      <div className="flex flex-col gap-2.5 px-3 pb-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
        <button
          type="button"
          onClick={() => onAdd(status)}
          className="mt-1 rounded-xl border border-dashed border-border text-muted-foreground text-sm py-2.5 transition hover:bg-card hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + Add task
        </button>
      </div>
    </section>
  );
}
