import type { Content } from "@tiptap/core";

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
