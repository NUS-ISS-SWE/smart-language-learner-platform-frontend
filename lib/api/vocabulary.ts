import type { VocabularyItem, VocabularySet } from "@/types/vocabulary";
import { apiGet, apiPost, apiPut, apiDelete, vocabularyClient } from "./client";

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

// Additional endpoints
export async function createVocabularySet(data: Partial<VocabularySet>): Promise<VocabularySet> {
  return apiPost<VocabularySet>(vocabularyClient, "/api/vocabulary/sets", data);
}

export async function updateVocabularySet(id: string, data: Partial<VocabularySet>): Promise<VocabularySet> {
  return apiPut<VocabularySet>(vocabularyClient, `/api/vocabulary/sets/${id}`, data);
}

export async function deleteVocabularySet(id: string): Promise<void> {
  return apiDelete(vocabularyClient, `/api/vocabulary/sets/${id}`);
}

export async function addVocabularyItem(
  setId: string,
  item: Partial<VocabularyItem>
): Promise<VocabularyItem> {
  return apiPost<VocabularyItem>(
    vocabularyClient,
    `/api/vocabulary/sets/${setId}/items`,
    item
  );
}

export async function updateVocabularyItem(
  setId: string,
  itemId: string,
  item: Partial<VocabularyItem>
): Promise<VocabularyItem> {
  return apiPut<VocabularyItem>(
    vocabularyClient,
    `/api/vocabulary/sets/${setId}/items/${itemId}`,
    item
  );
}

export async function deleteVocabularyItem(setId: string, itemId: string): Promise<void> {
  return apiDelete(vocabularyClient, `/api/vocabulary/sets/${setId}/items/${itemId}`);
}

export async function getUserSavedItems(): Promise<VocabularyItem[]> {
  return apiGet<VocabularyItem[]>(vocabularyClient, "/api/vocabulary/items/saved");
}

export async function searchVocabulary(query: string, language?: string): Promise<VocabularyItem[]> {
  return apiGet<VocabularyItem[]>(vocabularyClient, "/api/vocabulary/search", {
    params: { query, language },
  });
}
