import React from 'react';

interface TagInputProps {
    value?: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    suggestions?: string[];
    error?: string;
    label?: string;
    required?: boolean;
    helperText?: string;
}

const TagInput: React.FC<TagInputProps> = ({
    value = [],
    onChange,
    placeholder = "Nhập và nhấn Enter...",
    suggestions = [],
    error,
    label,
    required = false,
    helperText,
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="space-y-2">
                <div className={`flex flex-wrap gap-2 p-2 min-h-[42px] rounded-xl border bg-white dark:bg-gray-800 focus-within:border-brand-500 ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}>
                    {value.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                            {tag}
                            <button
                                type="button"
                                onClick={() => onChange(value.filter((_, i) => i !== index))}
                                className="ml-0.5 text-brand-600 hover:text-brand-800 dark:text-brand-400 focus:outline-none"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        placeholder={value.length === 0 ? placeholder : ""}
                        className="flex-1 min-w-[120px] bg-transparent text-sm focus:outline-none dark:text-white"
                        list={suggestions.length > 0 ? "tag-input-suggestions" : undefined}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.currentTarget;
                                const val = input.value.trim();
                                if (val && !value.includes(val)) {
                                    onChange([...value, val]);
                                    input.value = '';
                                }
                            }
                        }}
                    />
                    {suggestions.length > 0 && (
                        <datalist id="tag-input-suggestions">
                            {suggestions.map((s, i) => (
                                <option key={i} value={s} />
                            ))}
                        </datalist>
                    )}
                </div>
                {(error || helperText) && (
                    <p className={`text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TagInput;
