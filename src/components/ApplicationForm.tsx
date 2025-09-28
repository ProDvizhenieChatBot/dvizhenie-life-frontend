import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X } from 'lucide-react';

interface ApplicationData {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  status: 'completed' | 'in_progress' | 'pending';
  createdAt: string;
  updatedAt: string;
  answers: {
    question1: string;
    question2: string;
    question3: string;
  };
}

interface ApplicationFormProps {
  applicationData: ApplicationData;
  onSave: (data: ApplicationData) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ applicationData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ApplicationData>(applicationData);

  const getStatusVariant = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(applicationData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ApplicationData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAnswerChange = (questionKey: keyof ApplicationData['answers'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionKey]: value,
      },
    }));
  };

  if (isEditing) {
    return (
      <Card className="space-y-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{formData.name}</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Сохранить
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

  // Режим просмотра
  return (
    <Card className="space-y-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>{applicationData.name}</CardTitle>
            <Badge variant={getStatusVariant(applicationData.status)}>
              {getStatusText(applicationData.status)}
            </Badge>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="view-id">ID</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {applicationData.id}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-age">Возраст</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {applicationData.age} лет
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-email">Email</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {applicationData.email}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-phone">Телефон</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {applicationData.phone}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-created">Дата создания</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {applicationData.createdAt}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-updated">Последнее обновление</Label>
            <div className="px-3 py-2 bg-muted/30 rounded-md text-sm h-10 flex items-center">
              {applicationData.updatedAt}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ответы на вопросы</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="view-question1">Вопрос 1</Label>
              <div className="px-3 py-2 bg-muted/30 rounded-md text-sm min-h-[80px] flex items-start">
                {applicationData.answers.question1}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="view-question2">Вопрос 2</Label>
              <div className="px-3 py-2 bg-muted/30 rounded-md text-sm min-h-[80px] flex items-start">
                {applicationData.answers.question2}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="view-question3">Вопрос 3</Label>
              <div className="px-3 py-2 bg-muted/30 rounded-md text-sm min-h-[80px] flex items-start">
                {applicationData.answers.question3}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationForm;
