import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({
  label = "Loading",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-3 rounded-xl border border-dashed bg-card/60 px-5 py-12 text-sm text-muted-foreground",
        className,
      )}
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
