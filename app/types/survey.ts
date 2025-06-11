export interface Question {
    id: string;
    text: string;
}

export interface Survey {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    team_member_email: string;
    manager_id: string;
    created_at: string;
    responded: boolean;
}

export interface UserProfile {
    id: string;
    role_id: number;
    email: string;
} 