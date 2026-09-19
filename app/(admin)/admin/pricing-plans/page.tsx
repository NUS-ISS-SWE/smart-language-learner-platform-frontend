"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PricingPlanDialog } from "@/components/features/admin/PricingPlanDialog";
import { PlanDetails } from "@/components/features/subscription/PlanDetails";
import { listPricingPlans, setPricingPlanStatus } from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { PricingPlan } from "@/types/pricing-plan";

const key = ["admin", "pricing-plans"] as const;
export default function PricingPlansPage() {
  const { t } = useTranslation("visual");
  const client = useQueryClient();
  const query = useQuery({ queryKey: key, queryFn: listPricingPlans });
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const invalidate = () => client.invalidateQueries({ queryKey: key });
  const status = useMutation({
    mutationFn: ({ code, active }: { code: string; active: boolean }) =>
      setPricingPlanStatus(code, active),
    onSuccess: invalidate,
  });
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pricing")}
        description={t("pricingHint")}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t("addPlan")}
          </Button>
        }
      />
      {query.isLoading && <LoadingState />}
      {query.isError && (
        <div className="space-y-3">
          <ErrorState message={getApiErrorMessage(query.error)} />
          <Button variant="outline" onClick={() => void query.refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}
      {status.isError && (
        <ErrorState message={getApiErrorMessage(status.error)} />
      )}
      {query.data?.length === 0 && (
        <p className="rounded-2xl border border-dashed bg-card p-10 text-center text-muted-foreground">
          {t("emptyCatalog")}
        </p>
      )}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
        {query.data?.map((plan) => (
          <article
            key={plan.code}
            className="flex min-w-0 flex-col gap-5 rounded-2xl border bg-card p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="eyebrow break-all text-muted-foreground">
                {plan.code}
              </span>
              <Badge variant={plan.active ? "success" : "outline"}>
                {t(plan.active ? "active" : "retired")}
              </Badge>
            </div>
            <PlanDetails plan={plan} />
            <div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => setEditing(plan)}>
                {t("edit")}
              </Button>
              <Button
                variant="ghost"
                disabled={status.isPending}
                onClick={() =>
                  status.mutate({ code: plan.code, active: !plan.active })
                }
              >
                {t(plan.active ? "retire" : "activate")}
              </Button>
            </div>
          </article>
        ))}
      </div>
      {(createOpen || editing) && (
        <PricingPlanDialog
          plan={editing}
          onClose={() => {
            setCreateOpen(false);
            setEditing(null);
          }}
          onSaved={invalidate}
        />
      )}
    </div>
  );
}
