"use client"; // Required for components with hooks

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FormDefinition, FormStepDefinition, FormFieldDefinition, FormFieldType, FormFieldOption } from '@/interfaces/forms';

// Placeholder imports for UI components - assume these are ShadCN/UI or similar
// Actual imports might differ based on the library's structure.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// For Select, RadioGroup, Checkbox, Textarea, we'll use basic HTML for now if specific
// ShadCN/UI components are not readily available or their API is complex for this initial setup.
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Example
import { Textarea } from "@/components/ui/textarea"; // Assuming this exists
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Example
// import { Checkbox } from "@/components/ui/checkbox"; // Example

interface MultiStepLeadFormProps {
  formDefinition: FormDefinition;
  onSubmit: (formData: any) => void;
}

const MultiStepLeadForm: React.FC<MultiStepLeadFormProps> = ({ formDefinition, onSubmit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<{[key: string]: any}>({});

  const currentStep: FormStepDefinition = formDefinition.steps[currentStepIndex];
  const isLastStep = currentStepIndex === formDefinition.steps.length - 1;

  // Initialize formData with defaultValues from formDefinition
  useEffect(() => {
    const initialData: {[key: string]: any} = {};
    formDefinition.steps.forEach(step => {
      step.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.name] = field.defaultValue;
        }
      });
    });
    setFormData(initialData);
  }, [formDefinition]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleNextStep = () => {
    // Basic validation sketch:
    // currentStep.fields.forEach(field => {
    //   if (field.validations?.required && !formData[field.name]) {
    //     alert(`${field.label} is required.`);
    //     // Prevent step change
    //     return;
    //   }
    // });
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Basic validation sketch for the whole form:
    // formDefinition.steps.forEach(step => {
    //   step.fields.forEach(field => {
    //     if (field.validations?.required && !formData[field.name]) {
    //       alert(`${field.label} is required from step ${step.title}.`);
    //       // Prevent submission
    //       return;
    //     }
    //   });
    // });
    console.log("Form submitted:", formData);
    onSubmit(formData);
  };
  
  const renderField = (field: FormFieldDefinition) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleInputChange(field.name, e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value),
      className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm " + (field.className || "")
    };

    // Conditional display logic
    if (field.conditionalDisplay) {
      const { fieldName, fieldValue } = field.conditionalDisplay;
      if (formData[fieldName] !== fieldValue) {
        return null; // Don't render if condition not met
      }
    }

    return (
      <div key={field.name} className="mb-4">
        <Label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</Label>
        {field.helperText && <p className="text-xs text-gray-500 mb-1">{field.helperText}</p>}
        
        {(() => {
          switch (field.type) {
            case FormFieldType.Text:
            case FormFieldType.Email:
            case FormFieldType.Tel:
            case FormFieldType.Number:
            case FormFieldType.Date: // Input component can handle date type
              return <Input type={field.type} placeholder={field.placeholder} {...commonProps} />;
            case FormFieldType.TextArea:
            case FormFieldType.Address: // Render Address as a Textarea for now
              return <Textarea placeholder={field.placeholder} {...commonProps} />;
            case FormFieldType.Select:
              return (
                <select {...commonProps} placeholder={field.placeholder || "Select an option"}>
                  {field.placeholder && <option value="" disabled>{field.placeholder}</option>}
                  {field.options?.map(opt => <option key={opt.value.toString()} value={opt.value}>{opt.label}</option>)}
                </select>
              );
            case FormFieldType.Radio:
              return (
                <div className="mt-2 space-y-2">
                  {field.options?.map(opt => (
                    <div key={opt.value.toString()} className="flex items-center">
                      <input 
                        type="radio" 
                        id={`${field.name}-${opt.value}`}
                        name={field.name} 
                        value={opt.value} 
                        checked={formData[field.name] === opt.value}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <Label htmlFor={`${field.name}-${opt.value}`} className="ml-2 block text-sm text-gray-900">{opt.label}</Label>
                    </div>
                  ))}
                </div>
              );
            case FormFieldType.Checkbox: // Basic checkbox, assumes single boolean value for now
              return (
                <div className="flex items-center mt-2">
                   <input 
                    type="checkbox" 
                    id={field.name}
                    name={field.name}
                    checked={!!formData[field.name]} // Ensure it's a boolean
                    onChange={(e) => handleInputChange(field.name, e.target.checked)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  {/* Checkbox usually has label on the right, or uses the main field label */}
                  {/* <Label htmlFor={field.name} className="ml-2 block text-sm text-gray-900">{field.label}</Label> */}
                </div>
              );
            // FileUpload, Address, Slider would require more complex components
            default:
              return <p className="text-red-500">Unsupported field type: {field.type}</p>;
          }
        })()}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
      <div>
        <h2 className="text-xl font-semibold">{currentStep.title}</h2>
        {currentStep.description && <p className="text-sm text-gray-600 mt-1">{currentStep.description}</p>}
      </div>

      <div className="mt-4">
        {currentStep.fields.map(field => renderField(field))}
      </div>

      <div className="mt-6 flex justify-between">
        {currentStepIndex > 0 && (
          <Button type="button" onClick={handlePreviousStep} variant="outline">
            Previous
          </Button>
        )}
        {!isLastStep ? (
          <Button type="button" onClick={handleNextStep} className="ml-auto"> 
            {/* Added ml-auto to push to right if no prev button */}
            Next
          </Button>
        ) : (
          <Button type="submit" className="ml-auto">
            Submit
          </Button>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Step {currentStepIndex + 1} of {formDefinition.steps.length}
      </div>
    </form>
  );
};

export default MultiStepLeadForm;
