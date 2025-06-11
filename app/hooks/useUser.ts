import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserProfile } from '../types/survey';

export const useUser = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const { data: authData, error: authError } = await supabase.auth.getUser();
                
                if (authError) throw authError;
                
                if (authData.user) {
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', authData.user.id)
                        .single();

                    if (profileError) throw profileError;

                    setUserProfile({
                        id: authData.user.id,
                        role_id: profileData.role_id,
                        email: authData.user.email || '',
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An error occurred'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [supabase]);

    return { userProfile, isLoading, error };
}; 