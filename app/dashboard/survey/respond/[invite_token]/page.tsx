import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SurveyRespondPage({ params }: { params: { invite_token: string } }) {
    const [invite, setInvite] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answers, setAnswers] = useState<{ q1: number | null; q2: number | null; q3: number | null }>({ q1: null, q2: null, q3: null });
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchInvite = async () => {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from('survey_invites')
                .select('id, team_member_name, responded')
                .eq('invite_token', params.invite_token)
                .single();
            if (error || !data) {
                setError('Invalid or expired survey link.');
            } else if (data.responded) {
                setError('You have already submitted this survey.');
            } else {
                setInvite(data);
            }
            setLoading(false);
        };
        fetchInvite();
    }, [params.invite_token]);

    const handleChange = (q: 'q1' | 'q2' | 'q3', value: number) => {
        setAnswers(prev => ({ ...prev, [q]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!invite) return;
        setLoading(true);
        setError(null);
        try {
            // Insert response
            const { error: responseError } = await supabase
                .from('survey_responses')
                .insert({
                    invite_id: invite.id,
                    q1: answers.q1,
                    q2: answers.q2,
                    q3: answers.q3,
                });
            if (responseError) throw responseError;
            // Mark invite as responded
            const { error: updateError } = await supabase
                .from('survey_invites')
                .update({ responded: true })
                .eq('id', invite.id);
            if (updateError) throw updateError;
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Failed to submit response');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <div className="max-w-xl mx-auto p-8">Loading...</div>
            ) : error ? (
                <div className="max-w-xl mx-auto p-8 text-red-600">{error}</div>
            ) : submitted ? (
                <div className="max-w-xl mx-auto p-8 text-green-700">Thank you for your feedback!</div>
            ) : (
                <div className="max-w-xl mx-auto p-8">
                    <h1 className="text-2xl font-bold mb-4">Leadership Feedback Survey</h1>
                    <p className="mb-4">Hi {invite.team_member_name}, please rate the following statements from 1 (Strongly Disagree) to 5 (Strongly Agree):</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i}>
                                <label className="block font-medium mb-1">Question {i}</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(val => (
                                        <label key={val} className="flex flex-col items-center">
                                            <input
                                                type="radio"
                                                name={`q${i}`}
                                                value={val}
                                                checked={answers[`q${i}` as 'q1' | 'q2' | 'q3'] === val}
                                                onChange={() => handleChange(`q${i}` as 'q1' | 'q2' | 'q3', val)}
                                                required
                                            />
                                            <span>{val}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            disabled={loading}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </>
    );
} 