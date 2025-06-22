import React, { useState } from 'react';
import { BlockProps } from '../../types';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import clsx from 'clsx';

type FieldType = 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';

interface Field {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  options?: { label: string; value: string }[]; // for select/radio
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
}

interface SubmitButton {
  text: string;
  variant?: 'primary' | 'secondary';
}

export interface FormBlockProps extends BlockProps {
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
  submitButton?: SubmitButton;
}

export const FormBlock: React.FC<FormBlockProps> = ({
  id,
  className,
  fields,
  onSubmit,
  submitButton = { text: 'Submit', variant: 'primary' },
  ...props
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.id];

      if (field.required && !value) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (field.validation?.pattern && value && !field.validation.pattern.test(value)) {
        newErrors[field.id] = field.validation.message || `${field.label} is invalid`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id={id}
      className={clsx('space-y-4', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1">
          <label htmlFor={field.id} className="font-medium">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              required={field.required}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="border rounded p-2"
            />
          ) : field.type === 'select' ? (
            <select
              id={field.id}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="border rounded p-2"
              defaultValue=""
            >
              <option disabled value="">-- Select --</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === 'checkbox' || field.type === 'radio' ? (
            <div className="flex flex-wrap gap-3">
              {field.options?.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2">
                  <input
                    type={field.type}
                    name={field.id}
                    value={opt.value}
                    onChange={(e) =>
                      handleChange(field.id, field.type === 'checkbox'
                        ? { ...(formData[field.id] || {}), [opt.value]: e.target.checked }
                        : opt.value)
                    }
                    checked={
                      field.type === 'checkbox'
                        ? formData[field.id]?.[opt.value] || false
                        : formData[field.id] === opt.value
                    }
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          ) : (
            <input
              id={field.id}
              type={field.type}
              required={field.required}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="border rounded p-2"
            />
          )}

          {errors[field.id] && (
            <Text size="sm" color="destructive">
              {errors[field.id]}
            </Text>
          )}
        </div>
      ))}

      <Button type="submit" variant={submitButton.variant} disabled={loading}>
        {loading ? 'Submitting...' : submitButton.text}
      </Button>
    </form>
  );
};
