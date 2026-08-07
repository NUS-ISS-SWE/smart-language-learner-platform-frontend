export type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  preferredLanguage: string;
  difficultyLevel: string;
  aiTokenBalance: number;
  aiTokenUsed: number;
  createdAt: string;
  deletedAt: string | null;
};

export type AdminUsersPage = {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type UpdateStatusRequest = {
  status: string;
};

export type UpdateRoleRequest = {
  role: string;
};
