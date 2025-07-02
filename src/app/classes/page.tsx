"use client";

import Loading from "@/components/Loading";
import { addAlert, setRefetch, openModal } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { HiClipboardCheck, HiDocumentReport, HiTrash, HiPlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { AlertLevel } from "@/lib/alertLevel";
import { HiPhoto } from "react-icons/hi2";
import { trpc } from "@/utils/trpc";
import { TRPCClientErrorLike } from "@trpc/client";
import { RouterOutputs } from "@/utils/trpc";
import Button from "@/components/ui/Button";
import CreateClass from "@/components/class/forms/CreateClass";
import JoinClass from "@/components/class/forms/JoinClass";
import Tabs from "@/components/ui/Tabs";
import { getContrastingTextColor } from '@/utils/color';
import Card from "@/components/ui/Card";
import { initializeSocket, joinClass } from "@/lib/socket";

type Class = RouterOutputs['class']['getAll']['teacherInClass'][number];

type Tab = 'teaching' | 'enrolled';

type FilterState = {
    search: string;
    subject: 'ALL' | string;
    section: string;
};

export default function Classes() {
    const dispatch = useDispatch();
    const appState = useSelector((state: RootState) => state.app);
    const [activeTab, setActiveTab] = useState<Tab>('teaching');
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        subject: 'ALL',
        section: ''
    });

    const { data: classes, isLoading, refetch } = trpc.class.getAll.useQuery();

    const { mutate: deleteClass } = trpc.class.delete.useMutation();

    useEffect(() => {
        if (appState.refetch) {
            refetch();
            dispatch(setRefetch(false));
        }
    }, [appState.refetch, refetch, dispatch]);

    // Auto-select non-empty tab when current tab is empty
    useEffect(() => {
        if (classes) {
            const teachingCount = classes.teacherInClass.length;
            const enrolledCount = classes.studentInClass.length;
            
            if (activeTab === 'teaching' && teachingCount === 0 && enrolledCount > 0) {
                setActiveTab('enrolled');
            } else if (activeTab === 'enrolled' && enrolledCount === 0 && teachingCount > 0) {
                setActiveTab('teaching');
            }
        }
    }, [classes, activeTab]);

    if (isLoading || !classes) {
        return <div className="w-full h-full flex items-center justify-center">
            <Loading />
        </div>
    }

    const renderClassCard = (cls: Class, isTeacher: boolean) => (
        <Card key={cls.id} className="p-0 mx-2">
            <div className="rounded-md w-[15rem] flex flex-col space-x-2">
                <a href={`/classes/${cls.id}`} className="flex flex-col hover:underline px-4 py-5 rounded-t-md w-full overflow-hidden relative" style={{ 
                  backgroundColor: cls.color ?? '#3B82F6',
                  color: getContrastingTextColor(cls.color ?? '#3B82F6')
                }}>
                    <div className="text-lg font-semibold z-10">{cls.name}</div>
                    <div className="text-sm text-nowrap z-10">Section {cls.section}, {cls.subject}</div>
                </a>
                <div className="flex flex-col space-y-2 px-2 py-3 p-2">
                    <span className="text-sm text-foreground-muted font-semibold">Due today</span>
                    <div className="flex flex-col space-y-1 h-[5rem] overflow-y-auto">
                        {
                            cls.dueToday?.map((assignment: { id: string; title: string }, index: number) => (   
                                <a key={index} href={`/classes/${cls.id}/assignment/${assignment.id}`} className="text-foreground-muted hover:underline">{assignment.title}</a>
                            ))
                        }
                        {
                            (!cls.dueToday || cls.dueToday.length === 0) && (
                                <span className="text-foreground-muted">No assignments due today</span>
                            )
                        }
                    </div>
                </div>
                <div className="flex flex-row space-x-1 p-2 border-border border-t">
                    <Button.SM href={`/classes/${cls.id}/assignments`}>
                        <HiClipboardCheck className="size-5" />
                    </Button.SM>
                    <Button.SM href={`/classes/${cls.id}/grades${isTeacher ? '' : `/${appState.user.id}`}`}>
                        <HiDocumentReport className="size-5" />
                    </Button.SM>
                    {isTeacher && (
                        <Button.SM onClick={() => {
                            deleteClass({ id: cls.id, classId: cls.id }, {
                                onSuccess: () => {
                                },
                                onError: (error: TRPCClientErrorLike<any>) => {
                                    dispatch(addAlert({ 
                                        level: AlertLevel.ERROR, 
                                        remark: error.message 
                                    }));
                                }
                            });
                        }}>
                            <HiTrash className="size-5" />                                
                        </Button.SM>
                    )}
                </div>
            </div>
        </Card>
    );

    return (
        <div className="flex flex-col space-y-4 w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-40 pt-5">
            <div className="flex flex-row items-center justify-between w-full">
                <h1 className="text-xl font-semibold">Classes</h1>
                <div className="flex space-x-2">
                    <Button.Light 
                        onClick={() => dispatch(openModal({
                            body: <JoinClass onCreate={refetch} />,
                            header: 'Join Class',
                        }))}
                    >
                        Join Class
                    </Button.Light>
                    <Button.Primary 
                        onClick={() => dispatch(openModal({
                            body: <CreateClass onCreate={refetch} />,
                            header: 'Create Class'
                        }))}
                    >
                        Create Class
                    </Button.Primary>
                </div>
            </div>

            <Tabs
                tabs={[
                    { name: 'Teaching', count: classes.teacherInClass.length },
                    { name: 'Enrolled', count: classes.studentInClass.length },
                ]}
                activeTab={activeTab === 'teaching' ? 0 : 1}
                onTabChange={(index) => setActiveTab(index === 0 ? 'teaching' : index === 1 ? 'enrolled' : 'teaching')}
            />

            <div className="flex flex-wrap">
                {activeTab === 'teaching' && classes.teacherInClass.map(cls => renderClassCard(cls, true))}
                {activeTab === 'enrolled' && classes.studentInClass.map(cls => renderClassCard(cls, false))}

                {activeTab === 'teaching' && classes.teacherInClass.length === 0 && classes.studentInClass.length === 0 && (
                    <div className="flex flex-col space-y-3 pt-12 pb-12 items-center justify-center w-full h-full">
                        <HiPhoto className="size-12 text-foreground-muted" />
                        <span className="text-foreground-muted">You are not teaching any classes</span>
                    </div>
                )}

                {activeTab === 'enrolled' && classes.studentInClass.length === 0 && classes.teacherInClass.length === 0 && (
                    <div className="flex flex-col space-y-3 pt-12 pb-12 items-center justify-center w-full h-full">
                        <HiPhoto className="size-12 text-foreground-muted" />
                        <span className="text-foreground-muted">You are not enrolled in any classes</span>
                    </div>
                )}
            </div>
        </div>
    );
}
