"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addAlert, openModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import { HiBeaker, HiPlus, HiSparkles, HiDocumentText, HiClipboardList, HiLightBulb, HiAcademicCap } from "react-icons/hi";
import { MdAssignment, MdSchool, MdAutoAwesome } from "react-icons/md";
import CreateLabDraft from "@/components/class/forms/CreateLabDraft";
import AIGenerator from "@/components/class/forms/AIGenerator";
import Assignment from "@/components/class/Assignment";
import CreateAssignment from "@/components/class/forms/CreateAssignment";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Loading from "@/components/Loading";
import Empty from "@/components/ui/Empty";
import IconFrame from "@/components/ui/IconFrame";
import Tabs, { Tab } from "@/components/ui/Tabs";

type LabDraftType = 'LAB' | 'PROJECT' | 'QUIZ' | 'HOMEWORK' | 'TEST';

type LabDraft = {
    id: string;
    title: string;
    type: string;
    instructions: string;
    inProgress: boolean;
    createdAt: Date;
    modifiedAt: Date;
};



export default function LabsPage({ params }: { params: { classId: string } }) {
    const dispatch = useDispatch();
    const appState = useSelector((state: RootState) => state.app);
    const [activeTab, setActiveTab] = useState(0);
    const [labDrafts, setLabDrafts] = useState<LabDraft[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { data: classData, isLoading: classLoading } = trpc.class.get.useQuery({ classId: params.classId });
    const { data: labDraftsData, refetch: refetchLabDrafts } = trpc.class.listLabDrafts.useQuery({ classId: params.classId });

    // Update lab drafts when data changes
    useEffect(() => {
        if (labDraftsData) {
            setLabDrafts(labDraftsData.map(draft => ({
                id: draft.id,
                title: draft.title,
                type: draft.type,
                instructions: draft.instructions,
                inProgress: draft.inProgress,
                createdAt: new Date(draft.createdAt || new Date()),
                modifiedAt: new Date(draft.modifiedAt || new Date()),
            })));
        }
    }, [labDraftsData]);

    const handleCreateDraft = (type: string) => {
        dispatch(openModal({
            header: `Create ${type.charAt(0).toUpperCase() + type.slice(1)} Draft`,
            body: <CreateLabDraft classId={params.classId} type={type as LabDraftType} onSuccess={() => {
                refetchLabDrafts();
            }} />
        }));
    };

    const handleAIGenerate = (type: string) => {
        dispatch(openModal({
            header: `AI-Generated ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            body: <AIGenerator classId={params.classId} type={type as LabDraftType} onSuccess={() => {
                refetchLabDrafts();
            }} />
        }));
    };



    const handleCreateAssignment = () => {
        dispatch(openModal({
            header: 'Create Assignment',
            body: <CreateAssignment classId={params.classId} sections={classData?.class?.sections || []} />
        }));
    };

    if (classLoading) {
        return <Loading />;
    }

    if (!classData?.class) {
        return (
            <div className="flex items-center justify-center h-full">
                <Empty 
                    icon={HiBeaker}
                    title="Class not found"
                    description="The class you're looking for doesn't exist or you don't have access to it."
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-semibold text-xl text-foreground-primary">Course Labs</h1>
                    <p className="text-sm text-foreground-muted mt-1">
                        AI-powered assignment drafting and lesson material preparation
                    </p>
                </div>
                <Button.Primary onClick={handleCreateAssignment} className="flex items-center space-x-2">
                    <HiPlus className="w-4 h-4 mr-2" />
                    Create Assignment
                </Button.Primary>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4">
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleAIGenerate('Assignment')}>
                    <div className="flex items-center space-x-3">
                        <IconFrame className="p-2 size-8 bg-purple-50 text-purple-600 rounded-lg">
                            <MdAutoAwesome className="h-6 w-6" />
                        </IconFrame>
                        <div>
                            <h3 className="font-semibold text-foreground-primary">AI Generation</h3>
                            <p className="text-sm text-foreground-muted">Generate assignment with AI</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs
                tabs={[
                    { name: 'My Drafts', count: labDrafts.length }
                    // { name: 'Templates' }
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Content based on active tab */}
            {activeTab === 0 && (
                <div className="space-y-4">
                    {labDrafts.length > 0 ? (
                        labDrafts.map((draft) => (
                            <Assignment
                                key={draft.id}
                                title={draft.title}
                                date={draft.modifiedAt}
                                isTeacher={appState.user.teacher}
                                classId={params.classId}
                                assignmentId={draft.id}
                                type={draft.type}
                                graded={false}
                                points={0}
                                inProgress={draft.inProgress}
                            />
                        ))
                    ) : (
                        <Empty 
                            icon={HiDocumentText}
                            title="No drafts yet"
                            description="Create your first assignment or lesson draft to get started."
                        />
                    )}
                </div>
            )}

            {/* {activeTab === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center space-x-3 mb-4">
                            <IconFrame className="p-2 size-8 bg-blue-50 text-blue-600 rounded-lg">
                                <MdAssignment className="h-6 w-6" />
                            </IconFrame>
                            <h3 className="font-semibold text-foreground-primary">Programming Assignment</h3>
                        </div>
                        <p className="text-sm text-foreground-muted mb-4">
                            Template for coding assignments with clear instructions and grading criteria.
                        </p>
                        <Button.Light size="sm" className="w-full">Use Template</Button.Light>
                    </Card>

                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center space-x-3 mb-4">
                            <IconFrame className="p-2 size-8 bg-green-50 text-green-600 rounded-lg">
                                <MdSchool className="h-6 w-6" />
                            </IconFrame>
                            <h3 className="font-semibold text-foreground-primary">Interactive Lesson</h3>
                        </div>
                        <p className="text-sm text-foreground-muted mb-4">
                            Structured lesson plan with activities, discussions, and assessments.
                        </p>
                        <Button.Light size="sm" className="w-full">Use Template</Button.Light>
                    </Card>

                    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center space-x-3 mb-4">
                            <IconFrame className="p-2 size-8 bg-orange-50 text-orange-600 rounded-lg">
                                <HiClipboardList className="h-6 w-6" />
                            </IconFrame>
                            <h3 className="font-semibold text-foreground-primary">Quiz Template</h3>
                        </div>
                        <p className="text-sm text-foreground-muted mb-4">
                            Multiple choice and short answer quiz with automatic grading.
                        </p>
                        <Button.Light size="sm" className="w-full">Use Template</Button.Light>
                    </Card>
                </div>
            )} */}
        </div>
    );
}

 