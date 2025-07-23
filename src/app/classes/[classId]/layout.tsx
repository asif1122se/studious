"use client";

import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, setTeacher } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "@/components/class/Sidebar";
import Loading from "@/components/Loading";
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import Skeleton, { SkeletonText } from "@/components/ui/Skeleton";

// Skeleton for sidebar navigation items
const SidebarSkeleton = () => (
    <div className="flex flex-col h-full w-[17rem] py-5 px-2 border-r border-border space-y-1 justify-between shrink-0">
        <div className="space-y-1">
            {/* Navigation items skeleton */}
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-row items-center space-x-3 px-4 py-3">
                    <Skeleton width="1.25rem" height="1.25rem" className="rounded" />
                    <Skeleton width="6rem" height="1rem" />
                </div>
            ))}
        </div>
        
        {/* Invite button skeleton (for teachers) */}
        <div className="mt-auto">
            <Skeleton width="100%" height="2.5rem" className="rounded-md" />
        </div>
    </div>
);

// Skeleton for mobile bottom navigation
const MobileNavSkeleton = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 mx-5 mb-5 bg-background border border-border z-30 rounded-md">
        <div className="flex justify-around items-center h-16">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center justify-center space-y-1 px-3 py-2">
                    <Skeleton width="1.25rem" height="1.25rem" className="rounded" />
                    <Skeleton width="3rem" height="0.75rem" />
                </div>
            ))}
        </div>
    </div>
);

// Skeleton for content area
const ContentSkeleton = () => (
    <div className="h-full pt-7 overflow-y-scroll flex-grow pe-7 ps-7 bg-background-subtle">
        <div className="mx-0 md:mx-4 lg:mx-8 space-y-6">
            {/* Page title skeleton */}
            <div className="space-y-2">
                <Skeleton width="12rem" height="2rem" />
                <Skeleton width="20rem" height="1rem" />
            </div>
            
            {/* Content skeleton - varies based on page type */}
            <div className="space-y-4">
                {/* Generic content blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <Skeleton height="1.5rem" className="mb-4" />
                            <SkeletonText lines={3} className="mb-4" />
                            <div className="flex justify-between items-center">
                                <Skeleton width="5rem" height="2rem" />
                                <Skeleton width="4rem" height="2rem" />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Additional content sections */}
                <div className="space-y-4">
                    <SkeletonText lines={2} />
                    <div className="flex space-x-4">
                        <Skeleton width="8rem" height="2.5rem" />
                        <Skeleton width="10rem" height="2.5rem" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ClassLayoutSkeleton = () => (
    <div className="flex flex-row h-full">
        {/* Desktop sidebar skeleton */}
        <div className="hidden md:block">
            <SidebarSkeleton />
        </div>
        
        {/* Content area skeleton */}
        <ContentSkeleton />
        
        {/* Mobile navigation skeleton */}
        <MobileNavSkeleton />
    </div>
);

export default function ClassWrappper({ children, params }: {
    children: React.ReactNode;
    params: {
        classId: string;
    };
}) {
    const router = useRouter();
    const classId = params.classId;
    const dispatch = useDispatch();
    const appState = useSelector((state: RootState) => state.app);

    const { data: classData, isLoading } = trpc.class.get.useQuery(
        { classId },
        { enabled: appState.user.loggedIn }
    );

    useEffect(() => {
        if (!classData?.class) return;

        const teacher = classData.class.teachers.find((teacher) => teacher.username === appState.user?.username);
        dispatch(setTeacher(!!teacher));
    }, [classData, appState.user?.username, dispatch]);

    if (isLoading) {
        return <ClassLayoutSkeleton />;
    }

    return (
        <div className="flex flex-row h-full">
            <Sidebar teacher={appState.user.teacher} classId={classId} />
            <div className="h-full pt-7 overflow-y-scroll flex-grow pe-7 ps-7 bg-background-subtle">
                <div className="mx-0 md:mx-4 lg:mx-8">
                    {children}
                </div>      
            </div>  
        </div>
    );
}