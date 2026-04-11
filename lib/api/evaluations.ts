import { EvaluationDTO, CreateEvaluationRequest } from '@/types/evaluation';
import { evaluationClient } from './client';
import { apiGet, apiPost } from './utils';

const ENDPOINT = '/api/evaluations';

/**
 * Get user's evaluations with pagination
 */
export async function getMyEvaluations(page = 1, limit = 20) {
  return apiGet<{ evaluations: EvaluationDTO[]; total: number; page: number }>(
    evaluationClient,
    `${ENDPOINT}/user`,
    { params: { page, limit } }
  );
}

/**
 * Get single evaluation by ID
 */
export async function getEvaluation(id: string) {
  return apiGet<EvaluationDTO>(evaluationClient, `${ENDPOINT}/${id}`);
}

/**
 * Get evaluation for a composition
 */
export async function getCompositionEvaluation(compositionId: string) {
  return apiGet<EvaluationDTO>(evaluationClient, `${ENDPOINT}/composition/${compositionId}`);
}

/**
 * Get pending evaluations (for instructors)
 */
export async function getPendingEvaluations(page = 1, limit = 20) {
  return apiGet<{ evaluations: EvaluationDTO[]; total: number; page: number }>(
    evaluationClient,
    `${ENDPOINT}/pending`,
    { params: { page, limit } }
  );
}

/**
 * Submit evaluation/grading for a composition
 */
export async function submitEvaluation(
  compositionId: string,
  data: CreateEvaluationRequest
) {
  return apiPost<EvaluationDTO>(
    evaluationClient,
    `${ENDPOINT}/composition/${compositionId}`,
    data
  );
}

/**
 * Get evaluation history for a composition
 */
export async function getEvaluationHistory(compositionId: string) {
  return apiGet<EvaluationDTO[]>(
    evaluationClient,
    `${ENDPOINT}/composition/${compositionId}/history`
  );
}

/**
 * Request revision/re-evaluation for a composition
 */
export async function requestRevision(evaluationId: string, feedback: string) {
  return apiPost<any>(evaluationClient, `${ENDPOINT}/${evaluationId}/request-revision`, {
    feedback,
  });
}
