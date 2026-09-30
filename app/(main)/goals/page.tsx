"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { GoalsPanel } from "@/components/features/learning/GoalsPanel";
import { AchievementGallery } from "@/components/features/learning/AchievementGallery";

export default function GoalsPage() {
  return <div className="mx-auto max-w-5xl space-y-6"><PageHeader title="Learning goals" description="Choose a writing habit or score target, then follow your progress over time." /><GoalsPanel /><AchievementGallery /></div>;
}
