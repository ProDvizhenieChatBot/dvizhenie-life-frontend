// Типы для валидации
export interface ValidationRule {
  validator: (value: string) => string | null;
  message?: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export interface ValidationErrors {
  [field: string]: string;
}

// Базовые правила валидации
export const validationRules = {
  required: (message: string = 'Это поле обязательно для заполнения'): ValidationRule => ({
    validator: (value: string) => (value.trim() ? null : message),
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value: string) =>
      value.length >= min ? null : message || `Минимальная длина: ${min} символов`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value: string) =>
      value.length <= max ? null : message || `Максимальная длина: ${max} символов`,
  }),

  email: (message: string = 'Введите корректный email адрес'): ValidationRule => ({
    validator: (value: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : message),
  }),

  username: (
    message: string = 'Логин может содержать только латинские буквы, цифры и нижнее подчеркивание',
  ): ValidationRule => ({
    validator: (value: string) => (/^[a-zA-Z0-9_]+$/.test(value) ? null : message),
  }),

  phone: (message: string = 'Введите корректный номер телефона'): ValidationRule => ({
    validator: (value: string) => (/^\+?[\d\s\-()]+$/.test(value) ? null : message),
  }),
  numeric: (message: string = 'Поле должно содержать только цифры'): ValidationRule => ({
    validator: (value: string) => (/^\d+$/.test(value) ? null : message),
  }),

  custom: (validator: (value: string) => boolean, message: string): ValidationRule => ({
    validator: (value: string) => (validator(value) ? null : message),
  }),
};

// Схемы валидации для разных форм
export const validationSchemas = {
  login: {
    username: [
      validationRules.required('Логин обязателен для заполнения'),
      validationRules.minLength(3, 'Логин должен содержать минимум 3 символа'),
      validationRules.username(),
    ],
    password: [
      validationRules.required('Пароль обязателен для заполнения'),
      validationRules.minLength(6, 'Пароль должен содержать минимум 6 символов'),
    ],
  },

  application: {
    name: [
      validationRules.required('Имя обязательно для заполнения'),
      validationRules.minLength(2, 'Имя должно содержать минимум 2 символа'),
      validationRules.maxLength(50, 'Имя должно содержать не более 50 символов'),
    ],
    email: [validationRules.required('Email обязателен для заполнения'), validationRules.email()],
    phone: [
      validationRules.required('Телефон обязателен для заполнения'),
      validationRules.phone(),
      validationRules.minLength(10, 'Телефон должен содержать минимум 10 цифр'),
    ],
    age: [
      validationRules.required('Возраст обязателен для заполнения'),
      validationRules.numeric('Возраст должен быть числом'),
      validationRules.custom(
        (value) => parseInt(value) >= 0 && parseInt(value) <= 120,
        'Возраст должен быть от 0 до 120 лет',
      ),
    ],
  },

  settings: {
    email: [validationRules.required('Email обязателен'), validationRules.email()],
    currentPassword: [validationRules.required('Текущий пароль обязателен')],
    newPassword: [validationRules.minLength(8, 'Новый пароль должен содержать минимум 8 символов')],
  },
};

// Функция валидации поля
export const validateField = (value: string, rules: ValidationRule[]): string => {
  for (const rule of rules) {
    const error = rule.validator(value);
    if (error) return error;
  }
  return '';
};

// Функция валидации формы
export const validateForm = (
  formData: Record<string, string>,
  schema: ValidationSchema,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(schema).forEach((field) => {
    const value = formData[field] || '';
    const fieldRules = schema[field];
    const error = validateField(value, fieldRules);

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Хелпер для проверки валидности формы
export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};
