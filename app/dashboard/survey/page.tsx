'use client';
import { useSurveys } from '@/app/hooks/useSurveys';
import { SurveyFilters } from '@/app/components/SurveyFilters';
import { SurveyBatchItem } from '@/app/components/SurveyBatchItem';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export default function SurveyListPage() {
    const {
        loading,
        error,
        titleFilter,
        setTitleFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        filteredBatches
    } = useSurveys();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Surveys</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage and view your survey results
                    </p>
                </div>

                <SurveyFilters
                    titleFilter={titleFilter}
                    setTitleFilter={setTitleFilter}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                />

                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    </div>
                ) : filteredBatches.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No surveys found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {filteredBatches.map(batch => (
                            <SurveyBatchItem key={batch.batch_id || batch.id} batch={batch} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
} 