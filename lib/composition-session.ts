import { isAxiosError } from "axios";
import type {
  Composition,
  CompositionDraft,
  CompositionRequest,
} from "@/types/composition";

export function hasCompositionText(content: string): boolean {
  return (
    content
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;|&#160;|&#xa0;/gi, " ")
      .replace(/[\u200b-\u200d\ufeff]/g, "")
      .trim().length > 0
  );
}

const request = (draft: CompositionDraft): CompositionRequest => ({
  title: draft.title,
  content: draft.content,
});
const equal = (a: CompositionRequest, b: CompositionRequest) =>
  a.title === b.title && a.content === b.content;
const uncertain = (error: unknown) =>
  !isAxiosError(error) ||
  !error.response ||
  error.response.status >= 500 ||
  error.response.status === 408;

export class DraftValidationError extends Error {
  constructor(
    public readonly key:
      | "titleRequired"
      | "contentRequired"
      | "uncertainSave"
      | "workInProgress"
      | "editBeforeReview",
  ) {
    super(key);
  }
}

type SessionApi = {
  create: (draft: CompositionRequest) => Promise<Composition>;
  update: (id: number, draft: CompositionRequest) => Promise<Composition>;
  review: (id: number) => Promise<Composition>;
  generate: (draft: { title: string }) => Promise<Composition>;
};
export type CompositionSessionState = {
  draft: CompositionDraft;
  record: Composition | null;
  dirty: boolean;
  phase: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
  error: unknown;
  errorOperation: "save" | "review" | "generate" | null;
  uncertainOperation: "create" | "review" | "generate" | null;
  action: "review" | "generate" | null;
  locked: boolean;
};
export type AutosaveStatus = CompositionSessionState["phase"];

/**
 * One editor owns one session. Server acknowledgements update the persisted
 * snapshot, never the user's newer input. Only this object writes the draft.
 */
export class CompositionSession {
  private state: CompositionSessionState;
  private persisted: CompositionRequest;
  private listeners = new Set<() => void>();
  private writing: Promise<Composition> | null = null;
  private transitioning: Promise<Composition> | null = null;
  private active = true;

  constructor(
    initial: Composition | null,
    private api: SessionApi,
    private onPersist: (record: Composition) => void = () => {},
  ) {
    const draft: CompositionDraft = initial
      ? {
          title: initial.title,
          content: initial.content ?? "",
          language: initial.language,
          compositionSource: initial.compositionSource,
        }
      : {
          title: "",
          content: "",
          language: "ENGLISH",
          compositionSource: "RAW_TEXT",
        };
    this.persisted = request(draft);
    this.state = {
      draft,
      record: initial,
      dirty: false,
      phase: initial ? "saved" : "idle",
      lastSavedAt: null,
      error: null,
      errorOperation: null,
      uncertainOperation: null,
      action: null,
      locked: false,
    };
  }

  getSnapshot = () => this.state;
  setActive(active: boolean) {
    this.active = active;
  }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private emit(patch: Partial<CompositionSessionState>) {
    this.state = { ...this.state, ...patch };
    this.state.dirty = !equal(request(this.state.draft), this.persisted);
    this.listeners.forEach((listener) => listener());
  }
  update<Key extends keyof CompositionDraft>(
    key: Key,
    value: CompositionDraft[Key],
  ) {
    if (this.state.locked) return;
    this.emit({
      draft: { ...this.state.draft, [key]: value },
      phase: this.state.phase === "saved" ? "idle" : this.state.phase,
    });
  }
  private validate() {
    if (!this.state.draft.title.trim())
      throw new DraftValidationError("titleRequired");
    if (!hasCompositionText(this.state.draft.content))
      throw new DraftValidationError("contentRequired");
  }

  /** Autosave writes one snapshot. Manual save drains newer edits as well. */
  async save(drain = true): Promise<Composition> {
    if (this.state.uncertainOperation === "create")
      throw new DraftValidationError("uncertainSave");
    if (this.writing) {
      const saved = await this.writing;
      return drain && this.active ? this.save(true) : saved;
    }
    if (!this.state.dirty && this.state.record) return this.state.record;
    try {
      this.validate();
    } catch (error) {
      this.emit({ error, errorOperation: "save", phase: "error" });
      throw error;
    }
    if (
      this.state.record &&
      ["REVIEWING", "GENERATING"].includes(this.state.record.compositionStatus)
    ) {
      const error = new DraftValidationError("workInProgress");
      this.emit({ error, phase: "error" });
      throw error;
    }
    const snapshot = request(this.state.draft);
    const id = this.state.record?.id;
    this.emit({ phase: "saving", error: null, errorOperation: null });
    // Start in a microtask so the shared promise exists before the API runs.
    this.writing = Promise.resolve()
      .then(() =>
        id ? this.api.update(id, snapshot) : this.api.create(snapshot),
      )
      .then((record) => {
        this.persisted = snapshot;
        this.emit({
          record,
          phase: equal(request(this.state.draft), snapshot) ? "saved" : "idle",
          lastSavedAt: new Date(),
          error: null,
        });
        this.onPersist(record);
        return record;
      })
      .catch((error) => {
        this.emit({
          phase: "error",
          error,
          errorOperation: "save",
          uncertainOperation:
            !id && uncertain(error) ? "create" : this.state.uncertainOperation,
        });
        throw error;
      })
      .finally(() => {
        this.writing = null;
      });
    const saved = await this.writing;
    return drain && this.active ? this.save(true) : saved;
  }

  /** Requires the user to explicitly check the library before another POST. */
  acknowledgeUncertainCreation() {
    if (this.state.uncertainOperation === "review") return;
    this.emit({
      uncertainOperation: null,
      error: null,
      errorOperation: null,
      phase: "idle",
    });
  }

  transition(action: "review" | "generate"): Promise<Composition> {
    if (this.transitioning) return this.transitioning;
    if (this.state.uncertainOperation)
      return Promise.reject(new DraftValidationError("uncertainSave"));
    this.emit({ locked: true, action, error: null, errorOperation: null });
    let actionStarted = false;
    this.transitioning = Promise.resolve()
      .then(async () => {
        if (!this.state.draft.title.trim())
          throw new DraftValidationError("titleRequired");
        // A brand-new title-only prompt has no composition content to save.
        // Existing/meaningful draft content must be safely saved before generation.
        const titleOnlyGeneration =
          action === "generate" &&
          !this.state.record &&
          !hasCompositionText(this.state.draft.content);
        const saved = titleOnlyGeneration ? null : await this.save(true);
        if (!this.active) throw new Error("Editor closed before submission");
        if (action === "review" && saved?.compositionStatus !== "DRAFT")
          throw new DraftValidationError("editBeforeReview");
        actionStarted = true;
        const record =
          action === "review"
            ? await this.api.review(saved!.id)
            : await this.api.generate({ title: this.state.draft.title });
        if (action === "review") this.emit({ record, action: null });
        else this.emit({ action: null });
        this.onPersist(record);
        return record;
      })
      .catch((error) => {
        const ambiguous = actionStarted && uncertain(error);
        this.emit({
          error,
          errorOperation: actionStarted
            ? action
            : (this.state.errorOperation ?? action),
          action: null,
          locked: ambiguous && action === "review",
          uncertainOperation: ambiguous
            ? action
            : this.state.uncertainOperation,
        });
        throw error;
      })
      .finally(() => {
        this.transitioning = null;
      });
    return this.transitioning;
  }
}
