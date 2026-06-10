"use client";

import Link from "next/link";
import { PenLine } from "lucide-react";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api/client";
import { useCompositionList } from "@/lib/hooks/useCompositions";
import { RecentCompositions } from "@/components/features/dashboard/RecentCompositions";
import { ScoreSummary } from "@/components/features/dashboard/ScoreSummary";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data = [], isLoading, isError, error } = useCompositionList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Learner dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Welcome, {user?.username ?? "learner"}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review your writing activity, continue recent work, or start a new composition.
          </p>
        </div>
        <Button asChild>
          <Link href="/compositions/new">
            <PenLine className="h-4 w-4" aria-hidden="true" />
            New composition
          </Link>
        </Button>
      </div>

      {isLoading ? <LoadingState label="Loading dashboard" /> : null}
      {isError ? <ErrorState message={getApiErrorMessage(error)} /> : null}

      {!isLoading && !isError ? (
        <>
          <ScoreSummary compositions={data} />
          <RecentCompositions compositions={data} />
        </>
      ) : null}
    </div>
  );
}
