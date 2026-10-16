"use client";

import { useEffect, useRef, useState } from "react";
import { BotMessageSquare, LoaderCircle, Send, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ProductGuideApiError,
  type ProductGuideApiErrorCode,
  streamProductGuideResponse,
} from "@/lib/api/product-guide";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import type { ProductGuideMessage } from "@/types/product-guide";

const SUGGESTION_KEYS = [
  "suggestionComposition",
  "suggestionDocument",
  "suggestionSubscription",
] as const;

const ERROR_TRANSLATION_KEYS: Record<ProductGuideApiErrorCode, string> = {
  authenticationRequired: "authenticationRequired",
  forbidden: "forbidden",
  contentBlocked: "contentBlocked",
  serviceUnavailable: "serviceUnavailable",
  requestFailed: "requestFailed",
  emptyResponse: "emptyResponse",
};

function ChatMessage({ message }: { readonly message: ProductGuideMessage }) {
  const { t } = useTranslation("productGuide");
  const isUser = message.role === "user";

  return (
    <article className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BotMessageSquare className="h-4 w-4" aria-hidden="true" />
        </div>
      ) : null}
      <div className={cn("max-w-[85%] sm:max-w-[75%]", isUser && "text-right")}>
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          {isUser ? t("userLabel") : t("assistantLabel")}
        </p>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-left text-sm leading-6 whitespace-pre-wrap break-words",
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md border bg-card text-card-foreground",
            message.status === "error" && "border-destructive/30",
          )}
        >
          {message.content || (
            <span className="flex items-center gap-2 text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t("thinking")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGuideChat() {
  const { t } = useTranslation("productGuide");
  const [messages, setMessages] = useState<ProductGuideMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => () => requestRef.current?.abort(), []);

  function updateAssistantMessage(
    id: string,
    update: (message: ProductGuideMessage) => ProductGuideMessage,
  ): void {
    setMessages((current) => current.map((message) => (message.id === id ? update(message) : message)));
  }

  function localizedError(error: unknown): string {
    if (error instanceof ProductGuideApiError) return t(ERROR_TRANSLATION_KEYS[error.code]);
    return t("interrupted");
  }

  async function sendMessage(value: string): Promise<void> {
    const question = value.trim();
    if (!question || requestRef.current) return;

    const controller = new AbortController();
    const assistantId = crypto.randomUUID();
    let receivedContent = false;
    requestRef.current = controller;
    setDraft("");
    setErrorMessage(null);
    setIsStreaming(true);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: question, status: "complete" },
      { id: assistantId, role: "assistant", content: "", status: "streaming" },
    ]);

    try {
      await streamProductGuideResponse(question, {
        signal: controller.signal,
        onContent: (content) => {
          receivedContent = true;
          updateAssistantMessage(assistantId, (message) => ({
            ...message,
            content: message.content + content,
          }));
        },
      });

      if (!receivedContent) {
        const message = t("emptyResponse");
        setErrorMessage(message);
        updateAssistantMessage(assistantId, (current) => ({
          ...current,
          content: message,
          status: "error",
        }));
      } else {
        updateAssistantMessage(assistantId, (message) => ({ ...message, status: "complete" }));
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      const message = localizedError(error);
      setErrorMessage(message);
      updateAssistantMessage(assistantId, (current) => ({
        ...current,
        content: current.content || message,
        status: "error",
      }));
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      setIsStreaming(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void sendMessage(draft);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void sendMessage(draft);
    }
  }

  return (
    <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6"
        role="log"
        aria-live="polite"
        aria-label={t("conversationLabel")}
      >
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">
              <Sparkles className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold">{t("welcomeTitle")}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {t("welcomeDescription")}
            </p>
            <div className="mt-6 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
              {SUGGESTION_KEYS.map((key) => {
                const suggestion = t(key);
                return (
                  <button
                    key={key}
                    type="button"
                    className="min-h-12 rounded-lg border bg-background px-4 py-3 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => void sendMessage(suggestion)}
                    disabled={isStreaming}
                  >
                    {suggestion}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((message) => <ChatMessage key={message.id} message={message} />)
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="border-t bg-background p-4 sm:p-5">
        {errorMessage ? (
          <p className="mb-3 text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <form className="flex items-end gap-3" onSubmit={handleSubmit}>
          <div className="min-w-0 flex-1">
            <label htmlFor="product-guide-message" className="sr-only">
              {t("inputLabel")}
            </label>
            <Textarea
              id="product-guide-message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("inputPlaceholder")}
              className="min-h-12 max-h-40 resize-y"
              rows={1}
              disabled={isStreaming}
            />
          </div>
          <Button
            type="submit"
            className="h-12 shrink-0 px-4"
            disabled={isStreaming || !draft.trim()}
          >
            {isStreaming ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{t("send")}</span>
          </Button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">{t("disclaimer")}</p>
      </div>
    </Card>
  );
}
