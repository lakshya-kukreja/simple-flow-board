import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  STATUS_LABELS,
  TASK_STATUSES,
  type CreateTaskInput,
  type Task,
  type TaskStatus,
} from "@/services/tasks";

export function TaskFormPanel({
  task,
  initialStatus,
  onClose,
  onSubmit,
}: {
  task: Task | null;
  initialStatus: TaskStatus;
  onClose: () => void;
  onSubmit: (values: CreateTaskInput) => Promise<void> | void;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    await onSubmit({ title: title.trim(), description: description.trim(), status });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30"
      />
      <div className="board-in absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md md:left-auto md:right-0 md:top-0 md:bottom-0 md:w-[440px] md:max-w-none md:translate-x-0 md:translate-y-0">
        <form
          onSubmit={handleSubmit}
          role="dialog"
          aria-modal="true"
          aria-label={task ? "Edit task" : "New task"}
          className="w-full md:h-full flex flex-col overflow-hidden bg-background ring-1 ring-border rounded-2xl md:rounded-none md:rounded-l-2xl shadow-xl"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">
                {task ? "Edit task" : "New task"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Saved via the service layer</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="size-8 grid place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            <div>
              <label htmlFor="task-title" className="block text-[13px] font-medium mb-1.5">
                Title
              </label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Review pull request"
                className="w-full rounded-lg bg-card text-card-foreground ring-1 ring-border px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="task-description" className="block text-[13px] font-medium mb-1.5">
                Description
              </label>
              <textarea
                id="task-description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add a short summary…"
                className="w-full resize-none rounded-lg bg-card text-card-foreground ring-1 ring-border px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <span className="block text-[13px] font-medium mb-1.5">Status</span>
              <div className="flex gap-2" role="radiogroup" aria-label="Status">
                {TASK_STATUSES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={status === option}
                    onClick={() => setStatus(option)}
                    className={
                      status === option
                        ? "flex-1 rounded-lg ring-2 ring-ring bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                        : "flex-1 rounded-lg ring-1 ring-border bg-card px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
                    }
                  >
                    {STATUS_LABELS[option]}
                  </button>
                ))}
              </div>
            </div>
            {error ? (
              <p role="alert" className="text-[13px] text-destructive">
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-surface">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 shadow-sm transition hover:opacity-90 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
