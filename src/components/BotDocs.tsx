import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import JsonViewer from '@/components/JsonViewer';

const sections = [
  { id: 'overview', title: 'Обзор' },
  { id: 'steps', title: 'Типы шагов' },
  { id: 'conditions', title: 'Условия и переходы' },
  { id: 'errors', title: 'Ошибки и рекомендации' },
];

const exampleScenario = {
  start: 'consent',
  steps: [
    {
      id: 'consent',
      text: 'Подтвердите согласие на обработку персональных данных:',
      type: 'buttons',
      options: ['Отклоняю', 'Подтверждаю'],
      next: { Отклоняю: 'decline', Подтверждаю: 'info_start' },
    },
    { id: 'decline', text: 'К сожалению, без согласия мы не можем продолжить', type: 'message' },
    {
      id: 'info_start',
      text: 'Спасибо!',
      type: 'buttons',
      options: ['Продолжить'],
      next: { Продолжить: 'who_fills' },
    },
    {
      id: 'who_fills',
      text: 'Кто заполняет заявку?',
      type: 'buttons',
      options: ['Родственник', 'Опекун', 'Родитель', 'Я — подопечный'],
      next: { 'Я — подопечный': 'name_ward', default: 'name_not_ward' },
    },
  ],
};

const stepExamples = {
  buttons: exampleScenario.steps[0],
  message: exampleScenario.steps[1],
  input: {
    id: 'name_ward',
    text: 'Шаг 1/6 — Пожалуйста, представьтесь в формате ФИО',
    type: 'input',
    showIf: "answers.who_fills == 'Я — подопечный'",
    next: 'dob',
  },
  date: { id: 'dob', text: 'Введите дату рождения', type: 'date', next: 'city' },
  phone: { id: 'phone', text: 'Введите номер телефона для связи', type: 'phone', next: 'email' },
  email: { id: 'email', text: 'Введите электронную почту', type: 'email', next: 'need_item' },
  link: {
    id: 'social_links',
    text: 'Пришлите ссылку(и) на соц.сети',
    type: 'link',
    showIf: "answers.can_promote == 'Да'",
    next: 'diagnosis_child',
  },
};

const ScenarioDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <Card className="max-h-[700px]">
      <CardHeader className="space-y-2">
        <CardTitle className="font-extrabold">Документация по сценарию бота</CardTitle>
        <CardDescription>
          Подробное руководство по JSON-сценарию, типам шагов и распространённым ошибкам
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 h-[600px] overflow-hidden">
        <div className="flex h-full">
          {/* Меню разделов */}
          <div className="flex flex-col space-y-2 w-56 flex-shrink-0 p-4 border-r border-gray-200">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveSection(section.id)}
              >
                {section.title}
              </Button>
            ))}
          </div>

          {/* Контент разделов */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-6 text-xs">
            {activeSection === 'overview' && (
              <section id="overview" className="space-y-2">
                <h2 className="font-bold text-lg">Обзор</h2>
                <p>Сценарий бота — это JSON-объект с двумя основными ключами:</p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>
                    <code>start</code> — ID шага, с которого начинается сценарий.
                  </li>
                  <li>
                    <code>steps</code> — массив шагов диалога.
                  </li>
                </ul>
                <p>Пример полного сценария:</p>
                <div className="w-full overflow-auto">
                  <JsonViewer value={exampleScenario} />
                </div>
              </section>
            )}

            {activeSection === 'steps' && (
              <section id="steps" className="space-y-2">
                <h2 className="font-bold text-lg">Типы шагов</h2>
                <p>
                  Каждый шаг имеет поле <code>type</code>. Основные типы:
                </p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>
                    <strong>message</strong> — обычное сообщение бота.
                  </li>
                  <li>
                    <strong>buttons</strong> — кнопки для выбора пользователем варианта.
                  </li>
                  <li>
                    <strong>input</strong> — текстовый ввод.
                  </li>
                  <li>
                    <strong>date</strong> — ввод даты.
                  </li>
                  <li>
                    <strong>phone</strong> — ввод номера телефона.
                  </li>
                  <li>
                    <strong>email</strong> — ввод email.
                  </li>
                  <li>
                    <strong>link</strong> — ссылка для отправки файлов или соц.сетей.
                  </li>
                </ul>
                <p>Примеры шагов:</p>
                {Object.entries(stepExamples).map(([key, value]) => (
                  <div key={key} className="mb-4 w-full overflow-auto">
                    <p className="font-semibold">{key}</p>
                    <JsonViewer value={value} />
                  </div>
                ))}
              </section>
            )}

            {activeSection === 'conditions' && (
              <section id="conditions" className="space-y-2">
                <h2 className="font-bold text-lg">Условия отображения и переходы</h2>
                <p>
                  <code>showIf</code> позволяет показывать шаг только при определённом условии:
                </p>
                <div className="w-full overflow-auto">
                  <JsonViewer value={{ showIf: "answers.who_fills == 'Я — подопечный'" }} />
                </div>
                <p>
                  <code>next</code> определяет следующий шаг:
                </p>
                <div className="w-full overflow-auto">
                  <JsonViewer value={{ next: { Да: 'certificate_info', Нет: 'other_funds' } }} />
                </div>
              </section>
            )}

            {activeSection === 'errors' && (
              <section id="errors" className="space-y-2">
                <h2 className="font-bold text-lg">Ошибки и рекомендации</h2>
                <div className="bg-red-50 border-l-4 border-red-400 p-3 space-y-1 rounded">
                  <p className="font-semibold">Распространённые ошибки:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li>Двойные кавычки вокруг ключей и строк обязательны.</li>
                    <li>Не оставляйте лишние запятые в конце массивов и объектов.</li>
                    <li>
                      Проверяйте <code>id</code> шагов и ключи <code>next</code>.
                    </li>
                    <li>
                      Используйте <code>options</code> только для кнопок.
                    </li>
                    <li>
                      Корректно задавайте условия <code>showIf</code>.
                    </li>
                    <li>
                      Не дублируйте <code>id</code> шагов.
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 space-y-1 rounded">
                  <p className="font-semibold">Рекомендации:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li>
                      Структурируйте сценарий логично: приветствие → согласие → сбор данных →
                      финальные шаги.
                    </li>
                    <li>Тестируйте сценарий на пустых и заполненных данных.</li>
                    <li>Для длинных сценариев используйте оглавление и якоря.</li>
                  </ul>
                </div>
              </section>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioDocs;
