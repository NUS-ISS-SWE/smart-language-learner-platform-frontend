import {
  isCompositionHtml,
  plainTextToCompositionHtml,
} from "@/lib/composition-content";

export type SuggestionReplacement = {
  suggestionIndex: number;
  excerpt: string;
  revision: string;
};

type ReplacementRange = SuggestionReplacement & {
  start: number;
  end: number;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function uniqueRange(
  content: string,
  replacement: SuggestionReplacement,
): ReplacementRange | null {
  const start = content.indexOf(replacement.excerpt);
  if (start < 0 || start !== content.lastIndexOf(replacement.excerpt)) return null;
  return { ...replacement, start, end: start + replacement.excerpt.length };
}

function rangesOverlap(first: ReplacementRange, second: ReplacementRange): boolean {
  return first.start < second.end && second.start < first.end;
}

/**
 * Returns whether a suggested excerpt is safe to apply alongside the current
 * selection. Ambiguous or overlapping excerpts stay manual edits.
 */
export function canApplySuggestion(
  content: string,
  candidate: SuggestionReplacement,
  selected: SuggestionReplacement[],
): boolean {
  const candidateRange = uniqueRange(content, candidate);
  if (!candidateRange) return false;
  return selected.every((replacement) => {
    const selectedRange = uniqueRange(content, replacement);
    return selectedRange !== null && !rangesOverlap(candidateRange, selectedRange);
  });
}

/**
 * Applies all selections atomically and marks the inserted text so it is
 * immediately visible in the new editor draft. Callers must first use
 * canApplySuggestion for every selection.
 */
export function applySuggestionReplacements(
  content: string,
  replacements: SuggestionReplacement[],
): string {
  const ranges = replacements.map((replacement) => uniqueRange(content, replacement));
  if (ranges.some((range) => range === null)) {
    throw new Error("A selected suggestion no longer matches the composition.");
  }
  const validRanges = ranges as ReplacementRange[];
  for (let index = 0; index < validRanges.length; index += 1) {
    for (let compare = index + 1; compare < validRanges.length; compare += 1) {
      if (rangesOverlap(validRanges[index], validRanges[compare])) {
        throw new Error("Selected suggestions overlap.");
      }
    }
  }

  const descending = [...validRanges].sort((first, second) => second.start - first.start);
  if (isCompositionHtml(content)) {
    return descending.reduce(
      (result, replacement) =>
        `${result.slice(0, replacement.start)}<mark>${escapeHtml(replacement.revision)}</mark>${result.slice(replacement.end)}`,
      content,
    );
  }

  const markers = new Map<string, string>();
  const markedText = descending.reduce((result, replacement) => {
    const marker = `SLLP_APPLIED_REVISION_${replacement.suggestionIndex}_${replacement.start}`;
    markers.set(marker, `<mark>${escapeHtml(replacement.revision)}</mark>`);
    return `${result.slice(0, replacement.start)}${marker}${result.slice(replacement.end)}`;
  }, content);
  let html = plainTextToCompositionHtml(markedText);
  markers.forEach((mark, marker) => {
    html = html.replaceAll(marker, mark);
  });
  return html;
}
