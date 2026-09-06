import { useMemo } from "react";
import type { DailyUsageMetric } from "@/types/admin";

const dateFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" });

export function ActivityChart({ daily }: { readonly daily: DailyUsageMetric[] }) {
  const maxValue = useMemo(() => Math.max(1, ...daily.flatMap((day) => [day.newUsers, day.compositionsCreated, day.successfulReviews, day.documentsUploaded])), [daily]);
  if (daily.length === 0) return <p className="text-sm text-muted-foreground">No activity was recorded for this period.</p>;
  return <div><div className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
    <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-primary" aria-hidden="true" />Compositions</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-emerald-500" aria-hidden="true" />Users</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-violet-500" aria-hidden="true" />Reviews</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-amber-500" aria-hidden="true" />Uploads</span>
  </div><div className="flex h-48 min-w-[520px] items-end gap-1 border-b border-l px-2 pt-3" role="img" aria-label="Daily new users, compositions, successful reviews, and document uploads">
    {daily.map((day) => <div key={day.date} className="group flex h-full min-w-0 flex-1 items-end justify-center gap-px" title={`${day.date}: ${day.compositionsCreated} compositions, ${day.newUsers} users, ${day.successfulReviews} successful reviews, ${day.documentsUploaded} uploads`}><div className="w-1/4 rounded-t-sm bg-primary transition-opacity group-hover:opacity-70" style={{ height: `${(day.compositionsCreated / maxValue) * 100}%` }} /><div className="w-1/4 rounded-t-sm bg-emerald-500 transition-opacity group-hover:opacity-70" style={{ height: `${(day.newUsers / maxValue) * 100}%` }} /><div className="w-1/4 rounded-t-sm bg-violet-500 transition-opacity group-hover:opacity-70" style={{ height: `${(day.successfulReviews / maxValue) * 100}%` }} /><div className="w-1/4 rounded-t-sm bg-amber-500 transition-opacity group-hover:opacity-70" style={{ height: `${(day.documentsUploaded / maxValue) * 100}%` }} /></div>)}
  </div><div className="mt-2 flex min-w-[520px] justify-between text-xs text-muted-foreground"><span>{dateFormatter.format(new Date(`${daily[0].date}T00:00:00Z`))}</span><span>{dateFormatter.format(new Date(`${daily[daily.length - 1].date}T00:00:00Z`))}</span></div></div>;
}
