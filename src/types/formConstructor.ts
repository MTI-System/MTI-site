export type FormField = {
  title: string;
  type: string;
  metadata: string[]
}

export type FormConstructorResponse = {
  formId: number; // это id турнира
  formType: number; // это id типа
}