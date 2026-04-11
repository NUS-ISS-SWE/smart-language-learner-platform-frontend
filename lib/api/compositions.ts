import { CompositionDTO, CompositionVersion, CreateCompositionRequest, UpdateCompositionRequest } from '@/types/composition';
import { compositionClient } from './client';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './utils';

const ENDPOINT = '/api/compositions';

/**
 * Get user's compositions with pagination
 */
export async function getMyCompositions(page = 1, limit = 20) {
  return apiGet<{ compositions: CompositionDTO[]; total: number; page: number }>(
    compositionClient,
    ENDPOINT,
    { params: { page, limit } }
  );
}

/**
 * Get single composition by ID
 */
export async function getComposition(id: string) {
  return apiGet<CompositionDTO>(compositionClient, `${ENDPOINT}/${id}`);
}

/**
 * Create new composition
 */
export async function createComposition(data: CreateCompositionRequest) {
  return apiPost<CompositionDTO, CreateCompositionRequest>(compositionClient, ENDPOINT, data);
}

/**
 * Update existing composition
 */
export async function updateComposition(id: string, data: UpdateCompositionRequest) {
  return apiPut<CompositionDTO, UpdateCompositionRequest>(compositionClient, `${ENDPOINT}/${id}`, data);
}

/**
 * Submit composition for evaluation
 */
export async function submitForEvaluation(id: string) {
  return apiPost<CompositionDTO, Record<string, unknown>>(compositionClient, `${ENDPOINT}/${id}/submit`, {});
}

/**
 * Delete composition
 */
export async function deleteComposition(id: string) {
  return apiDelete(compositionClient, `${ENDPOINT}/${id}`);
}

/**
 * Get composition history/versions
 */
export async function getCompositionHistory(id: string) {
  return apiGet<CompositionVersion[]>(compositionClient, `${ENDPOINT}/${id}/history`);
}

/**
 * Save composition draft
 */
export async function saveDraft(id: string, content: string) {
  return apiPatch<CompositionDTO, { content: string }>(compositionClient, `${ENDPOINT}/${id}/draft`, {
    content,
  });
}
