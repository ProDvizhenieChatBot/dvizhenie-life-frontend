import React, { useState } from 'react';

class ComponentWithConstructorError extends React.Component {
  constructor(props: React.Component) {
    super(props);
    // Ошибка в конструкторе - будет поймана
    throw new Error('Ошибка в конструкторе компонента!');
  }

  render() {
    return <div>Этот текст никогда не покажется</div>;
  }
}

export const ErrorTester = () => {
  const [errorType, setErrorType] = useState<'none' | 'render' | 'constructor'>('none');

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Тестирование Error Boundary</h2>

      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => setErrorType('render')}>Тест ошибки рендеринга</button>
        <button onClick={() => setErrorType('constructor')}>Тест ошибки в конструкторе</button>
        <button onClick={() => setErrorType('none')}>Сбросить ошибки</button>
      </div>

      {errorType === 'render' && <ThrowErrorOnRender />}
      {errorType === 'constructor' && <ComponentWithConstructorError />}
      {errorType === 'none' && <div>Ошибок нет</div>}
    </div>
  );
};

const ThrowErrorOnRender = () => {
  throw new Error('Тестовая ошибка рендеринга!');
  return <div>Этот текст не покажется</div>;
};
