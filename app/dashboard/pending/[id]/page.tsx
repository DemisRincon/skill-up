"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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

export default function RespondSurveyPage() {
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const supabase = createClientComponentClient();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchSurvey = async () => {
            setLoading(true);
            setError(null);
            const { id } = params as { id: string };
            // Fetch survey only
            const { data: surveyData, error: surveyError } = await supabase
                .from('surveys')
                .select('*')
                .eq('id', id)
                .single();
            if (surveyError) {
                setError('Error fetching survey: ' + surveyError.message);
                setLoading(false);
                return;
            }
            // Fetch questions for this survey
            const { data: questionsData, error: questionsError } = await supabase
                .from('questions')
                .select('*')
                .eq('survey_id', id);
            if (questionsError) {
                setError('Error fetching questions: ' + questionsError.message);
                setLoading(false);
                return;
            }
            setSurvey({ ...surveyData, questions: questionsData || [] });
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

    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        if (!survey) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        if (survey.team_member_email !== user.email) {
            setError('You can only respond to surveys assigned to you');
            return;
        }
        const responses = Object.entries(answers).map(([questionId, rating]) => ({
            survey_id: survey.id,
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
            .eq('id', survey.id);
        if (updateError) {
            setError('Error updating survey status');
            return;
        }
        router.push('/dashboard/pending');
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
                    {survey.questions?.map((question) => (
                        <div key={question.id} className="space-y-4">
                            <Label>{question.text}</Label>
                            <RadioGroup>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <RadioGroupItem
                                        key={rating}
                                        label={rating.toString()}
                                        name={question.id}
                                        value={rating.toString()}
                                        checked={answers[question.id] === rating}
                                        onChange={() => handleAnswerChange(question.id, rating)}
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