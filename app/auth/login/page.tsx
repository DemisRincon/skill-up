'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '@/app/components/layouts/AuthLayout';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { Suspense } from 'react';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/dashboard';

    // Check if user is already logged in
    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                console.log('Current session in login page:', session);
                if (session) {
                    router.push(redirectTo);
                }
            } catch (error) {
                console.error('Error checking session:', error);
            }
        };
        checkUser();
    }, [router, redirectTo]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                // The auth helpers will set the cookie for us
                window.location.href = redirectTo;
            }
        } catch (error: unknown) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An error occurred during login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Sign in to your account"
            subtitle={{
                text: "Don't have an account?",
                linkText: "Create one",
                linkHref: "/auth/register"
            }}
        >
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="rounded-md shadow-sm space-y-4">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        error={error || undefined}
                    />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>

                <Button
                    type="submit"
                    isLoading={loading}
                    fullWidth
                >
                    Sign in
                </Button>
            </form>
        </AuthLayout>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
} 