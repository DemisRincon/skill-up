"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

// Dynamically import D3DonutChart to avoid SSR issues
const D3DonutChart = dynamic(() => import("../../../components/D3DonutChart"), { ssr: false });

interface Survey {
    id: string;
    responded: boolean;
    a1?: number;
    a2?: number;
    a3?: number;
    questions?: string[];
}

export default function BatchResultsPage() {
    const router = useRouter();
    const params = useParams();
    const batchId = params?.id as string;
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log(batchId)
    useEffect(() => {
        const fetchBatchSurveys = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, error: surveysError } = await supabase
                    .from("surveys")
                    .select("*")
                    .eq("batch_id", batchId);
                if (surveysError) throw surveysError;
                setSurveys(data || []);
            } catch (err: Error | unknown) {
                setError(err instanceof Error ? err.message : "Failed to fetch batch surveys");
            } finally {
                setLoading(false);
            }
        };
        if (batchId) fetchBatchSurveys();
    }, [batchId]);

    // Calculate stats
    const total = surveys.length;
    const answered = surveys.filter((s) => s.responded && s.a1 && s.a2 && s.a3);
    const responseRate = total ? (answered.length / total) * 100 : 0;

    // Get questions from the first survey (they should be the same for all surveys in a batch)
    const questions = surveys[0]?.questions || ['Question 1', 'Question 2', 'Question 3'];

    // Calculate average for each question
    const calculateAverage = (questionNumber: number) => {
        const validAnswers = answered.map(s => s[`a${questionNumber}` as keyof Survey] as number)
            .filter(val => typeof val === 'number' && val >= 0 && val <= 5);
        if (!validAnswers.length) return "N/A";
        const avg = validAnswers.reduce((a, b) => a + b, 0) / validAnswers.length;
        return Number.isInteger(avg) ? avg.toString() : avg.toFixed(2);
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Batch Results</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : (
                <>
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-2">Response Rate</h2>
                        <D3DonutChart
                            value={answered.length}
                            total={total}
                            label={`${answered.length}/${total}`}
                        />
                        <div className="mt-2 text-center">
                            {answered.length} of {total} responded ({responseRate.toFixed(1)}%)
                        </div>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Question Results</h2>
                        <div className="space-y-8">
                            {[1, 2, 3].map((qNum) => (
                                <div key={qNum} className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-medium mb-4">{questions[qNum - 1]}</h3>
                                    <D3DonutChart
                                        value={Number(calculateAverage(qNum))}
                                        total={5}
                                        label={`${calculateAverage(qNum)}/5`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            <button className="mt-4 text-indigo-600 underline" onClick={() => router.back()}>
                Back
            </button>
        </div>
    );
} 