import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function RadioGroup({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("space-y-4", className)} {...props} />
    )
}

export function RadioGroupItem({ className = '', label, ...props }: RadioGroupItemProps) {
    return (
        <label className="flex items-center space-x-2">
            <input
                type="radio"
                className={cn(
                    "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500",
                    className
                )}
                {...props}
            />
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
    )
} 