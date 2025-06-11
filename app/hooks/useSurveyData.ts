import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface Survey {
    id: string;
    title: string;
    description: string;
    questions: string[];
    team_member_email: string;
    manager_id: string;
    created_at: string;
}

export const useSurveyData = (surveyId: string) => {
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data: surveyData, error: surveyError } = await supabase
                    .from('surveys')
                    .select('*')
                    .eq('id', surveyId)
                    .single();

                if (surveyError) throw surveyError;
                setSurvey(surveyData);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchSurvey();
    }, [surveyId, supabase]);

    return { survey, error, loading };
}; 