import { API_BASE_URL } from "@/lib/constants";
import {
  clearStoredAccessToken,
  getStoredAccessToken,
} from "@/lib/auth-storage";

const PRODUCT_GUIDE_CHAT_PATH = "/api/v1/product-guide/chat";

export interface StreamProductGuideOptions {
  readonly signal: AbortSignal;
  readonly onContent: (content: string) => void;
}

export type ProductGuideApiErrorCode =
  | "authenticationRequired"
  | "forbidden"
  | "serviceUnavailable"
  | "requestFailed"
  | "emptyResponse";

export class ProductGuideApiError extends Error {
  constructor(readonly code: ProductGuideApiErrorCode) {
    super(code);
    this.name = "ProductGuideApiError";
  }
}

function redirectToLogin(): void {
  clearStoredAccessToken();
  window.localStorage.removeItem("sllp.user");
  window.location.href = "/login";
}

function getResponseErrorCode(status: number): ProductGuideApiErrorCode {
  if (status === 401) return "authenticationRequired";
  if (status === 403) return "forbidden";
  if (status >= 500) return "serviceUnavailable";
  return "requestFailed";
}

function emitServerSentEvent(event: string, onContent: (content: string) => void): void {
  const data = event
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5))
    .join("\n");

  if (data && data !== "[DONE]") onContent(data);
}

function consumeCompleteEvents(
  buffer: string,
  onContent: (content: string) => void,
): string {
  let remaining = buffer;
  let boundary = remaining.match(/\r?\n\r?\n/);

  while (boundary?.index !== undefined) {
    emitServerSentEvent(remaining.slice(0, boundary.index), onContent);
    remaining = remaining.slice(boundary.index + boundary[0].length);
    boundary = remaining.match(/\r?\n\r?\n/);
  }

  return remaining;
}

/** Streams one authenticated Product Guide response through the API Gateway. */
export async function streamProductGuideResponse(
  message: string,
  options: StreamProductGuideOptions,
): Promise<void> {
  const token = getStoredAccessToken();
  if (!token) {
    redirectToLogin();
    throw new ProductGuideApiError("authenticationRequired");
  }

  const url = new URL(PRODUCT_GUIDE_CHAT_PATH, API_BASE_URL);
  url.searchParams.set("message", message);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${token}`,
    },
    signal: options.signal,
  });

  if (!response.ok) {
    if (response.status === 401) redirectToLogin();
    throw new ProductGuideApiError(getResponseErrorCode(response.status));
  }
  if (!response.body) {
    throw new ProductGuideApiError("emptyResponse");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    buffer = consumeCompleteEvents(buffer, options.onContent);
  }

  buffer += decoder.decode();
  if (buffer.trim()) emitServerSentEvent(buffer, options.onContent);
}
