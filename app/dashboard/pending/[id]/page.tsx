"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Survey {
    id: string;
    title: string;
    description: string;
    questions: string[];
    team_member_email: string;
    manager_id: string;
    created_at: string;
}

export default function RespondSurveyPage() {
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const supabase = createClientComponentClient();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const { id } = params as { id: string };
    useEffect(() => {
        const fetchSurvey = async () => {
            setLoading(true);
            setError(null);
            console.log(id)
            // Fetch survey only
            const { data: surveyData, error: surveyError } = await supabase
                .from('surveys')
                .select('*')
                .eq('id', id)
                .single();
            console.log(surveyData)
            if (surveyError) {
                setError('Error fetching survey: ' + surveyError.message);
                setLoading(false);
                return;
            }

            setSurvey(surveyData);
            setLoading(false);
        };
        fetchSurvey();
        // Fetch user email
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserEmail(user.email ?? null);
        };
        fetchUser();
    }, [params, supabase]);

    const handleAnswerChange = (index: number, value: number) => {
        setAnswers(prev => ({ ...prev, [index]: value }));
    };


    console.log(answers)

    const handleSubmit = async () => {
        try {
            if (!survey) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('You must be logged in to submit responses');
                return;
            }

            if (survey.team_member_email !== user.email) {
                setError('You can only respond to surveys assigned to you');
                return;
            }

            if (Object.keys(answers).length !== survey.questions?.length) {
                setError('Please answer all questions');
                return;
            }

            const { error: updateError } = await supabase
                .from('surveys')
                .update({
                    a1: answers[0],
                    a2: answers[1],
                    a3: answers[2],
                    responded: true,

                })
                .eq('id', id);

            if (updateError) {
                throw updateError;
            }

            // Success - redirect to pending surveys
            router.push('/dashboard/pending');
        } catch (error) {
            console.error('Error submitting survey:', error);
            setError('Failed to submit survey responses. Please try again.');
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }
    if (error) {
        return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
    }
    if (!survey) {
        return <div className="p-8">Survey not found.</div>;
    }
    return (
        <div className="max-w-xl mx-auto p-8">
            {/* DEBUG INFO */}
            <div className="text-xs text-gray-400 mb-2">
                <div>Current user email: {userEmail}</div>
                <div>Survey assigned to: {survey.team_member_email}</div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{survey.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-600">{survey.description}</p>
                    {survey.questions?.map((question, index) => (
                        <div key={index} className="space-y-4">
                            <Label>{question}</Label>
                            <RadioGroup className="flex flex-row gap-2 ">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <RadioGroupItem
                                        key={rating}
                                        label={rating.toString()}
                                        name={`question-${index}`}
                                        value={rating.toString()}
                                        checked={answers[index] === rating}
                                        onChange={() => handleAnswerChange(index, rating)}
                                    />
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length !== survey.questions?.length}
                    >
                        Submit Responses
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
} 