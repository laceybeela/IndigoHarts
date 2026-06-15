'use client';

import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from './input';
import { Select } from './select';
import { Textarea } from './textarea';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  options = [],
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        if (type === 'select') {
          return (
            <Select
              label={label}
              error={error?.message}
              options={options}
              placeholder={placeholder}
              id={name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          );
        }

        if (type === 'textarea') {
          return (
            <Textarea
              label={label}
              error={error?.message}
              placeholder={placeholder}
              id={name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          );
        }

        return (
          <Input
            label={label}
            error={error?.message}
            type={type}
            placeholder={placeholder}
            id={name}
            value={field.value ?? ''}
            onChange={(e) => {
              if (type === 'number') {
                field.onChange(e.target.value === '' ? '' : Number(e.target.value));
              } else {
                field.onChange(e.target.value);
              }
            }}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        );
      }}
    />
  );
}
