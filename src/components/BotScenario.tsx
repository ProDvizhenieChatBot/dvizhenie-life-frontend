import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, AlertCircle, Download, Upload } from 'lucide-react';
import JsonViewer from '@/components/JsonViewer';
import JsonEditor from '@/components/JsonEditor';
import { useForms } from '@/hooks/useForms';
import initialScenario from '@/utilits/scenario.json';

const BotScenario: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState<string>('');
  const [parseError] = useState<string | null>(null);
  const [schemaErrors] = useState<Array<{ line: number; message: string }>>([]);
  const [version, setVersion] = useState<string>('');

  const { getActiveSchema, uploadSchema, loading, error } = useForms();

  // Загружаем схему с сервера при монтировании
  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schema = await getActiveSchema();
        setJsonText(JSON.stringify(schema, null, 2));
      } catch (err) {
        // Если ошибка, используем локальную схему
        console.warn('Failed to load schema from server, using local:', err);
        setJsonText(JSON.stringify(initialScenario, null, 2));
      }
    };

    loadSchema();
  }, [getActiveSchema]);

  // Генерируем версию на основе даты
  useEffect(() => {
    const date = new Date();
    const versionString = `v${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${date
      .getHours()
      .toString()
      .padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
    setVersion(versionString);
  }, []);

  const parsed = useMemo(() => {
    try {
      return JSON.parse(jsonText);
    } catch {
      return null;
    }
  }, [jsonText]);

  // ... остальная логика валидации (findStepObjectStarts, useEffect для parseError и schemaErrors) ...

  const handleSave = async () => {
    if (parseError || schemaErrors.length > 0) return;

    try {
      const schemaData = {
        version: version,
        schema_data: JSON.parse(jsonText),
      };

      await uploadSchema(schemaData);
      setIsEditing(false);

      // Показываем уведомление об успехе
      alert('Схема успешно сохранена на сервере!');
    } catch (err) {
      console.error('Failed to save schema:', err);
      alert(
        'Ошибка при сохранении схемы: ' + (err instanceof Error ? err.message : 'Unknown error'),
      );
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bot-scenario-${version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedContent = JSON.parse(content);
        setJsonText(JSON.stringify(parsedContent, null, 2));
      } catch {
        alert('Ошибка при чтении файла: Неверный JSON формат');
      }
    };
    reader.readAsText(file);

    // Сбрасываем input
    event.target.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="font-extrabold">Сценарий бота</CardTitle>
            <CardDescription>
              Настройте сценарий, который будет использоваться ботом
              {version && <span className="ml-2 text-blue-600">Версия: {version}</span>}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={Boolean(parseError) || schemaErrors.length > 0 || loading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {loading ? 'Сохранение...' : 'Сохранить на сервер'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Скачать
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleLoadFromFile}
                  className="hidden"
                  id="schema-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="schema-upload" className="cursor-pointer">
                    Загрузить из файла
                  </label>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center text-red-800">
              <AlertCircle className="w-4 h-4 mr-2" />
              Ошибка сервера: {error}
            </div>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-2">
            <JsonEditor
              value={jsonText}
              onChange={setJsonText}
              rows={18}
              placeholder="Введите JSON-сценарий..."
              errorRanges={schemaErrors}
            />
            {(parseError || schemaErrors.length > 0) && (
              <div className="flex items-start text-red-600 text-sm" role="alert">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                <div className="space-y-1">
                  {parseError && <div>Ошибка синтаксиса JSON: {parseError}</div>}
                  {schemaErrors.map((e, idx) => (
                    <div key={idx}>{e.message}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <JsonViewer value={parsed ?? jsonText} />
        )}
      </CardContent>
    </Card>
  );
};

export default BotScenario;
