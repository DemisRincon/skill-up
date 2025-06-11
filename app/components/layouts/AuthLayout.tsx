import { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: {
        text: string;
        linkText: string;
        linkHref: string;
    };
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {subtitle.text}{' '}
                        <Link href={subtitle.linkHref} className="font-medium text-indigo-600 hover:text-indigo-500">
                            {subtitle.linkText}
                        </Link>
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
} 