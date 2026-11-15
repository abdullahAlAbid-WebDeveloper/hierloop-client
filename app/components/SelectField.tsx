"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

type SelectFieldProps = {
  id: string
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  description?: string
  required?: boolean
}

export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  description,
  required,
}: SelectFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </FieldLabel>

      <NativeSelect
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full [&_select]:h-10 [&_select]:rounded-xl"
      >
        {options.map((option) => (
          <NativeSelectOption key={option} value={option}>
            {option}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}
