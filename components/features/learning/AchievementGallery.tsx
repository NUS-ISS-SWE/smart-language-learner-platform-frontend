"use client";

import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAchievements } from "@/lib/hooks/useLearning";

export function AchievementGallery() {
  const achievements = useAchievements();

  return <section aria-labelledby="achievements" className="space-y-3"><div><h2 id="achievements" className="text-xl font-semibold text-primary">Achievements</h2><p className="text-sm text-muted-foreground">Badges are earned through practice and finalized composition feedback.</p></div>
    {achievements.isError && <ErrorState message={getApiErrorMessage(achievements.error)} />}
    {achievements.data && (achievements.data.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{achievements.data.map((achievement) => <Card key={achievement.awardId}><CardHeader className="pb-2"><Award className="h-5 w-5 text-amber-500" /><CardTitle className="mt-2 text-base">{achievement.title}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{achievement.description}</p><p className="mt-3 text-xs text-muted-foreground">Earned {new Date(achievement.awardedAt).toLocaleDateString()}</p></CardContent></Card>)}</div> : <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">Complete a challenge or receive a finalized composition assessment to earn your first badge.</div>)}
  </section>;
}
