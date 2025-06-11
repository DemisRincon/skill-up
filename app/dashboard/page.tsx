'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isManager, setIsManager] = useState(false);
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

                // Get user's role
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role_id')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;

                const { data: role, error: roleError } = await supabase
                    .from('roles')
                    .select('name')
                    .eq('id', profile.role_id)
                    .single();

                if (roleError) throw roleError;

                setIsManager(role.name === 'manager');
            } catch (error: unknown) {
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
        <div className="px-4 py-6 sm:px-0">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to Skill Up Leader</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-600">
                        This is where you&apos;ll manage your surveys and team members.
                    </p>
                    <div className="text-gray-700">
                        <span className="font-semibold">Logged in as:</span> {user?.user_metadata?.name || user?.email}
                    </div>
                    <div className="space-y-4">
                        <Button onClick={handleSignOut} variant="secondary" fullWidth>
                            Sign Out
                        </Button>
                        {isManager && (
                            <Button onClick={() => router.push('/dashboard/surveys/create')} fullWidth>
                                Create Survey
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 