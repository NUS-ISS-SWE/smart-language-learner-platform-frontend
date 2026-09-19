"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ErrorState } from "@/components/shared/ErrorState";
import { createPricingPlan, updatePricingPlan } from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatCurrencyMinor } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { PricingPlan, PricingPlanRequest } from "@/types/pricing-plan";

export function PricingPlanDialog({
  plan,
  onClose,
  onSaved,
}: {
  plan: PricingPlan | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation("visual");
  const [form, setForm] = useState<PricingPlanRequest>(
    plan
      ? {
          code: plan.code,
          displayName: plan.displayName,
          description: plan.description ?? "",
          priceMinor: plan.priceMinor,
          currency: plan.currency,
          durationDays: plan.durationDays,
          features: plan.features,
          displayOrder: plan.displayOrder ?? 0,
        }
      : {
          code: "",
          displayName: "",
          description: "",
          priceMinor: 0,
          currency: "USD",
          durationDays: null,
          features: [],
          displayOrder: 0,
        },
  );
  // Keep raw text while typing. Normalize only the submitted payload.
  const [featuresText, setFeaturesText] = useState(form.features.join("\n"));
  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        durationDays: form.priceMinor === 0 ? null : form.durationDays,
        features: featuresText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      };
      return plan
        ? updatePricingPlan(plan.code, payload)
        : createPricingPlan(payload);
    },
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });
  const update = <K extends keyof PricingPlanRequest>(
    key: K,
    value: PricingPlanRequest[K],
  ) => setForm((current) => ({ ...current, [key]: value }));
  const pricePreview =
    /^[A-Z]{3}$/.test(form.currency) && Number.isFinite(form.priceMinor)
      ? formatCurrencyMinor(form.priceMinor, form.currency)
      : "—";
  return (
    <Dialog
      open
      onClose={() => {
        if (!mutation.isPending) onClose();
      }}
      title={t(plan ? "editPlan" : "addPlan")}
      className="max-w-2xl"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!mutation.isPending) mutation.mutate();
        }}
        className="space-y-5"
      >
        {mutation.isError && (
          <ErrorState message={getApiErrorMessage(mutation.error)} />
        )}
        <fieldset disabled={mutation.isPending} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plan-code">{t("code")}</Label>
              <Input
                id="plan-code"
                pattern="[A-Z][A-Z0-9_]{1,49}"
                value={form.code}
                disabled={!!plan}
                onChange={(e) => update("code", e.target.value.toUpperCase())}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-name">{t("name")}</Label>
              <Input
                id="plan-name"
                maxLength={120}
                value={form.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-description">{t("description")}</Label>
            <Textarea
              id="plan-description"
              maxLength={4000}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
          <div className="rounded-xl border bg-background p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plan-price">{t("price")}</Label>
                <Input
                  id="plan-price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.priceMinor}
                  onChange={(e) => update("priceMinor", Number(e.target.value))}
                  required
                  aria-describedby="price-help"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-currency">{t("currency")}</Label>
                <Input
                  id="plan-currency"
                  minLength={3}
                  maxLength={3}
                  pattern="[A-Z]{3}"
                  value={form.currency}
                  onChange={(e) =>
                    update("currency", e.target.value.toUpperCase())
                  }
                  required
                />
              </div>
            </div>
            <p
              id="price-help"
              className="mt-3 text-xs leading-5 text-muted-foreground"
            >
              {t("priceHint")}
            </p>
            <p className="mt-2 text-xl font-semibold text-primary">
              {pricePreview}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plan-duration">{t("durationDays")}</Label>
              <Input
                id="plan-duration"
                type="number"
                min="1"
                step="1"
                required={form.priceMinor > 0}
                disabled={form.priceMinor === 0}
                value={form.priceMinor === 0 ? "" : (form.durationDays ?? "")}
                onChange={(e) =>
                  update(
                    "durationDays",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              />
              <p className="text-xs leading-5 text-muted-foreground">
                {t("commercialDuration")}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-order">{t("displayOrder")}</Label>
              <Input
                id="plan-order"
                type="number"
                min="0"
                step="1"
                value={form.displayOrder}
                onChange={(e) => update("displayOrder", Number(e.target.value))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-features">{t("featureLines")}</Label>
            <Textarea
              id="plan-features"
              rows={5}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
            />
          </div>
        </fieldset>
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={mutation.isPending}
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {t(mutation.isPending ? "saving" : "save")}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
