'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'}`}>
            <button
                className="p-2 focus:outline-none hover:bg-gray-700"
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Toggle sidebar"
            >
                {collapsed ? '☰' : '⮜'}
            </button>
            <nav className="flex-1 mt-4">
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-700 rounded">
                            <span className={collapsed ? 'hidden' : ''}>Dashboard</span>
                            <span className={collapsed ? '' : 'hidden'}>🏠</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/surveys/create" className="block px-4 py-2 hover:bg-gray-700 rounded">
                            <span className={collapsed ? 'hidden' : ''}>Create Survey</span>
                            <span className={collapsed ? '' : 'hidden'}>➕</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/survey" className="block px-4 py-2 hover:bg-gray-700 rounded">
                            <span className={collapsed ? 'hidden' : ''}>All Surveys</span>
                            <span className={collapsed ? '' : 'hidden'}>📋</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
} 