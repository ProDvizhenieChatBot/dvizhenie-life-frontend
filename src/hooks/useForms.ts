import { useState, useCallback } from 'react';
import formsService from '../api/formsService';
import { useAuth } from '../components/contexts/AuthContext';
import type { FormSchema, FormSchemaUpload } from '../api/types/api';

export const useForms = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getActiveSchema = useCallback(async (): Promise<FormSchema> => {
    if (!user) throw new Error('Not authenticated');
    setLoading(true);
    setError(null);

    try {
      const schema = await formsService.getActiveFormSchema();
      return schema;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const uploadSchema = useCallback(
    async (schemaData: FormSchemaUpload): Promise<string> => {
      if (!user) throw new Error('Not authenticated');
      setLoading(true);
      setError(null);

      try {
        const result = await formsService.uploadFormSchema(schemaData);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  return {
    loading,
    error,
    getActiveSchema,
    uploadSchema,
  };
};
