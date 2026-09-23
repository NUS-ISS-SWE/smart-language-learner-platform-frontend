"use client";

import { Fragment, useState, type FormEvent } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAuditEvents } from "@/lib/hooks/useAuditEvents";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { AuditEventsParams } from "@/lib/api/audit-events";
import type { AuditEvent } from "@/types/admin";

const PAGE_SIZE = 25;
type AuditFilterDraft = Pick<
  AuditEventsParams,
  "actorId" | "action" | "targetId"
>;

const emptyDraft: AuditFilterDraft = {
  actorId: "",
  action: "",
  targetId: "",
};

function auditFilters(draft: AuditFilterDraft): AuditEventsParams {
  const value = (field: keyof AuditFilterDraft) => draft[field]?.trim();
  return {
    page: 0,
    size: PAGE_SIZE,
    actorId: value("actorId") || undefined,
    action: value("action") || undefined,
    targetId: value("targetId") || undefined,
  };
}

function outcomeVariant(outcome: AuditEvent["outcome"]): BadgeProps["variant"] {
  return outcome === "SUCCESS"
    ? "success"
    : outcome === "DENIED"
      ? "warning"
      : "destructive";
}

function formatTimestamp(value: string, language: string): string {
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime())
    ? value
    : timestamp.toLocaleString(language);
}

function formatEventData(event: AuditEvent): string {
  return JSON.stringify(event, null, 2);
}

export default function AuditLogsPage() {
  const { t, language } = useTranslation("audit");
  const [filters, setFilters] = useState<AuditEventsParams>({
    page: 0,
    size: PAGE_SIZE,
  });
  const [draft, setDraft] = useState<AuditFilterDraft>(emptyDraft);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const query = useAuditEvents(filters);
  const hasFilters = Boolean(
    filters.actorId || filters.action || filters.targetId,
  );

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilters(auditFilters(draft));
  }

  function clearFilters() {
    setDraft(emptyDraft);
    setFilters({ page: 0, size: PAGE_SIZE });
  }

  function setPage(page: number) {
    setFilters((current) => ({ ...current, page }));
  }

  function toggleDetails(id: string) {
    setExpandedEventId((current) => (current === id ? null : id));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("intro")}
        actions={
          <Button
            variant="outline"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {t("refresh")}
          </Button>
        }
      />

      <form
        className="rounded-2xl border bg-card p-5"
        onSubmit={applyFilters}
      >
        <fieldset className="grid gap-4 md:grid-cols-[repeat(3,minmax(0,1fr))_auto] md:items-end">
          <legend className="mb-4 text-base font-semibold text-primary">
            {t("filters")}
          </legend>
          <div className="space-y-2">
            <Label htmlFor="audit-actor-id">{t("actorId")}</Label>
            <Input
              id="audit-actor-id"
              value={draft.actorId ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  actorId: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audit-action">{t("action")}</Label>
            <Input
              id="audit-action"
              value={draft.action ?? ""}
              aria-describedby="audit-action-hint"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  action: event.target.value,
                }))
              }
            />
            <p
              id="audit-action-hint"
              className="text-xs text-muted-foreground"
            >
              {t("actionHint")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="audit-target-id">{t("targetId")}</Label>
            <Input
              id="audit-target-id"
              value={draft.targetId ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  targetId: event.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">{t("apply")}</Button>
            {hasFilters && (
              <Button type="button" variant="ghost" onClick={clearFilters}>
                {t("clear")}
              </Button>
            )}
          </div>
        </fieldset>
      </form>

      {query.isLoading && <LoadingState label={t("loading")} />}
      {query.isError && (
        <div className="space-y-3">
          <ErrorState message={getApiErrorMessage(query.error)} />
          <Button variant="outline" onClick={() => void query.refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}

      {query.data && (
        <section className="space-y-4" aria-live="polite">
          <p className="text-sm text-muted-foreground">
            {t("recordCount", { count: query.data.totalElements })}
          </p>
          <div
            role="region"
            aria-label={t("title")}
            tabIndex={0}
            className="overflow-x-auto rounded-2xl border bg-card"
          >
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b bg-muted/40 text-muted-foreground">
                <tr>
                  {["when", "action", "outcome", "actor", "target", "service"].map(
                    (key) => (
                      <th scope="col" key={key} className="px-5 py-4 font-medium">
                        {t(key)}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {query.data.content.map((event) => {
                  const expanded = expandedEventId === event.id;
                  return (
                  <Fragment key={event.id}>
                  <tr
                    className="cursor-pointer transition-colors hover:bg-muted/40"
                    onClick={() => toggleDetails(event.id)}
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {formatTimestamp(event.occurredAt, language)}
                    </td>
                    <th scope="row" className="px-5 py-4 font-medium text-primary">
                      <button
                        type="button"
                        className="flex items-center gap-2 text-left"
                        aria-expanded={expanded}
                        aria-label={t(expanded ? "hideDetails" : "showDetails", {
                          action: event.action,
                        })}
                        onClick={(click) => {
                          click.stopPropagation();
                          toggleDetails(event.id);
                        }}
                      >
                        {event.action}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                    </th>
                    <td className="px-5 py-4">
                      <Badge variant={outcomeVariant(event.outcome)}>
                        {event.outcome}
                      </Badge>
                    </td>
                    <td className="max-w-64 break-words px-5 py-4">
                      {event.actorName ?? event.actorId ?? t("system")}
                    </td>
                    <td className="max-w-64 break-words px-5 py-4">
                      {event.targetType ?? "—"}
                      {event.targetId ? ` · ${event.targetId}` : ""}
                    </td>
                    <td className="px-5 py-4">{event.service}</td>
                  </tr>
                  {expanded && (
                    <tr className="bg-muted/20">
                      <td colSpan={6} className="px-5 py-4">
                        <p className="mb-2 text-sm font-medium text-primary">
                          {t("eventData")}
                        </p>
                        <pre className="max-h-96 overflow-auto rounded-lg bg-background p-4 text-xs leading-5 text-foreground">
                          {formatEventData(event)}
                        </pre>
                      </td>
                    </tr>
                  )}
                  </Fragment>
                  );
                })}
              </tbody>
            </table>
            {query.data.content.length === 0 && (
              <p className="p-10 text-center text-sm text-muted-foreground">
                {t("noResults")}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-muted-foreground">
              {t("page", {
                page: query.data.number + 1,
                total: Math.max(1, query.data.totalPages),
              })}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={query.data.number === 0 || query.isFetching}
                onClick={() => setPage(query.data.number - 1)}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                {t("previous")}
              </Button>
              <Button
                variant="outline"
                disabled={
                  query.data.number + 1 >= query.data.totalPages ||
                  query.isFetching
                }
                onClick={() => setPage(query.data.number + 1)}
              >
                {t("next")}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
