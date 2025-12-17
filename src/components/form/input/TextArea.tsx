import React from "react";

interface TextareaProps {
  placeholder?: string;
  rows?: number;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

// Use React.forwardRef to allow ref passing for react-hook-form
const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  placeholder = "Enter your message", // Default placeholder
  rows = 3, // Default number of rows
  value, // Current value
  onChange, // Callback for changes
  onBlur,
  name,
  id,
  className = "", // Additional custom styles
  disabled = false, // Disabled state
  error = false, // Error state
  hint = "", // Default hint text
}, ref) => {
  let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className}`;

  if (disabled) {
    textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textareaClasses += ` bg-transparent text-gray-400 border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800`;
  } else {
    textareaClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      <textarea
        ref={ref}
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={textareaClasses}
      />
      {hint && (
        <p
          className={`mt-2 text-sm ${error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
            }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = "TextArea";

export default TextArea;
