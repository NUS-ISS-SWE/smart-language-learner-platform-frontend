"use client";

import Link from "next/link";
import { ArrowRight, Flame, Target, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { useLearningSummary } from "@/lib/hooks/useLearning";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function LearningMomentum() {
  const { language } = useTranslation();
  const challengeLanguage = language.startsWith("zh") ? "CHINESE" : "ENGLISH";
  const summary = useLearningSummary(challengeLanguage);

  if (summary.isLoading || summary.isError || !summary.data) return null;

  const { currentStreak, completedChallenges, activeGoals, newAwards, dailyChallenge } = summary.data;
  return (
    <section aria-labelledby="learning-momentum" className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="learning-momentum" className="text-xl font-semibold text-primary">Learning momentum</h2>
          <p className="text-sm text-muted-foreground">A compact view of your practice, separate from writing and admin reporting.</p>
        </div>
        <Link href="/goals" className="text-sm font-medium text-secondary hover:underline">View goals</Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-4"><Flame className="h-5 w-5 text-orange-500" /><div><p className="text-2xl font-semibold">{currentStreak}</p><p className="text-xs text-muted-foreground">day streak</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Target className="h-5 w-5 text-secondary" /><div><p className="text-2xl font-semibold">{activeGoals.length}</p><p className="text-xs text-muted-foreground">active goals</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Trophy className="h-5 w-5 text-amber-500" /><div><p className="text-2xl font-semibold">{completedChallenges}</p><p className="text-xs text-muted-foreground">challenges completed</p></div></CardContent></Card>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-secondary/25 bg-soft-teal/30 p-4 text-sm">
        <span>{newAwards.length ? `New achievement: ${newAwards[0].title}` : dailyChallenge.submitted ? "Today’s challenge is complete." : `Next: ${dailyChallenge.title}`}</span>
        <Link href="/challenges" className="inline-flex items-center gap-1 font-medium text-secondary hover:underline">{dailyChallenge.submitted ? "See challenges" : "Start challenge"}<ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}
