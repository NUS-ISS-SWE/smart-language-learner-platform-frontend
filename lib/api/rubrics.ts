import { apiClient } from "./client";
import type {
  RubricCriteriaParams,
  RubricCriterion,
  RubricCriterionRequest,
} from "@/types/rubric";

const RUBRICS_PATH = "/api/v1/admin/rubrics";

export async function listRubricCriteria(params: RubricCriteriaParams = {}) {
  const response = await apiClient.get<RubricCriterion[]>(RUBRICS_PATH, { params });
  return response.data;
}

export async function createRubricCriterion(body: RubricCriterionRequest) {
  const response = await apiClient.post<RubricCriterion>(RUBRICS_PATH, body);
  return response.data;
}

export async function updateRubricCriterion(id: number, body: RubricCriterionRequest) {
  const response = await apiClient.put<RubricCriterion>(`${RUBRICS_PATH}/${id}`, body);
  return response.data;
}

export async function deleteRubricCriterion(id: number) {
  await apiClient.delete(`${RUBRICS_PATH}/${id}`);
}
