export interface ApiApplication {
  id: string;
  status: string;
  data?: {
    name?: string;
    age?: number;
    email?: string;
    phone?: string;
    answers?: {
      question1?: string;
      question2?: string;
      question3?: string;
      [key: string]: string | undefined;
    };

    personal_info?: {
      name?: string;
      age?: number;
      email?: string;
      phone?: string;
    };
  };
  created_at: string;
  files: string[];
  admin_comment?: string;
  telegram_id?: number | null;
}

export interface FileInfo {
  id: string;
  filename: string;
  original_filename: string;
  content_type: string;
  size: number;
  created_at: string;
}

export interface UiApplication {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  status: 'completed' | 'in_progress' | 'pending';
  answers: {
    question1: string;
    question2: string;
    question3: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationUpdate {
  status?: string;
  admin_comment?: string;
  data?: {
    name?: string;
    age?: number;
    email?: string;
    phone?: string;
    answers?: {
      question1?: string;
      question2?: string;
      question3?: string;
    };
  };
}

export interface ApplicationStatus {
  status: string;
}

export interface ApplicationPublic {
  id: string;
  status: string;
  data: Record<string, unknown>;
}

export interface FileLinkRequest {
  file_id: string;
  original_filename: string;
  form_field_id: string;
}

export interface FormSchema {
  start: string;
  steps: Array<{
    id: string;
    text: string;
    type: 'message' | 'buttons' | 'input' | 'date' | 'phone' | 'email' | 'link';
    options?: string[];
    next?: string | Record<string, string>;
    showIf?: string;
  }>;
}

export interface FormSchemaUpload {
  version: string;
  schema_data: FormSchema;
}

export interface SessionResponse {
  application_uuid: string;
}

export interface TelegramSessionRequest {
  telegram_id: number;
}

export interface ApiError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

// Тип для данных формы при обновлении
export interface ApplicationFormData {
  name: string;
  age: number;
  email: string;
  phone: string;
  answers: {
    question1: string;
    question2: string;
    question3: string;
  };
}
