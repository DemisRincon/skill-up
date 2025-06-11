export interface Survey {
    id: string;
    manager_id?: string;
    questions: string[];
    responded?: boolean;
    a1?: number;
    a2?: number;
    a3?: number;
    batch_id?: string;
    team_member_email?: string;
    created_at: string;
    description: string;
    title: string;
}
export interface UserProfile {
    id: string;
    role_id: number;
    email: string;
} 