import React from 'react';
import ApplicationForm from './ApplicationForm';

interface ApplicationProps {
  applicationId?: string;
}

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

const Application: React.FC<ApplicationProps> = ({ applicationId }) => {
  // Моковые данные для демонстрации
  const applicationData: ApplicationData = {
    id: applicationId || '1',
    name: 'Иван Петров',
    age: 25,
    email: 'ivan.petrov@example.com',
    phone: '+7 (999) 123-45-67',
    status: 'completed',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16',
    answers: {
      question1: 'Ответ на первый вопрос',
      question2: 'Ответ на второй вопрос',
      question3: 'Ответ на третий вопрос',
    },
  };

  const handleSave = (updatedData: ApplicationData) => {
    // Здесь будет логика сохранения данных
    console.log('Сохранение данных:', updatedData);
  };

  return <ApplicationForm applicationData={applicationData} onSave={handleSave} />;
};

export default Application;
