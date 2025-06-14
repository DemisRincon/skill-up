'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { UserAutocomplete } from '@/app/components/ui/UserAutocomplete';
import { Button } from '@/components/ui/button';

export default function CreateSurveyPage() {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState(['', '', '']);
    const [selectedUsers, setSelectedUsers] = useState<{ id: string; email: string; full_name?: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate required fields
        if (!title.trim()) {
            setError('Please enter a survey title');
            setLoading(false);
            return;
        }

        // Ensure all 3 questions are filled
        if (questions.some(q => q.trim() === '')) {
            setError('Please fill in all 3 questions.');
            setLoading(false);
            return;
        }

        // Ensure at least one team member is selected
        if (selectedUsers.length === 0) {
            setError('Please select at least one team member');
            setLoading(false);
            return;
        }

        const batchId = crypto.randomUUID();
        try {
            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error('No user found');

            // Debug log to check selected users
            console.log('Selected users:', selectedUsers);

            // Create a survey for each selected user
            const surveysToInsert = selectedUsers
                .filter(member => {
                    if (!member.email) {
                        console.error('User without email found:', member);
                        return false;
                    }
                    return true;
                })
                .map(member => ({
                    title,
                    manager_id: user.id,
                    questions: questions,
                    team_member_email: member.email,
                    responded: false,
                    batch_id: batchId,
                    created_at: new Date().toISOString()
                }));

            // Debug log to check surveys to insert
            console.log('Surveys to insert:', surveysToInsert);

            // Check if we have any valid surveys to insert
            if (surveysToInsert.length === 0) {
                throw new Error('No valid team members selected. Please ensure all selected members have email addresses.');
            }

            const { error: surveyError } = await supabase
                .from('surveys')
                .insert(surveysToInsert);

            if (surveyError) {
                console.error('Survey creation error:', surveyError);
                throw new Error(surveyError.message);
            }

            router.push('/dashboard/survey');
        } catch (err) {
            console.error('Error creating survey:', err);
            setError(err instanceof Error ? err.message : 'Failed to create survey');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Create New Survey</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <Label htmlFor="title">Survey Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter survey title"
                        required
                    />
                </div>

                <div className="space-y-4">
                    <Label>Questions (exactly 3 required)</Label>
                    {[0, 1, 2].map((index) => (
                        <Input
                            key={index}
                            value={questions[index]}
                            onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[index] = e.target.value;
                                setQuestions(newQuestions);
                            }}
                            placeholder={`Question ${index + 1}`}
                            required
                        />
                    ))}
                </div>

                <div className="space-y-4">
                    <UserAutocomplete
                        label="Team Members"
                        selectedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                        multiple
                    />
                </div>

                {error && (
                    <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                <Button
                    type="submit"
                    isLoading={loading}
                    fullWidth
                >
                    Create Survey
                </Button>
            </form>
        </div>
    );
} 