import type { Content } from "@tiptap/core";

/** Plain text only: safe to render through React, on the server or client. */
export function compositionPreview(content: string, limit = 240): string {
  const text = isCompositionHtml(content)
    ? content
        .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&#(x[\da-f]+|\d+);/gi, (match, entity: string) => {
          const code =
            entity[0].toLowerCase() === "x"
              ? parseInt(entity.slice(1), 16)
              : Number(entity);
          return code > 0 &&
            code <= 0x10ffff &&
            !(code >= 0xd800 && code <= 0xdfff)
            ? String.fromCodePoint(code)
            : match;
        })
        .replace(
          /&(amp|lt|gt|quot|apos|nbsp);/g,
          (_, entity: string) =>
            (
              ({
                amp: "&",
                lt: "<",
                gt: ">",
                quot: '"',
                apos: "'",
                nbsp: " ",
              }) as Record<string, string>
            )[entity] ?? "",
        )
    : content;
  return text.replace(/\s+/g, " ").trim().slice(0, limit);
}

// Stored Tiptap documents have block roots. Legacy prose, including literal
// angle brackets, is treated as text. The schema still sanitizes recognized HTML.
export function isCompositionHtml(content: string): boolean {
  return /^\s*<(?:p|h[1-6]|ul|ol|blockquote|pre)(?:\s[^>]*)?>/i.test(content);
}

export function compositionContent(content: string): Content {
  if (isCompositionHtml(content)) return content;
  return {
    type: "doc",
    content: content.split(/\r?\n/).map((line) => ({
      type: "paragraph",
      content: line ? [{ type: "text", text: line }] : [],
    })),
  };
}

/** Extracted document text is always literal, even if it starts with HTML-like text. */
export function plainTextToCompositionHtml(text: string): string {
  const escaped = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return escaped
    .split(/\r?\n\r?\n/)
    .map((paragraph) => `<p>${paragraph.replace(/\r?\n/g, "<br>")}</p>`)
    .join("");
}
