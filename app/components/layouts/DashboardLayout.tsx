'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import Sidebar from '@/app/components/layouts/Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex min-h-[calc(100vh-64px)]">
                <Sidebar />
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 