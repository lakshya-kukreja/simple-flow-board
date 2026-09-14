import { Moon, Sparkles, Sun } from "lucide-react";
import { THEMES, type Theme } from "@/hooks/useTheme";

const ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  disco: Sparkles,
};

const LABELS: Record<Theme, string> = {
  light: "Light mode",
  dark: "Dark mode",
  disco: "Disco mode",
};

export function ThemeSwitcher({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (theme: Theme) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex items-center gap-0.5 rounded-full bg-card ring-1 ring-border p-0.5"
    >
      {THEMES.map((option) => {
        const Icon = ICONS[option];
        const active = theme === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={LABELS[option]}
            title={LABELS[option]}
            onClick={() => onChange(option)}
            className={
              active
                ? "size-8 grid place-items-center rounded-full bg-primary text-primary-foreground transition"
                : "size-8 grid place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            }
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
