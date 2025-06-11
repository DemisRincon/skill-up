import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    // Create a response object that we can modify
    const res = NextResponse.next();

    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res });

    try {
        // Refresh the session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Session error:', error);
            throw error;
        }

        // Get the current path
        const path = req.nextUrl.pathname;

        // Define public paths that don't require authentication
        const publicPaths = ['/auth/login', '/auth/register'];
        const isPublicPath = publicPaths.includes(path);

        console.log('Current session:', session);
        console.log('Current path:', path);
        console.log('Is public path:', isPublicPath);

        if (!session) {
            // If user is not signed in and trying to access a protected route
            if (!isPublicPath) {
                const redirectUrl = new URL('/auth/login', req.url);
                redirectUrl.searchParams.set('redirectTo', path);
                return NextResponse.redirect(redirectUrl);
            }
        } else {
            // If user is signed in and trying to access auth pages
            if (isPublicPath) {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        }

        return res;
    } catch (error) {
        console.error('Middleware error:', error);
        // In case of error, redirect to login
        const redirectUrl = new URL('/auth/login', req.url);
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }
}

// Specify which routes this middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
}; 