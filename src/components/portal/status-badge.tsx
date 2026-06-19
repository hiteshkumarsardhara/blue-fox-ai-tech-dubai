import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/30",
  confirmed: "bg-success-soft text-success border-success/30",
  paid: "bg-success-soft text-success border-success/30",
  active: "bg-primary-soft text-primary border-primary/30",
  completed: "bg-surface-2 text-muted border-border-strong",
  rejected: "bg-danger-soft text-danger border-danger/30",
  processing: "bg-primary-soft text-primary border-primary/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        TONES[status] ?? TONES.completed,
      )}
    >
      {status}
    </span>
  );
}
