import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUserData } from './useUserData';
import type { Survey } from './useSurveyData';

export interface SurveyResponse {
    [key: number]: number;
}

export const useSurveyResponses = (surveyId: string, onSuccess: () => void) => {
    const [answers, setAnswers] = useState<SurveyResponse>({});
    const [error, setError] = useState<string | null>(null);
    const supabase = createClientComponentClient();
    const { userEmail } = useUserData();

    const handleAnswerChange = (index: number, value: number) => {
        setAnswers(prev => ({ ...prev, [index]: value }));
    };

    const handleSubmit = async (survey: Survey) => {
        try {
            if (!userEmail) {
                setError('You must be logged in to submit responses');
                return;
            }

            if (survey.team_member_email !== userEmail) {
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
                .eq('id', surveyId);

            if (updateError) throw updateError;
            onSuccess();
        } catch (error) {
            console.error('Error submitting survey:', error);
            setError('Failed to submit survey responses. Please try again.');
        }
    };

    return { answers, error, handleAnswerChange, handleSubmit };
}; 