'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(true);

    const [userRole, setUserRole] = useState<'manager' | 'team_member' | null>(null);

    useEffect(() => {
        const fetchPendingCount = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Get user's role
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role_id')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    return;
                }

                if (!profile) {
                    console.log('No profile found for user:', user.id);
                    return;
                }

                const { data: role, error: roleError } = await supabase
                    .from('roles')
                    .select('name')
                    .eq('id', profile.role_id)
                    .single();

                if (roleError) {
                    console.error('Error fetching role:', roleError);
                    return;
                }

                if (!role) {
                    console.log('No role found for profile:', profile.role_id);
                    return;
                }

                setUserRole(role.name as 'manager' | 'team_member');

            } catch (error) {
                console.error('Error fetching pending count:', error);
            }
        };

        fetchPendingCount();
        // Set up real-time subscription for pending surveys
        const channel = supabase
            .channel('pending_surveys')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'surveys' },
                () => fetchPendingCount()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

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
                    {userRole === 'manager' && (
                        <li>
                            <Link href="/dashboard/surveys/create" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                <span className={collapsed ? 'hidden' : ''}>Create Survey</span>
                                <span className={collapsed ? '' : 'hidden'}>➕</span>
                            </Link>
                        </li>
                    )}
                    {userRole === 'manager' && (
                        <li>
                            <Link href="/dashboard/survey" className="block px-4 py-2 hover:bg-gray-700 rounded">
                                <span className={collapsed ? 'hidden' : ''}>My Surveys</span>
                                <span className={collapsed ? '' : 'hidden'}>📋</span>
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link href="/dashboard/pending" className="block px-4 py-2 hover:bg-gray-700 rounded relative">
                            <span className={collapsed ? 'hidden' : ''}>
                                {userRole === 'manager' ? 'Pending Responses' : 'Pending Surveys'}

                            </span>
                            <span className={collapsed ? '' : 'hidden'}>
                                🔔

                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
} 