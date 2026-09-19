import { isAxiosError } from "axios";

/** A missing response does not establish whether a non-idempotent POST ran. */
export const isUncertainMutationError = (error: unknown) =>
  !isAxiosError(error) ||
  !error.response ||
  error.response.status >= 500 ||
  error.response.status === 408;
