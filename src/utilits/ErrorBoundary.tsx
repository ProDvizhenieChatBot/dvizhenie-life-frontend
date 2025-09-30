import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './style.module.css';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Обновляем состояние для отображения fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Логируем ошибку в сервис (например, Sentry, console)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Отображаем fallback UI
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Компонент для отображения ошибки по умолчанию
const DefaultErrorFallback = ({ error }: { error?: Error }) => (
  <div className={styles.div}>
    <h2>Что-то пошло не так 😔</h2>
    <p>Мы уже работаем над исправлением проблемы</p>
    {error && (
      <details className={styles.details}>
        <summary>Подробности об ошибке</summary>
        <pre className={styles.pre}>{error.toString()}</pre>
      </details>
    )}
    <button onClick={() => window.location.reload()} className={styles.button}>
      Перезагрузить страницу
    </button>
  </div>
);

export default ErrorBoundary;
