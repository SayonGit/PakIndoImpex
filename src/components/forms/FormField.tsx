import { useId, type ReactNode, type SelectHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

const fieldClasses =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-all duration-200 focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100 aria-invalid:border-secondary-600 aria-invalid:focus:ring-secondary-100";

function FieldWrapper({
  label,
  required,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink-800">
        {label}
        {required && (
          <span className="ml-0.5 text-secondary-600" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-secondary-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  name,
  required,
  error,
  className,
  ...rest
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "id" | "className">) {
  const id = useId();
  return (
    <FieldWrapper label={label} required={required} error={error} htmlFor={id} className={className}>
      <input
        id={id}
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        className={fieldClasses}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function TextAreaField({
  label,
  name,
  required,
  error,
  className,
  ...rest
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  className?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "id" | "className">) {
  const id = useId();
  return (
    <FieldWrapper label={label} required={required} error={error} htmlFor={id} className={className}>
      <textarea
        id={id}
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        rows={5}
        className={clsx(fieldClasses, "resize-y")}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function SelectField({
  label,
  name,
  required,
  error,
  options,
  placeholder,
  className,
  ...rest
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  options: string[];
  placeholder?: string;
  className?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "name" | "id" | "className">) {
  const id = useId();
  return (
    <FieldWrapper label={label} required={required} error={error} htmlFor={id} className={className}>
      <select
        id={id}
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        defaultValue=""
        className={fieldClasses}
        {...rest}
      >
        <option value="" disabled>
          {placeholder ?? "Select..."}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
