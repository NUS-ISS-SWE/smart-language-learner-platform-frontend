import type { VocabularyItem, VocabularySet } from "@/types/vocabulary";
import { apiGet, apiPost, vocabularyClient } from "./client";

export async function getVocabularySets(language?: string): Promise<VocabularySet[]> {
  return apiGet<VocabularySet[]>(vocabularyClient, "/api/vocabulary/sets", {
    params: language ? { language } : undefined,
  });
}

export async function getVocabularySetById(id: string): Promise<VocabularySet> {
  return apiGet<VocabularySet>(vocabularyClient, `/api/vocabulary/sets/${id}`);
}

export async function getVocabularyItems(setId: string): Promise<VocabularyItem[]> {
  return apiGet<VocabularyItem[]>(vocabularyClient, `/api/vocabulary/sets/${setId}/items`);
}

export async function saveVocabularyItem(
  setId: string,
  itemId: string
): Promise<void> {
  return apiPost(vocabularyClient, `/api/vocabulary/sets/${setId}/items/${itemId}/save`);
}
