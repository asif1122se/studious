"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/appSlice';
import Loading from '../Loading';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useDispatch();

    
    const { data: user, isLoading, error } = trpc.auth.check.useQuery(undefined, {
        staleTime: 5 * 60 * 1000,
        retry: false,
    });


    const [authenticated, setAuthenticated] = useState(false);
    
    useEffect(() => {
        if (error && !user) {
            dispatch(setAuth({
                loggedIn: false,
                teacher: false,
                student: false,
            }));
            setAuthenticated(true);
        }
    }, [error, router, isLoading]);

    useEffect(() => {
        if (user?.user) {
            dispatch(setAuth({
                ...user.user,
                loggedIn: true,
                teacher: false,
                student: false,
            }));

            setAuthenticated(true);
        }
    }, [user]);

    if (!authenticated || isLoading) {
        return <Loading />;
    }
    return <>{children}</>;
}