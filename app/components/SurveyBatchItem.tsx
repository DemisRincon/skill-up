import Link from 'next/link';
import { BatchSurvey } from '../hooks/useSurveys';
import { ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SurveyBatchItemProps {
    batch: BatchSurvey;
}

export function SurveyBatchItem({ batch }: SurveyBatchItemProps) {
    const responseRate = (batch.respondedCount / batch.applicantCount) * 100;
    const formattedDate = new Date(batch.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{batch.title}</h3>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-500">
                                <DocumentTextIcon className="h-4 w-4 mr-2" />
                                <span>Created: {formattedDate}</span>
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href={`/dashboard/results/${batch.batch_id || batch.id}`}>
                            <Button>View Results</Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 