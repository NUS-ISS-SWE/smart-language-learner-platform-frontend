"use client";
import { useState } from "react";
import {
  CalendarDays,
  CalendarRange,
  Compass,
  Feather,
  MessageCircle,
  Palette,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ChallengeCard } from "@/components/features/learning/ChallengeCard";
import { getApiErrorMessage } from "@/lib/api/client";
import { useCurrentChallenge } from "@/lib/hooks/useLearning";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Challenge, ChallengeCadence } from "@/types/learning";
const paths = [
  {
    key: "EVERYDAY_CONFIDENCE",
    title: "Everyday Confidence",
    description: "Reflect and explain ideas clearly.",
    icon: Compass,
    color: "border-sky-300 bg-sky-50 text-sky-800",
  },
  {
    key: "VIVID_DESCRIPTION",
    title: "Vivid Description",
    description: "Build detail with precise observation.",
    icon: Palette,
    color: "border-amber-300 bg-amber-50 text-amber-800",
  },
  {
    key: "STORY_BUILDER",
    title: "Story Builder",
    description: "Practise change, structure, and narration.",
    icon: Feather,
    color: "border-violet-300 bg-violet-50 text-violet-800",
  },
  {
    key: "HELPFUL_COMMUNICATION",
    title: "Helpful Communication",
    description: "Write useful, warm messages for real situations.",
    icon: MessageCircle,
    color: "border-rose-300 bg-rose-50 text-rose-800",
  },
] as const;
export default function ChallengesPage() {
  const { language } = useTranslation();
  const challengeLanguage = language.startsWith("zh") ? "CHINESE" : "ENGLISH";
  const [path, setPath] = useState<(typeof paths)[number]["key"]>(
    "EVERYDAY_CONFIDENCE",
  );
  const [selected, setSelected] = useState<ChallengeCadence>("DAILY");
  const daily = useCurrentChallenge("DAILY", challengeLanguage, path);
  const weekly = useCurrentChallenge("WEEKLY", challengeLanguage, path);
  const challenge = selected === "DAILY" ? daily.data : weekly.data;
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Writing challenges"
        description="Choose a practice path, then choose one daily or weekly challenge from it."
      />
      <section aria-labelledby="path-picker">
        <h2 id="path-picker" className="text-lg font-semibold text-primary">
          Choose your practice path
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setPath(item.key)}
              aria-pressed={path === item.key}
              className={`rounded-xl border p-4 text-left transition ${item.color} ${path === item.key ? "ring-2 ring-secondary ring-offset-2" : "opacity-80 hover:opacity-100"}`}
            >
              <item.icon className="h-5 w-5" />
              <p className="mt-2 font-semibold">{item.title}</p>
              <p className="mt-1 text-sm leading-5">{item.description}</p>
            </button>
          ))}
        </div>
      </section>
      {(daily.isLoading || weekly.isLoading) && (
        <LoadingState label="Loading challenges…" />
      )}
      {daily.isError && (
        <ErrorState message={getApiErrorMessage(daily.error)} />
      )}
      {weekly.isError && (
        <ErrorState message={getApiErrorMessage(weekly.error)} />
      )}
      {daily.data && weekly.data && (
        <section aria-labelledby="challenge-picker">
          <h2
            id="challenge-picker"
            className="text-lg font-semibold text-primary"
          >
            Choose one challenge to work on
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ChallengeChoice
              challenge={daily.data}
              selected={selected === "DAILY"}
              onSelect={() => setSelected("DAILY")}
              icon={CalendarDays}
            />
            <ChallengeChoice
              challenge={weekly.data}
              selected={selected === "WEEKLY"}
              onSelect={() => setSelected("WEEKLY")}
              icon={CalendarRange}
            />
          </div>
        </section>
      )}
      {challenge && (
        <ChallengeCard
          key={`${challenge.id}-${challenge.cycleKey}`}
          challenge={challenge}
        />
      )}
    </div>
  );
}
function ChallengeChoice({
  challenge,
  selected,
  onSelect,
  icon: Icon,
}: {
  readonly challenge: Challenge;
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly icon: typeof CalendarDays;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-xl border p-4 text-left transition-colors ${selected ? "border-secondary bg-soft-teal/40 ring-1 ring-secondary" : "bg-card hover:border-secondary"}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <div>
          <p className="font-semibold text-primary">
            {challenge.cadence === "DAILY" ? "Daily" : "Weekly"} ·{" "}
            {challenge.title}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {challenge.submitted
              ? "Completed — view your entry"
              : `${challenge.minResponseUnits}–${challenge.maxResponseUnits} ${challenge.language === "CHINESE" ? "characters" : "words"}`}
          </p>
        </div>
      </div>
    </button>
  );
}
