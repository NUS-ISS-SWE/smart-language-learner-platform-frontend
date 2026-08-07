"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import type { AutosaveStatus } from "@/lib/hooks/useAutosave";

type AutosaveIndicatorProps = {
  readonly status: AutosaveStatus;
  readonly lastSavedAt?: Date;
};

export function AutosaveIndicator({ status, lastSavedAt }: AutosaveIndicatorProps) {
  if (status === "idle") return null;

  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
        Saving…
      </span>
    );
  }

  if (status === "saved" && lastSavedAt) {
    const time = lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return (
      <span className="text-xs text-muted-foreground" role="status" aria-live="polite">
        Saved at {time}
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-destructive" role="alert">
        <TriangleAlert className="h-3 w-3" aria-hidden="true" />
        Autosave failed
      </span>
    );
  }

  return null;
}
