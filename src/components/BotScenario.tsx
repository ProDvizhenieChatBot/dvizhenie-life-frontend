import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save } from 'lucide-react';

const BotScenario: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [scenario, setScenario] = useState(`Привет! Я бот Движение Жизни.

Я помогу вам:
1. Заполнить анкету
2. Получить информацию о программе
3. Ответить на ваши вопросы

Начнем?`);

  const handleSave = () => {
    // Здесь будет логика сохранения сценария
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Сценарий бота</CardTitle>
            <CardDescription>
              Настройте текст, который будет отправлять бот пользователям
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Текущий сценарий:</h4>
            {isEditing ? (
              <Textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                rows={10}
                placeholder="Введите сценарий бота..."
                className="min-h-[200px]"
              />
            ) : (
              <div className="px-3 py-2 bg-muted/30 rounded-md text-sm min-h-[200px] flex items-start whitespace-pre-wrap">
                {scenario}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotScenario;
