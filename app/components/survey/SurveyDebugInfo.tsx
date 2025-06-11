import { Card } from '@/components/ui/card';

interface SurveyDebugInfoProps {
    userEmail: string | null;
    assignedEmail: string;
}

export const SurveyDebugInfo = ({ userEmail, assignedEmail }: SurveyDebugInfoProps) => (
    <Card className="p-4 mb-6 bg-muted/50">
        <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Current user:</span>
                <span className="text-primary">{userEmail || 'Not logged in'}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Assigned to:</span>
                <span className="text-primary">{assignedEmail}</span>
            </div>
        </div>
    </Card>
); 