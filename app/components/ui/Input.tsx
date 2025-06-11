import { InputHTMLAttributes } from 'react';
import { cn } from "@/lib/utils";

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
    const baseStyles = 'block w-full rounded-md border bg-white px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';
    const errorStyles = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300';

    return (
        <div className={cn(fullWidth && "w-full")}>
            {label && (
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                className={cn(baseStyles, errorStyles, className)}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
} 