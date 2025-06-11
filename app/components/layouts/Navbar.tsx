'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function Navbar() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/auth/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-indigo-600">
                            Skill Up Leader
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleSignOut}
                            className="ml-4 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 