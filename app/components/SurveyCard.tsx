import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Survey } from '../types/survey';

interface SurveyCardProps {
    survey?: Survey;
    currentUserEmail: string;
}

export const SurveyCard = ({ survey, currentUserEmail }: SurveyCardProps) => {
    if (!survey) return null;
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="line-clamp-1">{survey.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-gray-600 line-clamp-2">{survey.description}</p>
                <div className="flex flex-col  justify-center items-start pt-2 gap-2">
                    <p className="text-sm text-gray-500">{survey.team_member_email}</p>
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