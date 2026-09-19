export type CompositionSource =
  | "RAW_TEXT"
  | "FILE_PDF"
  | "FILE_DOCX"
  | "SYSTEM";
export type CompositionLanguage = "ENGLISH" | "CHINESE";
export type CompositionStatus =
  | "DRAFT"
  | "GENERATING"
  | "GENERATION_FAILED"
  | "REVIEWING"
  | "REVIEWED";
export type GradingProgressStage =
  | "PREPARING"
  | "GRADING"
  | "REVIEWING"
  | "REGRADING"
  | "SUGGESTING";

export type ImprovementSuggestion = {
  criterion: string | null;
  priority: string | null;
  recommendation: string | null;
  exampleRevision: string | null;
  learningTip: string | null;
  supportingEvidence: {
    excerpt: string | null;
    location: string | null;
  } | null;
};

export type Composition = {
  id: number;
  userId: number;
  title: string;
  content: string | null;
  compositionSource: CompositionSource;
  language: CompositionLanguage;
  compositionStatus: CompositionStatus;
  systemFeedback?: string | null;
  suggestionStatus?: string | null;
  suggestions?: ImprovementSuggestion[] | null;
  gradingProgressMessage?: string | null;
  gradingProgressStage?: string | null;
  storagePath?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CompositionDraft = {
  title: string;
  content: string;
  language: CompositionLanguage;
  compositionSource: CompositionSource;
};

/** Payload accepted when creating or updating a learner-authored composition. */
export type CompositionRequest = Pick<CompositionDraft, "title" | "content">;

/** Payload accepted by the AI generation endpoint. */
export type GenerateCompositionRequest = Pick<CompositionDraft, "title">;
