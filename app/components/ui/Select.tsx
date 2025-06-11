import { SelectHTMLAttributes } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Option[];
    error?: string;
    fullWidth?: boolean;
}

export function Select({
    label,
    options,
    error,
    fullWidth = true,
    className = '',
    ...props
}: SelectProps) {
    const baseStyles = 'block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
    const errorStyles = error ? 'border-red-300' : 'border-gray-300';
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <div className={widthClass}>
            {label && (
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <select
                className={`${baseStyles} ${errorStyles} ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
} 