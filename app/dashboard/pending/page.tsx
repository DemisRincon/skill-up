'use client';

import { useUser } from '@/app/hooks/useUser';
import { useSurveys } from '@/app/hooks/useSurveys';
import { SurveyCard } from '@/app/components/SurveyCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClipboardList } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PendingSurveys() {
    const { userProfile, isLoading: userLoading, error: userError } = useUser();
    const { surveys, loading: surveysLoading, error: surveysError } = useSurveys(
        userProfile?.role_id ?? null,
        userProfile?.email ?? null
    );

    if (userLoading || surveysLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (userError || surveysError) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    {userError?.message || surveysError || 'An error occurred'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">
                    {userProfile?.role_id === 1 ? 'Pending Surveys Overview' : 'Surveys Awaiting Your Response'}
                </h1>
                <p className="text-muted-foreground">
                    {userProfile?.role_id === 1
                        ? 'Review and manage all pending surveys in the system.'
                        : 'Complete these surveys to help us improve our services.'}
                </p>
            </div>

            {surveys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Pending Surveys</h3>
                    <p className="text-muted-foreground max-w-sm">
                        {userProfile?.role_id === 1
                            ? 'There are currently no surveys pending review.'
                            : 'You have completed all your assigned surveys. Check back later for new ones.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {surveys.map((survey) => (
                        <SurveyCard
                            key={survey.id}
                            survey={{
                                ...survey,
                                questions: survey.questions || []
                            }}
                            currentUserEmail={userProfile?.email || ''}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}