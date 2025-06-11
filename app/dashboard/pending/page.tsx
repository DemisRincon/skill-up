'use client';

import { useUser } from '@/app/hooks/useUser';
import { useSurveys } from '@/app/hooks/useSurveys';
import { SurveyCard } from '@/app/components/SurveyCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PendingSurveys() {
    const { userProfile, isLoading: userLoading, error: userError } = useUser();
    const { surveys, isLoading: surveysLoading, error: surveysError } = useSurveys(
        userProfile?.role_id ?? null,
        userProfile?.email ?? null
    );

    if (userLoading || surveysLoading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    if (userError || surveysError) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    {userError?.message || surveysError?.message || 'An error occurred'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">
                {userProfile?.role_id === 1 ? 'Pending Surveys Overview' : 'Surveys Awaiting Your Response'}
            </h1>

            {surveys.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-600">No pending surveys at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {surveys.map((survey) => (
                        <SurveyCard
                            key={survey.id}
                            survey={survey}
                            currentUserEmail={userProfile?.email || ''}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}