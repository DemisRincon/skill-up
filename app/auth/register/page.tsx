'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '@/app/components/layouts/AuthLayout';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { Button } from '@/app/components/ui/Button';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('manager');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const roleOptions = [
        { value: 'manager', label: 'Manager' },
        { value: 'team_member', label: 'Team Member' }
    ];

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });
            if (signUpError) throw signUpError;
            const user = data.user;
            if (!user) throw new Error('User registration failed.');

            const { data: roleData, error: roleError } = await supabase
                .from('roles')
                .select('id')
                .eq('name', role)
                .single();
            if (roleError || !roleData) throw roleError || new Error('Role not found');

            const { error: profileError } = await supabase.from('profiles').insert({
                id: user.id,
                role_id: roleData.id,
                full_name: fullName,
            });
            if (profileError) throw profileError;

            window.location.href = '/dashboard';
        } catch (error: any) {
            setError(error.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle={{
                text: "Already have an account?",
                linkText: "Sign in",
                linkHref: "/auth/login"
            }}
        >
            <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                <div className="rounded-md shadow-sm space-y-4">
                    <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        error={error || undefined}
                    />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                    />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <Select
                        id="role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        options={roleOptions}
                        label="Register as"
                    />
                </div>

                <Button
                    type="submit"
                    isLoading={loading}
                    fullWidth
                >
                    Register
                </Button>
            </form>
        </AuthLayout>
    );
} 