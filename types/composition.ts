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
export type ModerationStatus = "ACTIVE" | "REMOVED";
export type ModerationReasonCategory =
  | "SPAM_OR_IRRELEVANT"
  | "ABUSIVE_OR_HARMFUL"
  | "PRIVACY_OR_PERSONAL_DATA"
  | "COPYRIGHT_OR_IP"
  | "OTHER";
export type Moderation = {
  status: ModerationStatus;
  reasonCategory: ModerationReasonCategory | null;
  reasonNote: string | null;
  moderatedAt: string | null;
  ownerRedacted: boolean;
};
export type GradingProgressStage =
  | "PREPARING"
  | "EVIDENCING"
  | "GRADING"
  | "REVIEWING"
  | "REGRADING"
  | "SUGGESTING";
export type SuggestionStatus =
  | "AVAILABLE"
  | "NOT_AVAILABLE_FOR_LANGUAGE"
  | "TEMPORARILY_UNAVAILABLE"
  | "NO_PRIORITY_IMPROVEMENT";

export type SuggestionFeedbackRating = "HELPFUL" | "NOT_HELPFUL";
export type SuggestionFeedbackReason =
  | "NOT_RELEVANT"
  | "UNCLEAR"
  | "TOO_GENERIC"
  | "UNSAFE";

export type SuggestionFeedbackRequest = {
  rating: SuggestionFeedbackRating;
  reason?: SuggestionFeedbackReason | null;
};

export type SuggestionFeedback = SuggestionFeedbackRequest & {
  id: number;
  compositionId: number;
  suggestionIndex: number;
  createdAt: string;
  updatedAt: string;
};

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
  suggestionStatus?: SuggestionStatus | null;
  suggestions?: ImprovementSuggestion[] | null;
  gradingProgressMessage?: string | null;
  gradingProgressStage?: string | null;
  storagePath?: string | null;
  /** Present only when this composition was created from an uploaded document. */
  sourceDocumentId: string | null;
  createdAt: string;
  updatedAt: string;
  moderation?: Moderation | null;
};

export type CompositionDraft = {
  title: string;
  content: string;
  language: CompositionLanguage;
  compositionSource: CompositionSource;
};

/** Payload accepted when creating or updating a learner-authored composition. */
export type CompositionRequest = Pick<CompositionDraft, "title" | "content"> & {
  sourceDocumentId?: string | null;
};

/** Payload accepted by the AI generation endpoint. */
export type GenerateCompositionRequest = Pick<CompositionDraft, "title">;
