"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
  useChallengeTemplates,
  useDeleteChallengeTemplate,
  useSaveChallengeTemplate,
} from "@/lib/hooks/useLearning";
import type {
  ChallengeTemplate,
  ChallengeTemplateInput,
} from "@/types/learning";

const emptyTemplate: ChallengeTemplateInput = {
  code: "",
  cadence: "DAILY",
  language: "ENGLISH",
  category: "REFLECTION",
  themePath: "EVERYDAY_CONFIDENCE",
  title: "",
  prompt: "",
  minResponseUnits: 35,
  maxResponseUnits: 80,
  active: true,
  displayOrder: 0,
};

export default function AdminChallengesPage() {
  const templates = useChallengeTemplates();
  const save = useSaveChallengeTemplate();
  const remove = useDeleteChallengeTemplate();
  const [editing, setEditing] = useState<ChallengeTemplate | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = editing ?? emptyTemplate;
  function openEditor(template?: ChallengeTemplate) {
    setError(null);
    setEditing(template ?? null);
    setOpen(true);
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload: ChallengeTemplateInput = {
      code: String(data.get("code")),
      cadence: data.get("cadence") as ChallengeTemplateInput["cadence"],
      language: data.get("language") as ChallengeTemplateInput["language"],
      category: data.get("category") as ChallengeTemplateInput["category"],
      themePath: String(data.get("themePath")),
      title: String(data.get("title")),
      prompt: String(data.get("prompt")),
      minResponseUnits: Number(data.get("minResponseUnits")),
      maxResponseUnits: Number(data.get("maxResponseUnits")),
      active: data.get("active") === "on",
      displayOrder: Number(data.get("displayOrder")),
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
        title="Challenge templates"
        description="Curate daily and weekly prompts, their skill category, and their themed path. Changes only affect future cycles."
        actions={
          <Button onClick={() => openEditor()}>
            <Plus className="h-4 w-4" />
            Add template
          </Button>
        }
      />
      {templates.isLoading && (
        <LoadingState label="Loading challenge templates…" />
      )}
      {templates.isError && (
        <ErrorState message={getApiErrorMessage(templates.error)} />
      )}
      {templates.data && (
        <div className="grid gap-3">
          {templates.data.map((template) => (
            <Card key={template.id}>
              <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-primary">{template.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {template.code} · {template.cadence.toLowerCase()} ·{" "}
                    {template.language.toLowerCase()} ·{" "}
                    {template.themePath.toLowerCase().replaceAll("_", " ")} ·{" "}
                    {template.active ? "active" : "inactive"}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm">{template.prompt}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditor(template)}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove ${template.title}`}
                    disabled={remove.isPending}
                    onClick={() => remove.mutate(template.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit challenge template" : "Add challenge template"}
      >
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="code" label="Code" defaultValue={form.code} required />
            <SelectField
              name="cadence"
              label="Cadence"
              defaultValue={form.cadence}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
            </SelectField>
            <SelectField
              name="language"
              label="Language"
              defaultValue={form.language}
            >
              <option value="ENGLISH">English</option>
              <option value="CHINESE">Chinese</option>
            </SelectField>
            <SelectField
              name="category"
              label="Path category"
              defaultValue={form.category}
            >
              <option value="REFLECTION">Everyday reflection</option>
              <option value="DESCRIPTION">Vivid description</option>
              <option value="STORYTELLING">Story builder</option>
              <option value="PRACTICAL">Helpful communication</option>
            </SelectField>
            <Field
              name="themePath"
              label="Path key"
              defaultValue={form.themePath}
              required
            />
            <Field
              name="displayOrder"
              label="Display order"
              type="number"
              min="0"
              defaultValue={form.displayOrder}
              required
            />
          </div>
          <Field
            name="title"
            label="Title"
            defaultValue={form.title}
            required
          />
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              name="prompt"
              defaultValue={form.prompt}
              required
              rows={5}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              name="minResponseUnits"
              label="Minimum words / characters"
              type="number"
              min="1"
              defaultValue={form.minResponseUnits}
              required
            />
            <Field
              name="maxResponseUnits"
              label="Maximum words / characters"
              type="number"
              min="1"
              defaultValue={form.maxResponseUnits}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="active" type="checkbox" defaultChecked={form.active} />
            Active
          </label>
          {error && <ErrorState message={error} />}
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save template"}
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
function SelectField({
  name,
  label,
  defaultValue,
  children,
}: {
  readonly name: string;
  readonly label: string;
  readonly defaultValue: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Select id={name} name={name} defaultValue={defaultValue}>
        {children}
      </Select>
    </div>
  );
}
