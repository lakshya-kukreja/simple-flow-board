import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from "@/services/tasks";

const iconButton =
  "size-7 grid place-items-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onMove,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, status: TaskStatus) => void;
}) {
  const index = TASK_STATUSES.indexOf(task.status);
  const previous = TASK_STATUSES[index - 1];
  const next = TASK_STATUSES[index + 1];

  return (
    <article
      data-testid="task-card"
      className="group rounded-xl bg-card ring-1 ring-border p-3.5 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <h3 className="font-semibold text-[15px] leading-snug text-card-foreground">{task.title}</h3>
      {task.description ? (
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{task.description}</p>
      ) : null}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{STATUS_LABELS[task.status]}</span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className={iconButton}
            disabled={!previous}
            aria-label={
              previous ? `Move "${task.title}" to ${STATUS_LABELS[previous]}` : "Cannot move left"
            }
            onClick={() => previous && onMove(task, previous)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={iconButton}
            disabled={!next}
            aria-label={next ? `Move "${task.title}" to ${STATUS_LABELS[next]}` : "Cannot move right"}
            onClick={() => next && onMove(task, next)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={iconButton}
            aria-label={`Edit "${task.title}"`}
            onClick={() => onEdit(task)}
          >
            <Pencil className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={iconButton}
            aria-label={`Delete "${task.title}"`}
            onClick={() => onDelete(task)}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
