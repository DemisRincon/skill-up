'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Survey {
    id: string;
    title: string;
    created_at: string;
    batch_id?: string;
    responded?: boolean;
    a1?: number;
    a2?: number;
    a3?: number;
    team_member_email?: string;
}

export default function SurveyListPage() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [titleFilter, setTitleFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

    useEffect(() => {
        const fetchSurveys = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) throw userError || new Error('User not found');
                const { data, error: surveysError } = await supabase
                    .from('surveys')
                    .select('*')
                    .eq('manager_id', user.id)
                    .order('created_at', { ascending: false });
                if (surveysError) throw surveysError;
                setSurveys(data || []);
            } catch (err: Error | unknown) {
                setError(err instanceof Error ? err.message : 'Failed to fetch surveys');
            } finally {
                setLoading(false);
            }
        };
        fetchSurveys();
    }, []);

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

    // Filter logic (applies to batchList)
    const filteredBatches = batchList.filter(batch => {
        const matchesTitle = batch.title.toLowerCase().includes(titleFilter.toLowerCase());
        const createdAt = new Date(batch.created_at);
        const matchesStart = startDate ? createdAt >= new Date(startDate) : true;
        const matchesEnd = endDate ? createdAt <= new Date(endDate + 'T23:59:59') : true;
        return matchesTitle && matchesStart && matchesEnd;
    });

    // Helper to calculate statistics
    function getBatchStats(batchSurveys: Survey[]) {
        const answered = batchSurveys.filter(s => s.responded && s.a1 && s.a2 && s.a3);
        const avg = (arr: number[]) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 'N/A';
        return {
            responseRate: `${answered.length} / ${batchSurveys.length}`,
            avgA1: avg(answered.map(s => s.a1!)),
            avgA2: avg(answered.map(s => s.a2!)),
            avgA3: avg(answered.map(s => s.a3!)),
        };
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">My Surveys</h1>
            <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        value={titleFilter}
                        onChange={e => setTitleFilter(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Search by title"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                    />
                </div>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : filteredBatches.length === 0 ? (
                <div>No surveys found.</div>
            ) : (
                <ul className="space-y-4">
                    {filteredBatches.map(batch => {
                        const stats = getBatchStats(batch.batchSurveys);
                        return (
                            <li key={batch.batch_id || batch.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="font-semibold text-lg">{batch.title}</div>
                                    <div className="text-xs text-gray-500">Created: {new Date(batch.created_at).toISOString().replace('T', ' ').slice(0, 19)}</div>
                                    <div className="text-xs text-gray-500">Applicants: {batch.applicantCount}</div>
                                    <div className="text-xs text-gray-500">Responded: {batch.respondedCount}</div>
                                </div>
                                <div className="flex gap-4 mt-2 md:mt-0">
                                    <Link
                                        href={`/dashboard/results/${batch.batch_id || batch.id}`}
                                        className="text-green-600 underline"
                                    >
                                        View Results
                                    </Link>
                                    <Link href={`/dashboard/survey/${batch.id}/created`} className="text-indigo-600 underline">View Created</Link>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
} 