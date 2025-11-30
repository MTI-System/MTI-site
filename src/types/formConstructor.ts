export type FormField = {
  title: string;
  type: string;
  metadata: {
    "key": string,
    "value": string
  }[]
}

export type FormConstructorResponse = {
  formId: number; // это id турнира
  formType: string; // это тип
  fields: FormField[];
  token: string;
}