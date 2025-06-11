import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const useUserData = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserEmail(user?.email ?? null);
        };

        fetchUser();
    }, [supabase]);

    return { userEmail };
}; 