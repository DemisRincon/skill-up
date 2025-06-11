import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';


export interface Survey {
    id: string;
    title: string;
    created_at: string;
    description: string;
    questions: string[];
    batch_id?: string;
    responded?: boolean;
    a1?: number;
    a2?: number;
    a3?: number;
    team_member_email?: string;
    manager_id?: string;
}

export interface BatchSurvey extends Survey {
    applicantCount: number;
    respondedCount: number;
    batchSurveys: Survey[];
}

export function useSurveys(roleId: number | null = null, userEmail: string | null = null, pending:boolean=false) {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [titleFilter, setTitleFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchSurveys = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log(pending);
                let query = pending ? supabase.from('surveys').select('*').eq('responded', false) : supabase.from('surveys').select('*');

                if (roleId === 1) {
                    // Manager view
                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    if (userError || !user) throw userError || new Error('User not found');
                    query = query.eq('manager_id', user.id);
                } else if (userEmail) {
                    // Team member view
                    query = query.eq('team_member_email', userEmail);
                }

                const { data, error: surveysError } = await query.order('created_at', { ascending: false });
                if (surveysError) throw surveysError;
                setSurveys(data || []);
            } catch (err: Error | unknown) {
                setError(err instanceof Error ? err.message : 'Failed to fetch surveys');
            } finally {
                setLoading(false);
            }
        };
        fetchSurveys();
    }, [roleId, userEmail]);

    // Group by batch_id
    const surveysByBatch: { [batchId: string]: Survey[] } = {};
    surveys.forEach(survey => {
        const batchId = survey.batch_id || survey.id;
        if (!surveysByBatch[batchId]) {
            surveysByBatch[batchId] = [];
        }
        surveysByBatch[batchId].push(survey);
    });

    const batchList = Object.values(surveysByBatch).map(batchSurveys => ({
        ...batchSurveys[0],
        applicantCount: batchSurveys.length,
        respondedCount: batchSurveys.filter(s => s.responded).length,
        batchSurveys
    }));

    // Filter logic
    const filteredBatches = batchList.filter(batch => {
        const matchesTitle = batch.title.toLowerCase().includes(titleFilter.toLowerCase());
        const createdAt = new Date(batch.created_at);
        const matchesStart = startDate ? createdAt >= new Date(startDate) : true;
        const matchesEnd = endDate ? createdAt <= new Date(endDate + 'T23:59:59') : true;
        return matchesTitle && matchesStart && matchesEnd;
    });

    return {
        surveys,
        loading,
        error,
        titleFilter,
        setTitleFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        filteredBatches
    };
} 