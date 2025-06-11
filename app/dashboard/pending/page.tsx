'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/app/components/ui/Button';

export default function PendingSurveysPage() {
    const [pendingSurveys, setPendingSurveys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string>('');
    const [managerUnanswered, setManagerUnanswered] = useState<any[]>([]);
    const [userRole, setUserRole] = useState<'manager' | 'team_member' | null>(null);
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        const fetchPendingSurveys = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) {
                    console.error('Error getting user:', userError);
                    throw new Error('Failed to get user information');
                }
                if (!user) {
                    router.push('/auth/login');
                    return;
                }
                setUserEmail(user.email ?? '');
                setUserId(user.id);

                // Get user's role
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
                if (!role) return;
                setUserRole(role.name as 'manager' | 'team_member');

                // Fetch pending surveys for this user
                const { data: surveys, error: surveysError } = await supabase
                    .from('surveys')
                    .select('*')
                    .eq('team_member_email', user.email)
                    .eq('responded', false);
                if (surveysError) {
                    console.error('Error getting surveys:', surveysError);
                    throw new Error('Failed to get surveys');
                }
                setPendingSurveys(surveys || []);

                // If manager, fetch unanswered by others
                if (role.name === 'manager') {
                    const { data: others, error: othersError } = await supabase
                        .from('surveys')
                        .select('*')
                        .eq('manager_id', user.id)
                        .eq('responded', false)
                        .neq('team_member_email', user.email);
                    if (othersError) {
                        console.error('Error getting manager unanswered:', othersError);
                        throw new Error('Failed to get manager unanswered surveys');
                    }
                    setManagerUnanswered(others || []);
                } else {
                    setManagerUnanswered([]);
                }
            } catch (err: unknown) {
                console.error('Error in fetchPendingSurveys:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch pending surveys');
            } finally {
                setLoading(false);
            }
        };
        fetchPendingSurveys();
    }, [router]);

    const handleAnswerChange = (questionIndex: number, value: number) => {
        setAnswers(prev => ({
            ...prev,
            [`a${questionIndex + 1}`]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSurvey) return;

        // Ensure exactly 3 questions
        if (!selectedSurvey.questions || selectedSurvey.questions.length !== 3) {
            setError('This survey does not have exactly 3 questions.');
            return;
        }

        // Ensure all answers are present and valid
        const a1 = answers['a1'];
        const a2 = answers['a2'];
        const a3 = answers['a3'];
        if (![a1, a2, a3].every(val => typeof val === 'number' && val >= 1 && val <= 5)) {
            setError('Please answer all questions with a value from 1 to 5.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Log selectedSurvey.id and pending survey IDs
            console.log('Attempting to update survey with id:', selectedSurvey.id);
            console.log('Current pending survey IDs:', pendingSurveys.map(s => s.id));

            // Update survey as responded and save answers
            const { data: updateData, error: updateError } = await supabase
                .from('surveys')
                .update({
                    responded: true,
                    a1,
                    a2,
                    a3
                })
                .eq('id', selectedSurvey.id)
                .select();

            console.log('Survey update result:', { updateData, updateError });

            if (updateError) {
                console.error('Error updating survey:', updateError);
                setError('Failed to save survey response: ' + updateError.message);
                return;
            }
            if (!updateData || updateData.length === 0) {
                setError('No survey was updated.');
                return;
            }

            // Update local state
            setPendingSurveys(prev =>
                prev.filter(survey => survey.id !== selectedSurvey.id)
            );
            setSelectedSurvey(null);
            setAnswers({});
        } catch (err: unknown) {
            console.error('Error in handleSubmit:', err);
            setError(err instanceof Error ? err.message : 'Failed to submit response');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Pending Surveys</h1>
            {error ? (
                <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                </div>
            ) : (
                <>
                    {/* Section: Pending for current user */}
                    {pendingSurveys.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-xl font-semibold mb-4">Surveys Awaiting Your Response</h2>
                            {selectedSurvey && selectedSurvey.responded ? (
                                <div className="bg-white p-6 rounded-lg shadow text-green-700 text-lg font-semibold">
                                    You have already responded to this survey.
                                </div>
                            ) : selectedSurvey ? (
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-lg font-semibold">{selectedSurvey.title}</h3>
                                            <p className="text-gray-600">
                                                Created: {new Date(selectedSurvey.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                setSelectedSurvey(null);
                                                setAnswers({});
                                            }}
                                            variant="secondary"
                                        >
                                            Back to List
                                        </Button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {selectedSurvey.questions.map((question: string, index: number) => (
                                            <div key={index} className="space-y-2">
                                                <label className="block font-medium">
                                                    {index + 1}. {question}
                                                </label>
                                                <div className="flex gap-4">
                                                    {[1, 2, 3, 4, 5].map((value) => (
                                                        <label key={value} className="flex items-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                name={`a${index + 1}`}
                                                                value={value}
                                                                checked={answers[`a${index + 1}`] === value}
                                                                onChange={() => handleAnswerChange(index, value)}
                                                                required
                                                                className="form-radio"
                                                            />
                                                            <span>{value}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        {error && <div className="text-red-600 text-sm">{error}</div>}
                                        <Button
                                            type="submit"
                                            isLoading={submitting}
                                            fullWidth
                                        >
                                            Submit Response
                                        </Button>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingSurveys.map((survey) => (
                                        <div key={survey.id} className="bg-white p-6 rounded-lg shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-2">{survey.title}</h3>
                                                    <p className="text-gray-600">
                                                        Created: {new Date(survey.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() => setSelectedSurvey(survey)}
                                                >
                                                    Respond to Survey
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Section: Pending for manager (others to respond) */}
                    {userRole === 'manager' && managerUnanswered.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-xl font-semibold mb-4">Surveys Awaiting Team Responses</h2>
                            {/* Group by batch_id */}
                            {Object.values(managerUnanswered.reduce((acc, survey) => {
                                const batchId = survey.batch_id || survey.id;
                                if (!acc[batchId]) acc[batchId] = [];
                                acc[batchId].push(survey);
                                return acc;
                            }, {} as Record<string, any[]>)).map((value, i) => {
                                const batchSurveys = value as any[];
                                return (
                                    <div key={batchSurveys[0].batch_id || batchSurveys[0].id} className="bg-white p-6 rounded-lg shadow mb-4">
                                        <div className="font-semibold text-lg">{batchSurveys[0].title}</div>
                                        <div className="text-xs text-gray-500 mb-2">Created: {new Date(batchSurveys[0].created_at).toLocaleString()}</div>
                                        <div className="text-xs text-gray-500 mb-2">Applicants: {batchSurveys.length}</div>
                                        <div className="text-xs text-gray-500 mb-2">Unanswered: {batchSurveys.length}</div>
                                        <ul className="list-disc ml-6">
                                            {batchSurveys.map((s: any) => (
                                                <li key={s.id}>{s.team_member_email}</li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 