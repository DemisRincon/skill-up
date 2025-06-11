'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { DashboardLayout } from '@/app/components/layouts/DashboardLayout';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/auth/login');
                    return;
                }
                setUser(user);
            } catch (error) {
                console.error('Error loading user:', error);
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [router]);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/auth/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="px-4 py-6 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                    <h2 className="text-2xl font-bold mb-4">Welcome to Skill Up Leader</h2>
                    <p className="text-gray-600 mb-2">
                        This is where you'll manage your surveys and team members.
                    </p>
                    <div className="mt-4 text-gray-700">
                        <span className="font-semibold">Logged in as:</span> {user?.user_metadata?.name || user?.email}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 