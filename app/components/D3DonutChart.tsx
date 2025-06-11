import React from 'react';

interface D3DonutChartProps {
    value: number;
    total: number;
    label?: string;
    size?: number;
}

export default function D3DonutChart({ value, total, label = '', size = 160 }: D3DonutChartProps) {
    const radius = size / 2;
    const stroke = 24;
    const normalizedValue = total > 0 ? value / total : 0;
    const circumference = 2 * Math.PI * (radius - stroke / 2);
    const offset = circumference * (1 - normalizedValue);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
            <circle
                cx={radius}
                cy={radius}
                r={radius - stroke / 2}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={stroke}
            />
            <circle
                cx={radius}
                cy={radius}
                r={radius - stroke / 2}
                fill="none"
                stroke="#4f46e5"
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s' }}
            />
            <text
                x={radius}
                y={radius}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size / 6}
                fontWeight="bold"
                fill="#111827"
            >
                {total > 0 ? `${Math.round(normalizedValue * 100)}%` : 'N/A'}
            </text>
            {label && (
                <text
                    x={radius}
                    y={radius + size / 5}
                    textAnchor="middle"
                    fontSize={size / 8}
                    fill="#6b7280"
                >
                    {label}
                </text>
            )}
        </svg>
    );
} 