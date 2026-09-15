export type ProductGuideMessageRole = "user" | "assistant";

export type ProductGuideMessageStatus = "streaming" | "complete" | "error";

export interface ProductGuideMessage {
  readonly id: string;
  readonly role: ProductGuideMessageRole;
  readonly content: string;
  readonly status: ProductGuideMessageStatus;
}
