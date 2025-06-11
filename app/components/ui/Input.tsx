import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export function Input({
    label,
    error,
    fullWidth = true,
    className = '',
    ...props
}: InputProps) {
    const baseStyles = 'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm';
    const errorStyles = error ? 'border-red-300' : 'border-gray-300';
    const widthClass = fullWidth ? 'w-full' : '';
    const roundedStyles = props.type === 'password' ? 'rounded-b-md' : 'rounded-md';

    return (
        <div className={widthClass}>
            {label && (
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`${baseStyles} ${errorStyles} ${roundedStyles} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
} 