import { useState, useEffect, useCallback, useRef } from 'react';
import applicationsService from '../api/applicationsService';
import { useAuth } from '../components/contexts/AuthContext';
import type { ApiApplication, ApplicationUpdate, UiApplication } from '../api/types/api';

export const useApplications = (
  params: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {},
) => {
  const [applications, setApplications] = useState<UiApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const { user } = useAuth();
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const transformApiToUi = useCallback((apiApp: ApiApplication): UiApplication => {
    return {
      id: apiApp.id,
      name: apiApp.data?.name || 'Не указано',
      age: apiApp.data?.age || 0,
      email: apiApp.data?.email || 'Не указано',
      phone: apiApp.data?.phone || 'Не указано',
      status: mapApiStatusToUiStatus(apiApp.status),
      createdAt: new Date(apiApp.created_at).toLocaleDateString('ru-RU'),
      updatedAt: new Date(apiApp.updated_at || apiApp.created_at).toLocaleDateString('ru-RU'),
      answers: {
        question1: apiApp.data?.answers?.question1 || '',
        question2: apiApp.data?.answers?.question2 || '',
        question3: apiApp.data?.answers?.question3 || '',
      },
    };
  }, []);

  const fetchApplications = useCallback(
    async (fetchParams = {}) => {
      // Проверяем аутентификацию
      if (!user) {
        setError('Please log in to view applications');
        setLoading(false);
        return;
      }

      if (loading) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const finalParams = { ...paramsRef.current, ...fetchParams };
        const data: ApiApplication[] = await applicationsService.getAllApplications(finalParams);
        const transformedApplications: UiApplication[] = data.map(transformApiToUi);

        setApplications(transformedApplications);
        setHasFetched(true);
      } catch (err) {
        console.error('Fetch applications error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setHasFetched(true);
      } finally {
        setLoading(false);
      }
    },
    [loading, transformApiToUi, user],
  );

  const updateApplication = async (uuid: string, updateData: ApplicationUpdate) => {
    if (!user) {
      throw new Error('Not authenticated');
    }

    const updatedApplication: ApiApplication = await applicationsService.updateApplication(
      uuid,
      updateData,
    );

    setApplications((prev) =>
      prev.map((app) =>
        app.id === uuid
          ? {
              ...app,
              status: mapApiStatusToUiStatus(updatedApplication.status),
              updatedAt: new Date().toLocaleDateString('ru-RU'),
            }
          : app,
      ),
    );

    return updatedApplication;
  };

  const updateApplicationData = async (
    uuid: string,
    data: NonNullable<ApplicationUpdate['data']>,
  ) => {
    if (!user) {
      throw new Error('Not authenticated');
    }

    const updatedApplication: ApiApplication = await applicationsService.saveApplicationProgress(
      uuid,
      data,
    );
    const transformedApp = transformApiToUi(updatedApplication);

    setApplications((prev) => prev.map((app) => (app.id === uuid ? transformedApp : app)));

    return updatedApplication;
  };

  const getApplicationDetails = async (uuid: string): Promise<UiApplication> => {
    if (!user) {
      throw new Error('Not authenticated');
    }

    const apiApplication: ApiApplication = await applicationsService.getApplicationDetails(uuid);
    return transformApiToUi(apiApplication);
  };

  useEffect(() => {
    // Загружаем данные только если авторизованы и еще не загружали
    if (user && !hasFetched && !loading) {
      fetchApplications();
    }
  }, [user, hasFetched, loading, fetchApplications]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    updateApplication,
    updateApplicationData,
    getApplicationDetails,
  };
};

const mapApiStatusToUiStatus = (apiStatus: string): 'completed' | 'in_progress' | 'pending' => {
  switch (apiStatus) {
    case 'approved':
    case 'completed':
      return 'completed';
    case 'new':
    case 'in_progress':
      return 'in_progress';
    case 'draft':
    case 'pending':
    case 'rejected':
      return 'pending';
    default:
      return 'pending';
  }
};
