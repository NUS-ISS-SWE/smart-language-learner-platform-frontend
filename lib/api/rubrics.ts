import { RubricDTO, RubricCriterion, CreateRubricRequest, UpdateRubricRequest } from '@/types/rubric';
import { rubricClient } from './client';
import { apiGet, apiPost, apiPut, apiDelete } from './utils';

const ENDPOINT = '/api/rubrics';

/**
 * Get all rubrics with pagination (for admin/instructor)
 */
export async function getRubrics(page = 1, limit = 20, courseId?: string) {
  return apiGet<{ rubrics: RubricDTO[]; total: number; page: number }>(
    rubricClient,
    ENDPOINT,
    { params: { page, limit, courseId } }
  );
}

/**
 * Get single rubric by ID
 */
export async function getRubric(id: string) {
  return apiGet<RubricDTO>(rubricClient, `${ENDPOINT}/${id}`);
}

/**
 * Create new rubric
 */
export async function createRubric(data: CreateRubricRequest) {
  return apiPost<RubricDTO, CreateRubricRequest>(rubricClient, ENDPOINT, data);
}

/**
 * Update existing rubric
 */
export async function updateRubric(id: string, data: UpdateRubricRequest) {
  return apiPut<RubricDTO, UpdateRubricRequest>(rubricClient, `${ENDPOINT}/${id}`, data);
}

/**
 * Delete rubric
 */
export async function deleteRubric(id: string) {
  return apiDelete(rubricClient, `${ENDPOINT}/${id}`);
}

/**
 * Get rubric criteria
 */
export async function getRubricCriteria(rubricId: string) {
  return apiGet<RubricCriterion[]>(rubricClient, `${ENDPOINT}/${rubricId}/criteria`);
}

/**
 * Publish rubric to students
 */
export async function publishRubric(id: string) {
  return apiPost<RubricDTO, Record<string, unknown>>(rubricClient, `${ENDPOINT}/${id}/publish`, {});
}

/**
 * Clone rubric with new name
 */
export async function cloneRubric(id: string, newName: string) {
  return apiPost<RubricDTO, { name: string }>(rubricClient, `${ENDPOINT}/${id}/clone`, { name: newName });
}

/**
 * Get rubrics by course ID
 */
export async function getRubricsByCourse(courseId: string) {
  return apiGet<RubricDTO[]>(rubricClient, `${ENDPOINT}/course/${courseId}`);
}
