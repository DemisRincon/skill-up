"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserData } from "@/app/hooks/useUserData";
import { useSurveyResponses } from "@/app/hooks/useSurveyResponses";
import { useSurveyData } from "@/app/hooks/useSurveyData";
import { SurveyDebugInfo } from "@/app/components/survey/SurveyDebugInfo";
import { SurveyQuestion } from "@/app/components/survey/SurveyQuestion";
import { Loader2 } from "lucide-react";

export default function RespondSurveyPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params as { id: string };

    const { survey, error: surveyError, loading } = useSurveyData(id);
    const { userEmail } = useUserData();
    const {
        answers,
        error: responseError,
        handleAnswerChange,
        handleSubmit
    } = useSurveyResponses(id, () => router.push('/dashboard/pending'));

    const error = surveyError || responseError;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto p-8">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!survey) {
        return (
            <div className="max-w-xl mx-auto p-8">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Survey not found.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isComplete = Object.keys(answers).length === survey.questions?.length;

    return (
        <div className="max-w-2xl mx-auto p-8">
            <SurveyDebugInfo userEmail={userEmail} assignedEmail={survey.team_member_email} />
            <Card className="shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">{survey.title}</CardTitle>
                    <p className="text-base text-muted-foreground">{survey.description}</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-6">
                        {survey.questions?.map((question, index) => (
                            <SurveyQuestion
                                key={index}
                                question={question}
                                index={index}
                                value={answers[index]}
                                onChange={handleAnswerChange}
                            />
                        ))}
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="flex justify-between items-center pt-4">
                        <p className="text-sm text-muted-foreground">
                            {isComplete ? 'All questions answered' : 'Please answer all questions'}
                        </p>
                        <Button
                            onClick={() => handleSubmit(survey)}
                            disabled={!isComplete}
                            size="lg"
                            className="min-w-[120px]"
                        >
                            Submit
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 