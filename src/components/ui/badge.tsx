import { cn } from "@/lib/utils";

type Tone = "primary" | "accent" | "success" | "neutral" | "danger";

const tones: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary border-primary/30",
  accent: "bg-accent/10 text-accent border-accent/30",
  success: "bg-success-soft text-success border-success/30",
  neutral: "bg-surface-2 text-muted border-border-strong",
  danger: "bg-danger-soft text-danger border-danger/30",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
