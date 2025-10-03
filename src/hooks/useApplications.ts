import { useState, useEffect, useCallback, useRef } from 'react';
import applicationsService from '../api/applicationsService';
import { useAuth } from '../components/contexts/AuthContext';
import type { ApiApplication, ApplicationUpdate, UiApplication } from '../api/types/api';

const mapApiStatusToUiStatus = (apiStatus: string): 'completed' | 'in_progress' | 'pending' => {
  switch (apiStatus) {
    case 'completed':
      return 'completed';
    case 'in_progress':
      return 'in_progress';
    case 'new':
      return 'in_progress';
    case 'draft':
    case 'rejected':
      return 'pending';
    default:
      return 'pending';
  }
};

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<UiApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const paramsRef = useRef({});

  // Мемоизируем transform функцию если она сложная
  const transformApiToUi = useCallback((apiApp: ApiApplication): UiApplication => {
    // Безопасное извлечение данных с значениями по умолчанию
    const personalInfo = apiApp.data?.personal_info || {};
    const answers = apiApp.data?.answers || {};

    return {
      id: apiApp.id,
      name: personalInfo.name || 'Не указано',
      age: personalInfo.age || 0,
      email: personalInfo.email || 'Не указано',
      phone: personalInfo.phone || 'Не указано',
      status: mapApiStatusToUiStatus(apiApp.status),
      answers: {
        question1: answers.question1 || '',
        question2: answers.question2 || '',
        question3: answers.question3 || '',
      },
      createdAt: new Date(apiApp.created_at).toLocaleDateString('ru-RU'),
      updatedAt: new Date().toLocaleDateString('ru-RU'),
    };
  }, []);

  const fetchApplications = useCallback(
    async (fetchParams = {}) => {
      if (!user) {
        setError('Please log in to view applications');
        setLoading(false);
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
    [user, transformApiToUi], // Только стабильные зависимости
  );

  // Мемоизированные методы для работы с отдельными заявками
  const getApplicationDetails = useCallback(
    async (uuid: string): Promise<UiApplication> => {
      if (!user) throw new Error('Not authenticated');

      const application = await applicationsService.getApplicationDetails(uuid);
      return transformApiToUi(application);
    },
    [user, transformApiToUi],
  );

  const updateApplication = useCallback(
    async (uuid: string, updateData: ApplicationUpdate): Promise<ApiApplication> => {
      if (!user) throw new Error('Not authenticated');
      return applicationsService.updateApplication(uuid, updateData);
    },
    [user],
  );

  const updateApplicationData = useCallback(
    async (uuid: string, data: Record<string, unknown>): Promise<ApiApplication> => {
      if (!user) throw new Error('Not authenticated');
      return applicationsService.saveApplicationProgress(uuid, data);
    },
    [user],
  );

  // Инициализация при монтировании
  useEffect(() => {
    if (user && !hasFetched) {
      fetchApplications();
    }
  }, [user, hasFetched, fetchApplications]);

  return {
    applications,
    loading,
    error,
    hasFetched,
    fetchApplications,
    getApplicationDetails,
    updateApplication,
    updateApplicationData,
  };
};
