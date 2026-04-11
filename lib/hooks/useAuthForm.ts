'use client';

import { useState, useCallback } from 'react';

interface UseAuthFormOptions {
  onSubmit: (data: Record<string, string>) => Promise<void>;
  initialValues?: Record<string, string>;
  fields?: string[];
}

interface UseAuthFormReturn {
  formData: Record<string, string>;
  errors: Record<string, string>;
  isLoading: boolean;
  handleChange: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldError: (field: string, error: string) => void;
  clearErrors: () => void;
}

/**
 * Custom hook for managing authentication form state and submission.
 * Handles form fields, validation errors, and loading states automatically.
 *
 * @param onSubmit - Async callback that receives form data
 * @param initialValues - Initial form field values
 * @param fields - Array of field names to manage (default: ['email', 'password', 'name'])
 * @returns Form state and handlers
 *
 * @example
 * const { formData, errors, isLoading, handleChange, handleSubmit } = useAuthForm({
 *   onSubmit: async (data) => await authClient.login(data),
 *   fields: ['email', 'password']
 * });
 */
export function useAuthForm({
  onSubmit,
  initialValues = {},
  fields = ['email', 'password', 'name'],
}: UseAuthFormOptions): UseAuthFormReturn {
  // Initialize form data with provided values or empty strings
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const data: Record<string, string> = {};
    fields.forEach((field) => {
      data[field] = initialValues[field] || '';
    });
    return data;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle individual field changes.
   */
  const handleChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      }
    },
    [errors]
  );

  /**
   * Set error for a specific field.
   */
  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  /**
   * Clear all errors.
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Handle form submission with error handling and loading state.
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      clearErrors();
      setIsLoading(true);

      try {
        await onSubmit(formData);
      } catch (error) {
        // Extract error message from various error types
        const message =
          error instanceof Error ? error.message : 'An error occurred';

        // Try to set specific field error, otherwise set a generic error
        const fieldMatch = message.match(/^(\w+):/);
        if (fieldMatch) {
          setFieldError(fieldMatch[1], message.replace(`${fieldMatch[1]}: `, ''));
        } else {
          setFieldError('_global', message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [formData, onSubmit, setFieldError, clearErrors]
  );

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    setFieldError,
    clearErrors,
  };
}
