export type IFormField = { type: string; question: string; required: boolean };

export type IForm = {
  id?: string;
  name: string;
  fields: Record<string, IFormField>;
};
