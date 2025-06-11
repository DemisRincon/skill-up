import * as React from "react"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> { }

export function RadioGroup({ className = '', ...props }: RadioGroupProps) {
    return (
        <div className={`grid gap-2 ${className}`} {...props} />
    )
}

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
}

export function RadioGroupItem({ className = '', label, ...props }: RadioGroupItemProps) {
    return (
        <label className="flex items-center space-x-2">
            <input
                type="radio"
                className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
                {...props}
            />
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
    )
} 