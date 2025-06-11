'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Survey {
    id: string;
    title: string;
    created_at: string;
}

export default function SurveyListPage() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [titleFilter, setTitleFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchSurveys = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) throw userError || new Error('User not found');
                const { data, error: surveysError } = await supabase
                    .from('surveys')
                    .select('id, title, created_at')
                    .eq('manager_id', user.id)
                    .order('created_at', { ascending: false });
                if (surveysError) throw surveysError;
                setSurveys(data || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch surveys');
            } finally {
                setLoading(false);
            }
        };
        fetchSurveys();
    }, []);

    // Filter logic
    const filteredSurveys = surveys.filter(survey => {
        const matchesTitle = survey.title.toLowerCase().includes(titleFilter.toLowerCase());
        const createdAt = new Date(survey.created_at);
        const matchesStart = startDate ? createdAt >= new Date(startDate) : true;
        const matchesEnd = endDate ? createdAt <= new Date(endDate + 'T23:59:59') : true;
        return matchesTitle && matchesStart && matchesEnd;
    });

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
            ) : filteredSurveys.length === 0 ? (
                <div>No surveys found.</div>
            ) : (
                <ul className="space-y-4">
                    {filteredSurveys.map(survey => (
                        <li key={survey.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="font-semibold text-lg">{survey.title}</div>
                                <div className="text-xs text-gray-500">Created: {new Date(survey.created_at).toLocaleString()}</div>
                            </div>
                            <div className="flex gap-4 mt-2 md:mt-0">
                                <Link href={`/dashboard/survey/${survey.id}/created`} className="text-indigo-600 underline">View Created</Link>
                                <Link href={`/dashboard/survey/${survey.id}/results`} className="text-green-600 underline">View Results</Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
} 