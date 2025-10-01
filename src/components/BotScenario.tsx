import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, AlertCircle } from 'lucide-react';
import JsonViewer from '@/components/JsonViewer';
import JsonEditor from '@/components/JsonEditor';
import initialScenario from '@/utilits/scenario.json';

const BotScenario: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(initialScenario, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);
  const [schemaErrors, setSchemaErrors] = useState<Array<{ line: number; message: string }>>([]);

  type Scenario = { start?: unknown; steps?: unknown };

  const parsed = useMemo(() => {
    try {
      return JSON.parse(jsonText);
    } catch {
      return null;
    }
  }, [jsonText]);

  useEffect(() => {
    if (parsed !== null) {
      setParseError(null);
      return;
    }
    try {
      JSON.parse(jsonText);
      setParseError(null);
    } catch (e) {
      let message = 'Invalid JSON';
      if (e instanceof SyntaxError && typeof e.message === 'string') {
        const m = /position\s+(\d+)/i.exec(e.message);
        if (m) {
          const pos = Number(m[1]);
          const slice = jsonText.slice(0, pos);
          const line = slice.split('\n').length;
          const lastNl = slice.lastIndexOf('\n');
          const col = (lastNl === -1 ? pos : pos - lastNl) + 1;
          const prevTwo = jsonText.slice(Math.max(0, pos - 5), pos + 5);
          const maybeTrailingComma = /,\s*[}\]]/.test(prevTwo);
          const hint = maybeTrailingComma
            ? ' (возможно, лишняя запятая перед закрывающей скобкой)'
            : '';
          message = `Синтаксическая ошибка: строка ${line}, колонка ${col}${hint}`;
        } else {
          message = e.message;
        }
      }
      setParseError(message);
    }
  }, [jsonText, parsed]);

  function findStepObjectStarts(text: string): number[] {
    const res: number[] = [];
    const stepsMatch = /"steps"\s*:\s*\[/i.exec(text);
    if (!stepsMatch) return res;
    const arrStart = text.indexOf('[', stepsMatch.index);
    if (arrStart === -1) return res;

    let inString = false;
    let escape = false;
    let braceDepth = 0;

    for (let pos = arrStart + 1; pos < text.length; pos++) {
      const ch = text[pos];

      if (inString) {
        if (escape) escape = false;
        else if (ch === '\\') escape = true;
        else if (ch === '"') inString = false;
        continue;
      }

      if (ch === '"') {
        inString = true;
        continue;
      }

      if (ch === '{') {
        if (braceDepth === 0) res.push(pos);
        braceDepth++;
      } else if (ch === '}') {
        braceDepth--;
        if (braceDepth < 0) break;
      } else if (ch === ']') {
        break;
      }
    }

    return res;
  }

  useMemo(() => {
    if (!parsed) {
      setSchemaErrors([]);
      return;
    }

    const errors: Array<{ line: number; message: string }> = [];
    const stepStarts = findStepObjectStarts(jsonText);

    const addError = (message: string, indexOrPath?: number | string) => {
      let idx = -1;

      if (typeof indexOrPath === 'number') {
        idx = stepStarts[indexOrPath] ?? -1;

        if (idx < 0) {
          const stepsArr: unknown[] | undefined = (parsed as Scenario).steps as
            | unknown[]
            | undefined;
          const step = stepsArr?.[indexOrPath] as Record<string, unknown> | undefined;
          if (step && typeof step === 'object' && 'id' in step && step.id) {
            const idRegex = new RegExp(
              `"id"\\s*:\\s*"${String(step.id).replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}"`,
            );
            const match = idRegex.exec(jsonText);
            if (match) idx = match.index;
          }
        }
      } else if (typeof indexOrPath === 'string') {
        idx = jsonText.indexOf(`"${indexOrPath}"`);
      }

      if (idx < 0) {
        const generalIdx = jsonText.indexOf('{');
        idx = generalIdx >= 0 ? generalIdx : 0;
      }

      const line = idx >= 0 ? jsonText.slice(0, idx).split('\n').length : 1;
      errors.push({ line, message: `Строка ${line}: ${message}` });
    };

    if (typeof parsed !== 'object' || parsed === null) {
      addError('Корневой элемент должен быть объектом');
    } else {
      if (!('start' in (parsed as Scenario)) || typeof (parsed as Scenario).start !== 'string') {
        addError('Поле start обязательно и должно быть строкой', 'start');
      }
      const stepsMaybe = (parsed as Scenario).steps;
      if (!Array.isArray(stepsMaybe)) {
        addError('Поле steps обязательно и должно быть массивом', 'steps');
      } else {
        const steps: unknown[] = stepsMaybe as unknown[];
        steps.forEach((step, i) => {
          if (typeof step !== 'object' || step === null) {
            addError(`Шаг #${i + 1} должен быть объектом`, i);
            return;
          }

          ['id', 'text', 'type'].forEach((key) => {
            if (!(key in (step as Record<string, unknown>))) {
              addError(`Отсутствует обязательное поле: ${key}`, i);
            }
          });
        });
      }
    }

    setSchemaErrors(errors);
  }, [parsed, jsonText]);

  const handleSave = () => {
    if (parseError) return;
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="font-extrabold">Сценарий бота</CardTitle>
            <CardDescription>
              Настройте сценарий, который будет использоваться ботом
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <Button
                onClick={handleSave}
                disabled={Boolean(parseError) || schemaErrors.length > 0}
              >
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
              <div
                className="flex items-start text-red-600 text-sm"
                role="alert"
                aria-live="polite"
              >
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
