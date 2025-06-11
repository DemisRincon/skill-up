import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // If user is not signed in and the current path is not /auth/login or /auth/register
    // redirect the user to /auth/login
    if (!session && !req.nextUrl.pathname.startsWith('/auth/')) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/auth/login';
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // If user is signed in and the current path is /auth/login or /auth/register
    // redirect the user to /dashboard
    if (session && req.nextUrl.pathname.startsWith('/auth/')) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
    }

    // Check for manager-only routes
    if (session && (req.nextUrl.pathname.startsWith('/dashboard/surveys/create') || req.nextUrl.pathname.startsWith('/dashboard/survey'))) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role_id')
            .eq('id', session.user.id)
            .single();

        if (!profile) {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/dashboard';
            return NextResponse.redirect(redirectUrl);
        }

        const { data: role } = await supabase
            .from('roles')
            .select('name')
            .eq('id', profile.role_id)
            .single();

        if (!role || role.name !== 'manager') {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/dashboard';
            return NextResponse.redirect(redirectUrl);
        }
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
}; 