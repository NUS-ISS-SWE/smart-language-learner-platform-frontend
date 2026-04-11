import { CompositionDTO, CreateCompositionRequest, UpdateCompositionRequest } from '@/types/composition';
import { compositionClient } from './client';

const ENDPOINT = '/api/compositions';

export const compositionApi = {
  // Get user's compositions
  getMyCompositions: async (page = 1, limit = 20) => {
    const response = await compositionClient.get<{
      compositions: CompositionDTO[];
      total: number;
      page: number;
    }>(ENDPOINT, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get single composition
  getComposition: async (id: string) => {
    const response = await compositionClient.get<CompositionDTO>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new composition
  createComposition: async (data: CreateCompositionRequest) => {
    const response = await compositionClient.post<CompositionDTO>(ENDPOINT, data);
    return response.data;
  },

  // Update composition
  updateComposition: async (id: string, data: UpdateCompositionRequest) => {
    const response = await compositionClient.put<CompositionDTO>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  // Submit composition for evaluation
  submitForEvaluation: async (id: string) => {
    const response = await compositionClient.post<CompositionDTO>(
      `${ENDPOINT}/${id}/submit`,
      {}
    );
    return response.data;
  },

  // Delete composition
  deleteComposition: async (id: string) => {
    await compositionClient.delete(`${ENDPOINT}/${id}`);
  },

  // Get composition history/versions
  getCompositionHistory: async (id: string) => {
    const response = await compositionClient.get<any[]>(`${ENDPOINT}/${id}/history`);
    return response.data;
  },

  // Save composition draft
  saveDraft: async (id: string, content: string) => {
    const response = await compositionClient.patch<CompositionDTO>(`${ENDPOINT}/${id}/draft`, {
      content,
    });
    return response.data;
  },
};
