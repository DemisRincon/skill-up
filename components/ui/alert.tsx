import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive'
}

export function Alert({ className = '', variant = 'default', ...props }: AlertProps) {
    const variants = {
        default: "bg-white border-gray-200 text-gray-900",
        destructive: "bg-red-50 border-red-200 text-red-900"
    }

    return (
        <div
            role="alert"
            className={cn(
                "relative w-full rounded-lg border p-4",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}

export function AlertTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h5
            className={cn(
                "mb-1 font-medium leading-none tracking-tight",
                className
            )}
            {...props}
        />
    )
}

export function AlertDescription({ className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <div
            className={cn(
                "text-sm [&_p]:leading-relaxed",
                className
            )}
            {...props}
        />
    )
} 