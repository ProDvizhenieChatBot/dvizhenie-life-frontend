import { useState, useCallback } from 'react';
import {
  type ValidationSchema,
  type ValidationErrors,
  validateForm,
  validateField,
} from '@/lib/validation';

interface UseFormValidationProps {
  schema: ValidationSchema;
  initialValues?: Record<string, string>;
}

export const useFormValidation = ({ schema, initialValues = {} }: UseFormValidationProps) => {
  const [formData, setFormData] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Сразу помечаем все поля как touched для немедленной валидации
  const [touched] = useState<Record<string, boolean>>(() => {
    const initialTouched: Record<string, boolean> = {};
    Object.keys(schema).forEach((field) => {
      initialTouched[field] = true; // Все поля сразу touched
    });
    return initialTouched;
  });

  // Валидация всего формы
  const validate = useCallback((): boolean => {
    const newErrors = validateForm(formData, schema);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, schema]);

  // Валидация отдельного поля
  const validateSingleField = useCallback(
    (field: string, value: string): string => {
      const fieldRules = schema[field];
      if (!fieldRules) return '';
      return validateField(value, fieldRules);
    },
    [schema],
  );

  // Обработчик изменения поля
  const handleChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Валидируем поле сразу при изменении (все поля уже touched)
      const error = validateSingleField(field, value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    },
    [validateSingleField],
  );

  // Обработчик потери фокуса
  const handleBlur = useCallback(
    (field: string) => {
      // Поле уже touched, просто валидируем
      const error = validateSingleField(field, formData[field] || '');
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    },
    [formData, validateSingleField],
  );

  // Сброс формы
  const resetForm = useCallback((newValues: Record<string, string> = {}) => {
    setFormData(newValues);
    setErrors({});
    // При сбросе все поля остаются touched для немедленной валидации
  }, []);

  // Установка ошибки вручную
  const setError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  // Очистка всех ошибок
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Получение статуса поля
  const getFieldStatus = (field: string): 'default' | 'error' | 'success' => {
    return errors[field] ? 'error' : 'success';
  };

  return {
    formData,
    errors,
    touched,
    validate,
    validateSingleField,
    handleChange,
    handleBlur,
    resetForm,
    setError,
    clearErrors,
    getFieldStatus,
    setFormData,
    isFormValid: Object.keys(errors).length === 0,
  };
};
