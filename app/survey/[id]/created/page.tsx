import { DashboardLayout } from '@/app/components/layouts/DashboardLayout';

export default function SurveyCreatedPage({ params }: { params: { id: string } }) {
    return (
        <DashboardLayout>
            <div className="max-w-xl mx-auto p-8">
                <h1 className="text-2xl font-bold mb-4">Survey Created!</h1>
                <p>Your survey has been created and invites have been sent.</p>
                <a href={`/survey/${params.id}/results`} className="text-indigo-600 underline mt-4 block">
                    View Survey Results
                </a>
            </div>
        </DashboardLayout>
    );
} 