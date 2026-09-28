"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { CompositionModerationControls } from "@/components/features/admin/CompositionModerationControls";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAdminModeration } from "@/lib/hooks/useAdminModeration";
import { moderationReasonLabel } from "@/lib/moderation";

export default function ModerationPage() {
  const [status, setStatus] = useState<"" | "ACTIVE" | "REMOVED">("");
  const [source, setSource] = useState("");
  const [language, setLanguage] = useState("");
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const query = useAdminModeration({
    ...(status ? { moderationStatus: status } : {}),
    ...(source ? { compositionSource: source } : {}),
    ...(language ? { language } : {}),
    ...(Number(userId) > 0 ? { userId: Number(userId) } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    page,
  });
  const queue = query.data;

  return (
    <div className="space-y-6">
      <PageHeader title="Content moderation" description="Review and manage learner compositions." />
      <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          Status
          <Select value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(0); }} className="w-40">
            <option value="">All content</option>
            <option value="ACTIVE">Active</option>
            <option value="REMOVED">Removed</option>
          </Select>
        </label>
        <label className="space-y-1 text-sm font-medium">Source
          <Select value={source} onChange={(event) => { setSource(event.target.value); setPage(0); }} className="w-40">
            <option value="">All sources</option><option value="RAW_TEXT">Typed</option><option value="FILE_PDF">PDF</option><option value="FILE_DOCX">Word</option><option value="SYSTEM">Generated</option>
          </Select>
        </label>
        <label className="space-y-1 text-sm font-medium">Language
          <Select value={language} onChange={(event) => { setLanguage(event.target.value); setPage(0); }} className="w-32"><option value="">All</option><option value="ENGLISH">English</option><option value="CHINESE">Chinese</option></Select>
        </label>
        <label className="space-y-1 text-sm font-medium">Learner ID
          <Input value={userId} inputMode="numeric" onChange={(event) => { setUserId(event.target.value); setPage(0); }} className="w-28" />
        </label>
        <label className="space-y-1 text-sm font-medium">From
          <Input type="date" value={from} onChange={(event) => { setFrom(event.target.value); setPage(0); }} />
        </label>
        <label className="space-y-1 text-sm font-medium">To
          <Input type="date" value={to} onChange={(event) => { setTo(event.target.value); setPage(0); }} />
        </label>
        {queue && <span className="text-sm text-muted-foreground">{queue.total} composition{queue.total === 1 ? "" : "s"}</span>}
      </div>
      {query.isLoading && <LoadingState label="Loading moderation queue" />}
      {query.isError && (
        <div className="space-y-3">
          <ErrorState message={getApiErrorMessage(query.error)} />
          <Button variant="outline" onClick={() => void query.refetch()}>Try again</Button>
        </div>
      )}
      {queue?.items.length === 0 && <p className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">No compositions match this filter.</p>}
      <div className="space-y-3">
        {queue?.items.map((item) => (
          <article key={item.compositionId} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5">
            <Link href={`/compositions/${item.compositionId}?context=admin&returnTo=/admin/moderation`} className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words font-semibold hover:text-secondary">{item.title || "Untitled composition"}</h2>
                <Badge variant={item.moderationStatus === "REMOVED" ? "destructive" : "success"}>{item.moderationStatus === "REMOVED" ? "Removed" : "Active"}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.username} · {item.language} · {item.compositionSource} · {new Date(item.createdAt).toLocaleDateString()}</p>
              {item.moderationStatus === "REMOVED" && <p className="mt-2 text-sm text-muted-foreground">{moderationReasonLabel(item.reasonCategory)}{item.reasonNote ? ` — ${item.reasonNote}` : ""}</p>}
            </Link>
            <CompositionModerationControls compositionId={item.compositionId} status={item.moderationStatus} />
          </article>
        ))}
      </div>
      {queue && queue.total > 0 && (
        <div className="flex justify-between">
          <Button variant="outline" disabled={page === 0 || query.isFetching} onClick={() => setPage((value) => value - 1)}>Previous</Button>
          <Button variant="outline" disabled={!queue.hasMore || query.isFetching} onClick={() => setPage((value) => value + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
