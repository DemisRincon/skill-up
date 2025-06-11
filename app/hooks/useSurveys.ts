import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Survey } from '../types/survey';

export const useSurveys = (userRole: number | null, userEmail: string | null) => {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchSurveys = async () => {
            if (userRole === null || userEmail === null) return;

            try {
                setIsLoading(true);
                let query = supabase
                    .from('surveys')
                    .select('*')
                    .eq('responded', false);

                if (userRole !== 1) {
                    query = query.eq('team_member_email', userEmail);
                }

                const { data, error } = await query;

                if (error) throw error;
                setSurveys(data || []);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An error occurred'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchSurveys();
    }, [userRole, userEmail, supabase]);

    return { surveys, isLoading, error };
}; 