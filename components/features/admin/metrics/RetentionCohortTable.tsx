import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { RetentionCohortMetric } from "@/types/admin";

export function RetentionCohortTable({ cohorts, to }: { readonly cohorts: RetentionCohortMetric[]; readonly to: string }) {
  const endExclusive = new Date(`${to}T00:00:00Z`);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
  const retentionValue = (cohortStart: string, week: number, value: number | null | undefined) => {
    const weekEnd = new Date(`${cohortStart}T00:00:00Z`);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + (week + 1) * 7);
    return weekEnd <= endExclusive && value != null ? value : "—";
  };
  return <Card><CardHeader><CardTitle className="text-base">Weekly retention cohorts</CardTitle><p className="text-sm text-muted-foreground">Learners who returned for a meaningful activity after registering.</p></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b text-muted-foreground"><tr><th className="pb-2 font-medium">Cohort week</th><th className="pb-2 font-medium">Users</th><th className="pb-2 font-medium">Week 0</th><th className="pb-2 font-medium">Week 1</th><th className="pb-2 font-medium">Week 2</th><th className="pb-2 font-medium">Week 3</th><th className="pb-2 font-medium">Week 4</th></tr></thead><tbody>{cohorts.map((cohort) => <tr key={cohort.cohortStart} className="border-b last:border-0"><td className="py-2">{cohort.cohortStart}</td><td>{cohort.cohortSize}</td><td>{retentionValue(cohort.cohortStart, 0, cohort.week0Retained)}</td><td>{retentionValue(cohort.cohortStart, 1, cohort.week1Retained)}</td><td>{retentionValue(cohort.cohortStart, 2, cohort.week2Retained)}</td><td>{retentionValue(cohort.cohortStart, 3, cohort.week3Retained)}</td><td>{retentionValue(cohort.cohortStart, 4, cohort.week4Retained)}</td></tr>)}</tbody></table>{cohorts.length === 0 && <p className="text-sm text-muted-foreground">No registrations in this period.</p>}</CardContent></Card>;
}
