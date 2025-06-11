'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


interface Question {
    id: string;
    text: string;
}

interface Survey {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    team_member_email: string;
    manager_id: string;
    created_at: string;
}

export default function PendingSurveys() {
    const [surveys, setSurveys] = useState<Survey[]>([]);

    const [currentUserRole, setCurrentUserRole] = useState<number | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                setCurrentUserId(data.user?.id as string)
                setCurrentUserEmail(data.user?.email as string)

            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        getUser();
    }, [supabase]);

    useEffect(() => {
        if (currentUserId) {
            const getUserRole = async () => {
                const { data, error } = await supabase.from('profiles').select('role_id').eq('id', currentUserId).single();
                setCurrentUserRole(data?.role_id as number)
            }
            getUserRole();
        }
    }, [currentUserId])

    useEffect(() => {
        if (currentUserRole === null) return;
        if (currentUserRole === 1) {
            const getSurveys = async () => {
                const { data, error } = await supabase.from('surveys').select('*').eq('responded', false)

                setSurveys(data || [])
            }
            getSurveys();

        }
        else {
            const getSurveys = async () => {
                const { data, error } = await supabase.from('surveys').select('*').eq('responded', false).eq('team_member_email', currentUserEmail)

                setSurveys(data || [])
            }
            getSurveys();
        }
    }, [currentUserId, currentUserRole, currentUserEmail])

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">
                {currentUserRole === 1 ? 'Pending Surveys Overview' : 'Surveys Awaiting Your Response'}
            </h1>

            {surveys.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-600">No pending surveys at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {surveys.map((survey) => (
                        <Card key={survey.id}>
                            <CardHeader>
                                <CardTitle>{survey.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 h-full">
                                <p className="text-gray-600">{survey.description}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-600">{survey.team_member_email}</p>
                                    {
                                        survey.team_member_email === currentUserEmail &&
                                        <Link href={`/dashboard/pending/${survey.id}`}>
                                            <Button>
                                                Respond to Survey
                                            </Button>
                                        </Link>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}