"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { createPricingPlan, listPricingPlans, setPricingPlanStatus, updatePricingPlan } from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatCurrencyMinor } from "@/lib/utils";
import type { PricingPlan, PricingPlanRequest } from "@/types/pricing-plan";

const key = ["admin", "pricing-plans"] as const;
const empty = (): PricingPlanRequest => ({ code: "", displayName: "", description: "", priceMinor: 0, currency: "USD", durationDays: null, features: [], displayOrder: 0 });

export default function PricingPlansPage() {
  const client = useQueryClient(); const query = useQuery({ queryKey: key, queryFn: listPricingPlans });
  const [editing, setEditing] = useState<PricingPlan | null>(null); const [createOpen, setCreateOpen] = useState(false);
  const invalidate = () => client.invalidateQueries({ queryKey: key });
  const status = useMutation({ mutationFn: ({ code, active }: { code: string; active: boolean }) => setPricingPlanStatus(code, active), onSuccess: invalidate });
  if (query.isLoading) return <LoadingState label="Loading pricing plans…" />;
  if (query.isError) return <ErrorState message={getApiErrorMessage(query.error)} />;
  return <div className="space-y-6"><div className="flex items-start justify-between"><div><h1 className="text-3xl font-semibold">Pricing Plans</h1><p className="mt-1 text-sm text-muted-foreground">Manage the plans customers can select.</p></div><Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Add plan</Button></div>
    <Card><CardHeader><CardTitle>Catalog</CardTitle></CardHeader><CardContent className="space-y-3">{query.data?.map((plan) => <div key={plan.code} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{plan.displayName} <span className="text-sm font-normal text-muted-foreground">({plan.code})</span></p><p className="text-sm text-muted-foreground">{formatCurrencyMinor(plan.priceMinor, plan.currency)} · {plan.durationDays ? `${plan.durationDays} days` : "no expiry"} · {plan.features.join(", ")}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setEditing(plan)}>Edit</Button><Button size="sm" variant="outline" disabled={status.isPending} onClick={() => status.mutate({code:plan.code,active:!plan.active})}>{plan.active ? "Retire" : "Activate"}</Button></div></div>)}</CardContent></Card>
    {(createOpen || editing) && <PricingPlanDialog plan={editing} onClose={() => {setCreateOpen(false);setEditing(null);}} onSaved={invalidate} />}
  </div>;
}

function PricingPlanDialog({ plan, onClose, onSaved }: { plan: PricingPlan | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<PricingPlanRequest>(plan ? { code: plan.code, displayName: plan.displayName, description: plan.description ?? "", priceMinor: plan.priceMinor, currency: plan.currency, durationDays: plan.durationDays, features: plan.features, displayOrder: plan.displayOrder ?? 0 } : empty());
  const mutation = useMutation({ mutationFn: () => plan ? updatePricingPlan(plan.code, form) : createPricingPlan(form), onSuccess: () => {onSaved();onClose();} });
  const update = <K extends keyof PricingPlanRequest>(key: K, value: PricingPlanRequest[K]) => setForm((current) => ({ ...current, [key]: value }));
  return <Dialog open onClose={onClose} title={plan ? "Edit pricing plan" : "Add pricing plan"} className="max-w-xl"><form className="space-y-4" onSubmit={(event) => {event.preventDefault(); mutation.mutate();}}>{mutation.error && <ErrorState message={getApiErrorMessage(mutation.error)} />}<div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="code">Code</Label><Input id="code" value={form.code} disabled={!!plan} onChange={(e) => update("code", e.target.value.toUpperCase())} required /></div><div><Label htmlFor="name">Name</Label><Input id="name" value={form.displayName} onChange={(e) => update("displayName", e.target.value)} required /></div></div><div><Label htmlFor="description">Description</Label><Textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} /></div><div className="grid gap-4 sm:grid-cols-3"><div><Label htmlFor="price">Price (cents)</Label><Input id="price" type="number" min="0" value={form.priceMinor} onChange={(e) => update("priceMinor", Number(e.target.value))} required /></div><div><Label htmlFor="currency">Currency</Label><Input id="currency" maxLength={3} value={form.currency} onChange={(e) => update("currency", e.target.value.toUpperCase())} required /></div><div><Label htmlFor="duration">Duration days</Label><Input id="duration" type="number" min="1" value={form.durationDays ?? ""} onChange={(e) => update("durationDays", e.target.value ? Number(e.target.value) : null)} /></div></div><div><Label htmlFor="features">Features (one per line)</Label><Textarea id="features" value={form.features.join("\n")} onChange={(e) => update("features", e.target.value.split("\n").map((v) => v.trim()).filter(Boolean))} /></div><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={mutation.isPending}>Save</Button></div></form></Dialog>;
}
