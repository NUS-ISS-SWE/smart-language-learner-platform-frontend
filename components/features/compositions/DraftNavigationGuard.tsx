"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/shared/ErrorState";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  DraftValidationError,
  type CompositionSession,
} from "@/lib/composition-session";
import { getApiErrorMessage } from "@/lib/api/client";

export function DraftNavigationGuard({
  dirty,
  session,
}: {
  dirty: boolean;
  session: CompositionSession;
}) {
  const { t } = useTranslation("editor");
  const [destination, setDestination] = useState<HTMLElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const allowed = useRef(false);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!allowed.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const click = (event: MouseEvent) => {
      if (
        allowed.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "a[href], [data-leaves-editor]",
      );
      if (!target) return;
      if (target instanceof HTMLAnchorElement) {
        if (target.target === "_blank" || target.hasAttribute("download"))
          return;
        const url = new URL(target.href, location.href);
        if (
          url.pathname === location.pathname &&
          url.search === location.search
        )
          return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      setError(null);
      setDestination(target);
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", click, true);
    };
  }, [dirty]);
  function leave() {
    allowed.current = true;
    // Replay the actual control so shell/drawer and Next Link handlers still run.
    destination?.click();
    setDestination(null);
  }
  async function saveAndLeave() {
    setSaving(true);
    setError(null);
    try {
      await session.save();
      leave();
    } catch (failure) {
      setError(failure);
    } finally {
      setSaving(false);
    }
  }
  return (
    <Dialog
      open={!!destination}
      onClose={() => {
        if (!saving) setDestination(null);
      }}
      title={t("leaveTitle")}
    >
      <p className="text-base leading-6 text-muted-foreground">
        {t("leaveDescription")}
      </p>
      {!!error && (
        <ErrorState
          className="mt-4"
          message={
            error instanceof DraftValidationError
              ? t(error.key)
              : getApiErrorMessage(error)
          }
        />
      )}
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" disabled={saving} onClick={leave}>
          {t("discard")}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => setDestination(null)}
        >
          {t("stay")}
        </Button>
        <Button type="button" disabled={saving} onClick={saveAndLeave}>
          {t(saving ? "saving" : "saveAndLeave")}
        </Button>
      </div>
    </Dialog>
  );
}
