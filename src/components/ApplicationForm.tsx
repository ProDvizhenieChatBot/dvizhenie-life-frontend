import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import type { UiApplication } from '../api/types/api';

interface ApplicationFormProps {
  applicationId: string;
}

type ApplicationStatus = 'completed' | 'in_progress' | 'pending';

const mapUiStatusToApiStatus = (uiStatus: string): string => {
  // Прямое соответствие согласно документации
  switch (uiStatus) {
    case 'completed':
      return 'completed';
    case 'in_progress':
      return 'in_progress';
    case 'pending':
      return 'draft';
    default:
      console.warn('Unknown UI status, using draft:', uiStatus);
      return 'draft';
  }
};
const ApplicationForm: React.FC<ApplicationFormProps> = ({ applicationId }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UiApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const { getApplicationDetails, updateApplication, updateApplicationData } = useApplications();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const application = await getApplicationDetails(applicationId);
        setFormData(application);
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, getApplicationDetails]);

  const handleSave = async (): Promise<void> => {
    if (!formData) return;

    setSaving(true);
    try {
      const apiData = {
        name: formData.name,
        age: formData.age,
        email: formData.email,
        phone: formData.phone,
        answers: formData.answers,
      };

      await updateApplicationData(applicationId, apiData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving application:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (): void => {
    const reloadData = async (): Promise<void> => {
      try {
        const application = await getApplicationDetails(applicationId);
        setFormData(application);
      } catch (error) {
        console.error('Error reloading application:', error);
      }
    };

    reloadData();
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UiApplication, value: string | number): void => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null,
    );
  };

  const handleAnswerChange = (questionKey: keyof UiApplication['answers'], value: string): void => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            answers: {
              ...prev.answers,
              [questionKey]: value,
            },
          }
        : null,
    );
  };

  const handleStatusChange = async (newStatus: ApplicationStatus): Promise<void> => {
    if (!formData) return;

    try {
      const apiStatus = mapUiStatusToApiStatus(newStatus);

      // Правильная структура согласно документации
      const updateData = {
        status: apiStatus,
        admin_comment: `Status changed to ${newStatus}`,
      };

      await updateApplication(applicationId, updateData);

      setFormData((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              updatedAt: new Date().toLocaleDateString('ru-RU'),
            }
          : null,
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert(
        'Ошибка при изменении статуса: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  };

  const canEditApplication = (status: ApplicationStatus): boolean => {
    return status === 'pending';
  };

  const getEditButtonText = (status: ApplicationStatus): string => {
    switch (status) {
      case 'completed':
        return 'Заявка завершена';
      case 'in_progress':
        return 'Заявка в обработке';
      case 'pending':
        return 'Редактировать';
      default:
        return 'Редактировать';
    }
  };

  const getStatusVariant = (
    status: string,
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Завершена';
      case 'in_progress':
        return 'В процессе';
      case 'pending':
        return 'Ожидает';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Загрузка данных заявки...</div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-destructive">Заявка не найдена</div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <Card className="space-y-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Редактирование заявки</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button variant="outline" onClick={handleCancel} size="sm">
                <X className="w-4 h-4 mr-2" />
                Отмена
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Возраст</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ответы на вопросы</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question1">Вопрос 1</Label>
                <Textarea
                  id="question1"
                  value={formData.answers.question1}
                  onChange={(e) => handleAnswerChange('question1', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question2">Вопрос 2</Label>
                <Textarea
                  id="question2"
                  value={formData.answers.question2}
                  onChange={(e) => handleAnswerChange('question2', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question3">Вопрос 3</Label>
                <Textarea
                  id="question3"
                  value={formData.answers.question3}
                  onChange={(e) => handleAnswerChange('question3', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="space-y-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>{formData.name}</CardTitle>
            <Badge variant={getStatusVariant(formData.status)}>
              {getStatusText(formData.status)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              size="sm"
              disabled={!canEditApplication(formData.status)}
              title={
                !canEditApplication(formData.status)
                  ? getEditButtonText(formData.status)
                  : 'Редактировать заявку'
              }
            >
              <Edit className="w-4 h-4 mr-2" />
              {getEditButtonText(formData.status)}
            </Button>

            <select
              value={formData.status}
              onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="pending">Ожидает</option>
              <option value="in_progress">В процессе</option>
              <option value="completed">Завершена</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="view-id">ID</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {formData.id}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-age">Возраст</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {formData.age} лет
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-email">Email</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {formData.email}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-phone">Телефон</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {formData.phone}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-created">Дата создания</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {formData.createdAt}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-updated">Последнее обновление</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {formData.updatedAt}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ответы на вопросы</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="view-question1">Вопрос 1</Label>
              <div className="px-3 py-2 bg-muted/30 rounded-md text-sm min-h-[80px] flex items-start">
                {formData.answers.question1}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="view-question2">Вопрос 2</Label>
              <div className="px-3 py-2 bg-muted/30 rounded-md text-sm min-h-[80px] flex items-start">
                {formData.answers.question2}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="view-question3">Вопрос 3</Label>
              <div className="px-3 py-2 bg-muted/30 rounded-md text-sm min-h-[80px] flex items-start">
                {formData.answers.question3}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationForm;
