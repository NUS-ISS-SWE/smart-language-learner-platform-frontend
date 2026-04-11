import { RubricDTO, CreateRubricRequest, UpdateRubricRequest } from '@/types/rubric';
import { rubricClient } from './client';

const ENDPOINT = '/api/rubrics';

export const rubricApi = {
  // Get all rubrics (for admin/instructor)
  getRubrics: async (page = 1, limit = 20, courseId?: string) => {
    const response = await rubricClient.get<{
      rubrics: RubricDTO[];
      total: number;
      page: number;
    }>(`${ENDPOINT}`, {
      params: { page, limit, courseId },
    });
    return response.data;
  },

  // Get single rubric
  getRubric: async (id: string) => {
    const response = await rubricClient.get<RubricDTO>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new rubric
  createRubric: async (data: CreateRubricRequest) => {
    const response = await rubricClient.post<RubricDTO>(`${ENDPOINT}`, data);
    return response.data;
  },

  // Update rubric
  updateRubric: async (id: string, data: UpdateRubricRequest) => {
    const response = await rubricClient.put<RubricDTO>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  // Delete rubric
  deleteRubric: async (id: string) => {
    await rubricClient.delete(`${ENDPOINT}/${id}`);
  },

  // Get rubric criteria
  getRubricCriteria: async (rubricId: string) => {
    const response = await rubricClient.get<any[]>(`${ENDPOINT}/${rubricId}/criteria`);
    return response.data;
  },

  // Publish rubric to students
  publishRubric: async (id: string) => {
    const response = await rubricClient.post<RubricDTO>(`${ENDPOINT}/${id}/publish`, {});
    return response.data;
  },

  // Clone rubric
  cloneRubric: async (id: string, newName: string) => {
    const response = await rubricClient.post<RubricDTO>(`${ENDPOINT}/${id}/clone`, {
      name: newName,
    });
    return response.data;
  },

  // Get rubrics by course
  getRubricsByCourse: async (courseId: string) => {
    const response = await rubricClient.get<RubricDTO[]>(`${ENDPOINT}/course/${courseId}`);
    return response.data;
  },
};
