"use client";

import { useState } from "react";
import { Pencil, Plus, Power } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  useAchievementDefinitions,
  useDeactivateAchievementDefinition,
  useSaveAchievementDefinition,
} from "@/lib/hooks/useLearning";
import type {
  AchievementDefinition,
  AchievementDefinitionInput,
} from "@/types/learning";

const categories = [
  "CHALLENGE_COMPLETIONS",
  "STREAK_DAYS",
  "WEEKLY_CHALLENGES",
  "REVIEWED_COMPOSITIONS",
  "OVERALL_SCORE",
  "VOCABULARY_SCORE",
  "PERSONAL_BEST_SCORE",
] as const;
const emptyDefinition: AchievementDefinitionInput = {
  code: "",
  title: "",
  description: "",
  category: "CHALLENGE_COMPLETIONS",
  threshold: 1,
  active: true,
};
const label = (value: string) => value.toLowerCase().replaceAll("_", " ");

export default function AdminAchievementsPage() {
  const definitions = useAchievementDefinitions();
  const save = useSaveAchievementDefinition();
  const deactivate = useDeactivateAchievementDefinition();
  const [editing, setEditing] = useState<AchievementDefinition | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = editing ?? emptyDefinition;
  function edit(definition?: AchievementDefinition) {
    setEditing(definition ?? null);
    setError(null);
    setOpen(true);
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload: AchievementDefinitionInput = {
      code: String(data.get("code")).trim().toUpperCase(),
      title: String(data.get("title")),
      description: String(data.get("description")),
      category: data.get("category") as AchievementDefinitionInput["category"],
      threshold: Number(data.get("threshold")),
      active: data.get("active") === "on",
    };
    save.mutate(
      { id: editing?.id, payload },
      {
        onSuccess: () => setOpen(false),
        onError: (reason) => setError(getApiErrorMessage(reason)),
      },
    );
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title="Badge definitions"
        description="Manage future badge rules. Existing awards stay in learners’ histories even when a definition is deactivated."
        actions={
          <Button onClick={() => edit()}>
            <Plus className="h-4 w-4" />
            Add badge
          </Button>
        }
      />
      {definitions.isLoading && (
        <LoadingState label="Loading badge definitions…" />
      )}
      {definitions.isError && (
        <ErrorState message={getApiErrorMessage(definitions.error)} />
      )}
      {definitions.data && (
        <div className="grid gap-3">
          {definitions.data.map((definition) => (
            <Card key={definition.id}>
              <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-primary">
                    {definition.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {definition.code} · {label(definition.category)} · threshold{" "}
                    {definition.threshold} ·{" "}
                    {definition.active ? "active" : "inactive"}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm">
                    {definition.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => edit(definition)}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  {definition.active && (
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Deactivate ${definition.title}`}
                      disabled={deactivate.isPending}
                      onClick={() => deactivate.mutate(definition.id)}
                    >
                      <Power className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit badge definition" : "Add badge definition"}
      >
        <form className="space-y-4" onSubmit={submit}>
          <Field
            name="code"
            label="Code"
            defaultValue={form.code}
            disabled={Boolean(editing)}
            required
          />
          <Field
            name="title"
            label="Title"
            defaultValue={form.title}
            required
          />
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={form.description}
              rows={3}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="category">Rule</Label>
              <Select
                id="category"
                name="category"
                defaultValue={form.category}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {label(category)}
                  </option>
                ))}
              </Select>
            </div>
            <Field
              name="threshold"
              label="Threshold"
              type="number"
              min="1"
              defaultValue={form.threshold}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="active" type="checkbox" defaultChecked={form.active} />
            Active
          </label>
          {error && <ErrorState message={error} />}
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save badge"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
function Field(props: React.ComponentProps<typeof Input> & { label: string }) {
  const { label, name, ...input } = props;
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...input} />
    </div>
  );
}
