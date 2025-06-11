import Link from 'next/link';
import { BatchSurvey } from '../hooks/useSurveys';
import { ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

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
        <li className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{batch.title}</h3>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-500">
                                <DocumentTextIcon className="h-4 w-4 mr-2" />
                                <span>Created: {formattedDate}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <ChartBarIcon className="h-4 w-4 mr-2" />
                                <span>Response Rate: {responseRate.toFixed(1)}% ({batch.respondedCount}/{batch.applicantCount})</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={`/dashboard/results/${batch.batch_id || batch.id}`}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            View Results
                        </Link>
                        <Link
                            href={`/dashboard/survey/${batch.id}/created`}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            View Created
                        </Link>
                    </div>
                </div>
            </div>
        </li>
    );
} 