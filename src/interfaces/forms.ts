export enum FormFieldType {
  Text = "text", Email = "email", Tel = "tel", Number = "number",
  TextArea = "textarea", Select = "select", Radio = "radio",
  Checkbox = "checkbox", Date = "date", FileUpload = "file",
  Address = "address", Slider = "slider",
}

export interface FormFieldValidation {
  required?: boolean; minLength?: number; maxLength?: number;
  pattern?: string; min?: number; max?: number;
  fileTypes?: string[]; maxFileSize?: number;
}

export interface FormFieldOption {
  value: string | number; label: string;
}

export interface FormFieldDefinition {
  name: string; label: string; type: FormFieldType;
  placeholder?: string; defaultValue?: any; options?: FormFieldOption[];
  validations?: FormFieldValidation;
  conditionalDisplay?: { fieldName: string; fieldValue: any; };
  className?: string; helperText?: string;
}

export interface FormStepDefinition {
  title: string; description?: string; fields: FormFieldDefinition[];
}

export interface FormDefinition {
  id: string; nicheName: string; title: string;
  description?: string; steps: FormStepDefinition[];
}

export interface LeadSubmission {
  id?: string; formId: string; nicheName: string; submissionDate: Date;
  submittedData: { [stepTitle: string]: { [fieldName: string]: any; }; };
  ipAddress?: string; userAgent?: string; pageUrl?: string;
}
