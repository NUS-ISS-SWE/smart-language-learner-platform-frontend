import { EvaluationDTO, CreateEvaluationRequest } from '@/types/evaluation';
import { evaluationClient } from './client';

const ENDPOINT = '/api/evaluations';

export const evaluationApi = {
  // Get user's evaluations
  getMyEvaluations: async (page = 1, limit = 20) => {
    const response = await evaluationClient.get<{
      evaluations: EvaluationDTO[];
      total: number;
      page: number;
    }>(`${ENDPOINT}/user`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get single evaluation
  getEvaluation: async (id: string) => {
    const response = await evaluationClient.get<EvaluationDTO>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  // Get evaluation for a composition
  getCompositionEvaluation: async (compositionId: string) => {
    const response = await evaluationClient.get<EvaluationDTO>(
      `${ENDPOINT}/composition/${compositionId}`
    );
    return response.data;
  },

  // Get pending evaluations (for instructors)
  getPendingEvaluations: async (page = 1, limit = 20) => {
    const response = await evaluationClient.get<{
      evaluations: EvaluationDTO[];
      total: number;
      page: number;
    }>(`${ENDPOINT}/pending`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Submit evaluation/grading
  submitEvaluation: async (compositionId: string, data: CreateEvaluationRequest) => {
    const response = await evaluationClient.post<EvaluationDTO>(
      `${ENDPOINT}/composition/${compositionId}`,
      data
    );
    return response.data;
  },

  // Get evaluation history for a composition
  getEvaluationHistory: async (compositionId: string) => {
    const response = await evaluationClient.get<EvaluationDTO[]>(
      `${ENDPOINT}/composition/${compositionId}/history`
    );
    return response.data;
  },

  // Request revision/re-evaluation
  requestRevision: async (evaluationId: string, feedback: string) => {
    const response = await evaluationClient.post<any>(
      `${ENDPOINT}/${evaluationId}/request-revision`,
      { feedback }
    );
    return response.data;
  },
};
