import type { ModerationReasonCategory } from "@/types/composition";

export const moderationReasonOptions: ReadonlyArray<{
  readonly value: ModerationReasonCategory;
  readonly label: string;
}> = [
  { value: "SPAM_OR_IRRELEVANT", label: "Spam or irrelevant" },
  { value: "ABUSIVE_OR_HARMFUL", label: "Abusive or harmful" },
  { value: "PRIVACY_OR_PERSONAL_DATA", label: "Privacy or personal data" },
  { value: "COPYRIGHT_OR_IP", label: "Copyright or intellectual property" },
  { value: "OTHER", label: "Other" },
];

export function moderationReasonLabel(
  value: ModerationReasonCategory | null | undefined,
) {
  return (
    moderationReasonOptions.find((option) => option.value === value)?.label ??
    "No reason recorded"
  );
}
