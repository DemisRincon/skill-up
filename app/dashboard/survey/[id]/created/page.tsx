

export default async function SurveyCreatedPage() {

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Survey Created!</h1>
            <p>Your survey has been created and invites have been sent.</p>
            <a href={`/dashboard/survey`} className="text-indigo-600 underline mt-4 block">
                View Survey Results
            </a>
        </div>
    );
} 