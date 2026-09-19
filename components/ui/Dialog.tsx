"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { containDialogFocus } from "@/lib/dialog-focus";

type DialogProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: ReactNode;
  readonly className?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: DialogProps) {
  const element = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { t } = useTranslation("studio");
  useEffect(() => {
    const dialog = element.current;
    if (!open || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      // Some callers unmount the dialog before its native close event fires.
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <dialog
      ref={element}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={containDialogFocus}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
      className={cn(
        "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-xl border border-border bg-card p-5 text-foreground shadow-soft backdrop:bg-primary/45 sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <h2
          id={titleId}
          className="pt-2 text-xl font-semibold leading-7 text-primary"
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          aria-label={t("closeDialog")}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
