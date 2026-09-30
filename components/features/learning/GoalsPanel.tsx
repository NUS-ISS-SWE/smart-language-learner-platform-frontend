"use client";
import { useState } from "react";
import { CheckCircle2, Focus, Target, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  useCancelLearningGoal,
  useCreateLearningGoal,
  useFocusLearningGoal,
  useLearningGoals,
} from "@/lib/hooks/useLearning";
import type {
  ChallengeCategory,
  GoalMetric,
  LearningGoal,
} from "@/types/learning";
const metricLabels: Record<GoalMetric, string> = {
  DAILY_CHALLENGE_COMPLETIONS: "Complete daily challenges",
  WEEKLY_CHALLENGE_COMPLETIONS: "Complete weekly challenges",
  CATEGORY_CHALLENGE_COMPLETIONS: "Complete challenges in a category",
  CURRENT_STREAK_DAYS: "Maintain a practice streak",
  REVIEWED_COMPOSITIONS: "Complete reviewed compositions",
  OVERALL_ASSESSMENT_SCORE: "Reach an overall writing score",
  VOCABULARY_RUBRIC_SCORE: "Reach a vocabulary writing score",
};
const categoryLabels: Record<ChallengeCategory, string> = {
  REFLECTION: "Everyday reflection",
  DESCRIPTION: "Vivid description",
  STORYTELLING: "Story builder",
  PRACTICAL: "Helpful communication",
};
function GoalRow({ goal }: { readonly goal: LearningGoal }) {
  const cancel = useCancelLearningGoal();
  const focus = useFocusLearningGoal();
  const ratio = Math.min(100, Math.round((goal.progress / goal.target) * 100));
  const label = `${metricLabels[goal.metric]}${goal.category ? `: ${categoryLabels[goal.category]}` : ""}`;
  return (
    <li
      className={`rounded-lg border p-4 ${goal.focused ? "border-secondary bg-soft-teal/30" : "border-border"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-primary">
            {goal.focused && (
              <span className="mr-2 inline-flex items-center gap-1 text-xs text-secondary">
                <Focus className="h-3.5 w-3.5" />
                Focused
              </span>
            )}
            {label}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {goal.progress} of {goal.target}
            {goal.dueOn ? ` · due ${goal.dueOn}` : ""}
          </p>
        </div>
        {goal.status === "ACTIVE" && (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={goal.focused ? "outline" : "ghost"}
              disabled={goal.focused || focus.isPending}
              onClick={() => focus.mutate(goal.id)}
            >
              {goal.focused ? "Focused" : "Focus"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-label={`Cancel ${label}`}
              disabled={cancel.isPending}
              onClick={() => cancel.mutate(goal.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-secondary" style={{ width: `${ratio}%` }} />
      </div>
    </li>
  );
}
export function GoalsPanel() {
  const goals = useLearningGoals();
  const create = useCreateLearningGoal();
  const [metric, setMetric] = useState<GoalMetric>(
    "DAILY_CHALLENGE_COMPLETIONS",
  );
  const [target, setTarget] = useState("5");
  const [category, setCategory] = useState<ChallengeCategory>("REFLECTION");
  const [dueOn, setDueOn] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const isScoreMetric =
    metric === "OVERALL_ASSESSMENT_SCORE" ||
    metric === "VOCABULARY_RUBRIC_SCORE";
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(null);
    create.mutate(
      {
        metric,
        target: Number(target),
        ...(metric === "CATEGORY_CHALLENGE_COMPLETIONS" ? { category } : {}),
        ...(dueOn ? { dueOn } : {}),
      },
      {
        onSuccess: () => {
          setSuccess(
            "Goal saved. We’ll keep its progress up to date as you practise.",
          );
          setDueOn("");
        },
      },
    );
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-secondary" />
            Set a learning goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="goal-metric">Goal</Label>
              <Select
                id="goal-metric"
                value={metric}
                onChange={(event) => {
                  const next = event.target.value as GoalMetric;
                  setMetric(next);
                  if (
                    (next === "OVERALL_ASSESSMENT_SCORE" ||
                      next === "VOCABULARY_RUBRIC_SCORE") &&
                    Number(target) > 100
                  )
                    setTarget("100");
                }}
              >
                {(Object.keys(metricLabels) as GoalMetric[]).map((key) => (
                  <option key={key} value={key}>
                    {metricLabels[key]}
                  </option>
                ))}
              </Select>
            </div>
            {metric === "CATEGORY_CHALLENGE_COMPLETIONS" && (
              <div className="space-y-2">
                <Label htmlFor="goal-category">Challenge path</Label>
                <Select
                  id="goal-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as ChallengeCategory)
                  }
                >
                  {(Object.keys(categoryLabels) as ChallengeCategory[]).map(
                    (key) => (
                      <option key={key} value={key}>
                        {categoryLabels[key]}
                      </option>
                    ),
                  )}
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="goal-target">Target</Label>
              <Input
                id="goal-target"
                type="number"
                min="1"
                max={isScoreMetric ? "100" : undefined}
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-due">Due date (optional)</Label>
              <Input
                id="goal-due"
                type="date"
                value={dueOn}
                onChange={(event) => setDueOn(event.target.value)}
              />
            </div>
            {success && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {success}
              </div>
            )}
            {create.isError && (
              <ErrorState message={getApiErrorMessage(create.error)} />
            )}
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Saving…" : "Save goal"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <section aria-labelledby="active-goals">
        <h2 id="active-goals" className="text-xl font-semibold text-primary">
          Your goals
        </h2>
        {goals.isLoading && (
          <p className="mt-4 text-sm text-muted-foreground">Loading goals…</p>
        )}
        {goals.isError && (
          <div className="mt-4">
            <ErrorState message={getApiErrorMessage(goals.error)} />
          </div>
        )}
        {goals.data && (
          <ul className="mt-4 space-y-3">
            {goals.data.length ? (
              goals.data.map((goal) => <GoalRow key={goal.id} goal={goal} />)
            ) : (
              <li className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                Set a goal to give your next writing sessions a clear direction.
              </li>
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
