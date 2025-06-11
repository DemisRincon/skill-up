import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Survey } from '../types/survey';

interface SurveyCardProps {
    survey: Survey;
    currentUserEmail: string;
}

export const SurveyCard = ({ survey, currentUserEmail }: SurveyCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{survey.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 h-full">
                <p className="text-gray-600">{survey.description}</p>
                <div className="flex justify-between items-center">
                    <p className="text-gray-600">{survey.team_member_email}</p>
                    {survey.team_member_email === currentUserEmail && (
                        <Link href={`/dashboard/pending/${survey.id}`}>
                            <Button>Respond to Survey</Button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}; 