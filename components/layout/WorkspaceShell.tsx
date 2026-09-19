"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { X } from "lucide-react";
import { Sidebar, WorkspaceBrand, WorkspaceNavigation } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Button } from "@/components/ui/Button";
import { containDialogFocus } from "@/lib/dialog-focus";

const MIN = 224;
const MAX = 420;
const clamp = (width: number) =>
  Number.isFinite(width) ? Math.min(MAX, Math.max(MIN, width)) : 280;

export function WorkspaceShell({
  children,
  admin = false,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  const { t } = useTranslation("studio");
  const [width, setWidth] = useState(280);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const storageKey = admin ? "sllp.adminSidebarWidth" : "sllp.sidebarWidth";
  const start = useRef({ x: 0, width: 280 });
  const [resizing, setResizing] = useState(false);
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) setWidth(clamp(Number(saved)));
      } catch {
        /* Storage can be unavailable in private sessions. */
      }
    }, 0);
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (media.matches) drawer.current?.close();
    };
    media.addEventListener("change", closeOnDesktop);
    return () => {
      clearTimeout(timer);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [storageKey]);
  function persist(next: number) {
    setWidth(next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch {
      /* Resizing still works without persistence. */
    }
  }
  useEffect(() => {
    if (!resizing) return;
    const cursor = document.body.style.cursor;
    const selection = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const move = (event: PointerEvent) => {
      const next = clamp(start.current.width + event.clientX - start.current.x);
      setWidth(next);
      try {
        localStorage.setItem(storageKey, String(next));
      } catch {
        /* Optional persistence. */
      }
    };
    const end = () => setResizing(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("blur", end);
    return () => {
      document.body.style.cursor = cursor;
      document.body.style.userSelect = selection;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      window.removeEventListener("blur", end);
    };
  }, [resizing, storageKey]);
  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="skip-link">
        {t("skip")}
      </a>
      <div className="flex min-h-screen">
        <Sidebar width={width} admin={admin} />
        <button
          type="button"
          role="separator"
          aria-label={t("resizeSidebar")}
          aria-describedby="resize-help"
          aria-controls="workspace-sidebar"
          aria-orientation="vertical"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={Math.round(width)}
          className="sticky top-0 hidden h-dvh w-2 shrink-0 cursor-col-resize touch-none items-center justify-center bg-primary hover:bg-secondary focus-visible:z-30 focus-visible:outline-accent lg:flex"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            start.current = { x: event.clientX, width };
            setResizing(true);
          }}
          onKeyDown={(event) => {
            const next = (
              {
                ArrowLeft: width - 16,
                ArrowRight: width + 16,
                Home: MIN,
                End: MAX,
              } as Record<string, number>
            )[event.key];
            if (next !== undefined) {
              event.preventDefault();
              persist(clamp(next));
            }
          }}
        >
          <span className="h-12 w-px bg-white/40" aria-hidden="true" />
        </button>
        <span id="resize-help" className="sr-only">
          {t("resizeHelp")}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            admin={admin}
            onOpenNavigation={() => {
              drawer.current?.showModal();
              setDrawerOpen(true);
            }}
          />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 scroll-mt-20 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
          >
            <div className="mx-auto w-full max-w-[1280px]">{children}</div>
          </main>
        </div>
      </div>
      <dialog
        ref={drawer}
        id="workspace-drawer"
        aria-label={t("navigation")}
        className="m-0 h-dvh max-h-none w-80 max-w-[90vw] border-0 bg-primary p-0 text-white backdrop:bg-primary/45"
        onClose={() => setDrawerOpen(false)}
        onKeyDown={containDialogFocus}
        onClick={(event) => {
          if (
            event.target === event.currentTarget &&
            event.clientX >= event.currentTarget.getBoundingClientRect().right
          )
            drawer.current?.close();
        }}
      >
        <div className="flex min-h-full flex-col">
          <div className="flex items-center border-b border-white/15">
            <div className="min-w-0 flex-1">
              <WorkspaceBrand admin={admin} />
            </div>
            <Button
              autoFocus
              size="icon"
              variant="ghost"
              className="mr-2 shrink-0 text-white hover:bg-white/10 hover:text-white"
              onClick={() => drawer.current?.close()}
              aria-label={t("closeNavigation")}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <WorkspaceNavigation
            admin={admin}
            onNavigate={() => drawer.current?.close()}
          />
        </div>
      </dialog>
    </div>
  );
}
