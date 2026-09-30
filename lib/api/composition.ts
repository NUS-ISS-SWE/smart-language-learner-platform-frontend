import { apiClient } from "./client";
import type {
  Composition,
  CompositionRequest,
  GenerateCompositionRequest,
  SuggestionFeedback,
  SuggestionFeedbackRequest,
} from "@/types/composition";

export async function getCompositions(params?: { page?: number; size?: number }) {
  const response = await apiClient.get<Composition[]>("/api/v1/composition", {
    params: { page: params?.page ?? 0, size: params?.size ?? 20 },
  });
  return response.data;
}

export async function getComposition(id: number) {
  const response = await apiClient.get<Composition>(`/api/v1/composition/${id}`);
  return response.data;
}

export async function createComposition(payload: CompositionRequest) {
  const response = await apiClient.post<Composition>("/api/v1/composition", payload);
  return response.data;
}

export async function updateComposition(id: number, payload: CompositionRequest) {
  const response = await apiClient.put<Composition>(`/api/v1/composition/${id}`, payload);
  return response.data;
}

export async function deleteComposition(id: number) {
  await apiClient.delete(`/api/v1/composition/${id}`);
}

export async function requestCompositionGrading(id: number) {
  const response = await apiClient.post<Composition>(`/api/v1/composition/${id}/grading`);
  return response.data;
}

export async function generateComposition(payload: GenerateCompositionRequest) {
  const response = await apiClient.post<Composition>("/api/v1/composition/generate", payload);
  return response.data;
}

export async function submitSuggestionFeedback(
  compositionId: number,
  suggestionIndex: number,
  payload: SuggestionFeedbackRequest,
) {
  const response = await apiClient.post<SuggestionFeedback>(
    `/api/v1/composition/${compositionId}/suggestions/${suggestionIndex}/feedback`,
    payload,
  );
  return response.data;
}
