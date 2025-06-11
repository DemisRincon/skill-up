'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserEmail(user.email);

            const { data: profile } = await supabase
                .from('profiles')
                .select('role_id')
                .eq('id', user.id)
                .single();

            if (!profile) return;

            const { data: role } = await supabase
                .from('roles')
                .select('name')
                .eq('id', profile.role_id)
                .single();

            if (role) {
                setUserRole(role.name);
            }
        };

        fetchUserRole();
    }, [supabase]);

    useEffect(() => {
        const fetchSurveys = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let query = supabase
                .from('surveys')
                .select('*')
                .eq('responded', false);

            if (userRole === 'manager') {
                // For managers, show surveys they created
                query = query.eq('manager_id', user.id);
            } else {
                // For team members, show surveys assigned to them
                query = query.eq('team_member_email', user.email);
            }

            const { data, error } = await query;

            if (error) {
                setError('Error fetching surveys: ' + error.message);
                console.error('Supabase error fetching surveys:', error);
                return;
            }

            setSurveys(data || []);
        };

        if (userRole) {
            fetchSurveys();
        }
    }, [supabase, userRole]);

    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async () => {
        if (!selectedSurvey) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Only allow team members to submit responses
        if (userRole !== 'team_member') {
            setError('Only team members can submit survey responses');
            return;
        }

        // Only allow responding to own surveys
        if (selectedSurvey.team_member_email !== user.email) {
            setError('You can only respond to surveys assigned to you');
            return;
        }

        const responses = Object.entries(answers).map(([questionId, rating]) => ({
            survey_id: selectedSurvey.id,
            question_id: questionId,
            rating,
            team_member_id: user.id
        }));

        const { error: responseError } = await supabase
            .from('survey_responses')
            .insert(responses);

        if (responseError) {
            setError('Error submitting responses');
            return;
        }

        // Mark survey as responded
        const { error: updateError } = await supabase
            .from('surveys')
            .update({ responded: true })
            .eq('id', selectedSurvey.id);

        if (updateError) {
            setError('Error updating survey status');
            return;
        }

        // Refresh the surveys list
        setSurveys(prev => prev.filter(s => s.id !== selectedSurvey.id));
        setSelectedSurvey(null);
        setAnswers({});
        setError(null);
    };



    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">
                {userRole === 'manager' ? 'Pending Surveys Overview' : 'Surveys Awaiting Your Response'}
            </h1>

            {/* DEBUG INFO */}
            <div className="text-xs text-gray-400">
                <div>Current user email: {userEmail}</div>
                <div>User role: {userRole}</div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6">
                {surveys.map((survey) => (
                    <Card key={survey.id}>
                        <CardHeader>
                            <CardTitle>{survey.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">{survey.description}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500">
                                    {userRole === 'manager'
                                        ? `Assigned to: ${survey.team_member_email}`
                                        : `Created: ${new Date(survey.created_at).toLocaleDateString()}`}
                                </p>
                                {/* DEBUG: Show team_member_email for each survey */}
                                <span className="text-xs text-blue-400">Survey assigned to: {survey.team_member_email}</span>
                                {/* Show button if current user is assigned to this survey */}
                                {userEmail === survey.team_member_email && (
                                    <a href={`/dashboard/pending/${survey.id}`}>
                                        <Button>
                                            Respond to Survey
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}