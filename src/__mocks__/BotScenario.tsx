import React, { useState } from 'react';

const BotScenario = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState('{"start": "consent", "steps": []}');
  const [hasError, setHasError] = useState(false);
  const [hasSchemaError, setHasSchemaError] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonText(value);
    setHasError(value.includes('invalid'));
    setHasSchemaError(!value.includes('start'));
  };

  return (
    <div>
      <h2>Сценарий бота</h2>

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>Редактировать</button>
      ) : (
        <div>
          <textarea
            role="textbox"
            value={jsonText}
            onChange={handleTextChange}
            data-testid="json-editor"
          />
          <button disabled={hasError || hasSchemaError} data-testid="save-button">
            Сохранить
          </button>

          {hasError && <div data-testid="parse-error">Ошибка синтаксиса JSON</div>}
          {hasSchemaError && <div data-testid="schema-error">Поле start обязательно</div>}
        </div>
      )}
    </div>
  );
};

export default BotScenario;
