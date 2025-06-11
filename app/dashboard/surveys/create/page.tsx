'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { UserAutocomplete } from '@/app/components/ui/UserAutocomplete';
import { v4 as uuidv4 } from 'uuid';

export default function CreateSurveyPage() {
    const [title, setTitle] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<{
        id: string;
        email: string;
        full_name?: string;
    }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState<string[]>(['']);
    const router = useRouter();

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/auth/login');
                    return;
                }

                // Get user's role from profiles table
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role_id')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;

                // Get role name from roles table
                const { data: role, error: roleError } = await supabase
                    .from('roles')
                    .select('name')
                    .eq('id', profile.role_id)
                    .single();

                if (roleError) throw roleError;

                // Redirect if user is not a manager
                if (role.name !== 'manager') {
                    router.push('/dashboard');
                    return;
                }

                setLoading(false);
            } catch (error) {
                console.error('Error checking user role:', error);
                router.push('/dashboard');
            }
        };

        checkUserRole();
    }, [router]);

    const handleQuestionChange = (index: number, value: string) => {
        const updated = [...questions];
        updated[index] = value;
        setQuestions(updated);
    };

    const addQuestion = () => setQuestions([...questions, '']);
    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw userError || new Error('User not found');

            // Insert survey with manager_id and title only
            const { data: survey, error: surveyError } = await supabase
                .from('surveys')
                .insert({ manager_id: user.id, title })
                .select()
                .single();
            if (surveyError) throw surveyError;

            // Create invites for each team member
            const invites = selectedUsers.map(member => ({
                survey_id: survey.id,
                team_member_name: member.full_name || member.email,
                team_member_email: member.email,
                invite_token: uuidv4(),
            }));
            const { error: invitesError } = await supabase
                .from('survey_invites')
                .insert(invites);
            if (invitesError) throw invitesError;

            // Send emails with unique links
            await fetch('/api/send-invites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invites }),
            });

            router.push(`/dashboard/survey/${survey.id}/created`);
        } catch (err: any) {
            setError(err.message || 'Failed to create survey');
        } finally {
            setLoading(false);
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

        <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Create Survey</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Survey Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    placeholder="Enter survey title"
                />
                <UserAutocomplete
                    label="Send to Users"
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    multiple
                />
                <div>
                    <label className="block font-medium mb-1">Questions</label>
                    {questions.map((q, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={q}
                                onChange={e => handleQuestionChange(idx, e.target.value)}
                                className="flex-1 border rounded px-2 py-1"
                                placeholder={`Question ${idx + 1}`}
                                required
                            />
                            {questions.length > 1 && (
                                <button type="button" onClick={() => removeQuestion(idx)} className="ml-2 text-red-500">Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addQuestion} className="mt-2 text-indigo-600">+ Add Question</button>
                </div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <Button type="submit" isLoading={loading} fullWidth>
                    Create Survey
                </Button>
            </form>
        </div>

    );
} 