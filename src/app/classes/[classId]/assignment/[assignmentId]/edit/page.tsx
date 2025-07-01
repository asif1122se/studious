"use client";

import FileEdit from "@/components/class/FileEdit";
import Empty from "@/components/ui/Empty";
import { HiPaperClip, HiArrowLeft, HiCalendar } from "react-icons/hi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AlertLevel } from "@/lib/alertLevel";
import { fileToBase64 } from "@/lib/fileToBase64";
import { addAlert, setRefetch, openModal } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import { emitAssignmentUpdate, initializeSocket } from "@/lib/socket";
import { joinClass } from "@/lib/socket";
import { trpc } from "@/utils/trpc";
import type { RouterOutputs } from "@/utils/trpc";
import Loading from "@/components/Loading";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@studious-lms/server";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { assignmentTypes, formatAssignmentType, getAssignmentIcon } from "@/lib/assignment";
import IconFrame from "@/components/ui/IconFrame";
import Checkbox from "@/components/ui/Checkbox";
import AttachEventToAssignment from "@/components/class/forms/AttachEventToAssignment";
import AttachedEvent from "@/components/class/AttachedEvent";
import GradingInfo from "@/components/class/GradingInfo";
import AttachGradingToAssignment from "@/components/class/forms/AttachGradingToAssignment";
import { MdChecklist } from "react-icons/md";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Assignment = RouterOutput["assignment"]["get"];
type Attachment = RouterOutput["assignment"]["get"]["attachments"][number];

type FileData = {
    id: string;
    name: string;
    type: string;
    size: number;
    data: string;
};

type AssignmentData = Assignment & {
    refetch: boolean;
    newAttachments: FileData[];
    removedAttachments: { id: string; }[];
};

export default function AssignmentList({ params }: { params: { classId: string, assignmentId: string } }) {
    const [assignmentData, setAssignmentData] = useState<AssignmentData>({} as AssignmentData);
    const appState = useSelector((state: RootState) => state.app);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(true);
    const router = useRouter();

    const [classId, setClassId] = useState<string | null>(null);
    const dispatch = useDispatch();
    const fileInput = useRef<HTMLInputElement | null>(null);

    const { data: assignment, isLoading, refetch: refetchAssignment } = trpc.assignment.get.useQuery({ 
        id: params.assignmentId,
        classId: params.classId
    });

    useEffect(() => {
        if (assignment) {
            setAssignmentData({
                ...assignment,
            } as AssignmentData);
        }
    }, [assignment]);

    useEffect(() => {
        const socket = initializeSocket();
        
        // Join the class room
        joinClass(params.classId);

        socket.on('assignment-updated', (updatedAssignment: AssignmentData) => {
            setAssignmentData((prev) => {
                if (!prev) return {
                    ...updatedAssignment,
                    refetch: false,
                    newAttachments: [],
                    removedAttachments: [],
                    sections: [],
                    // sections: updatedAssignment.sections || [],
                } as AssignmentData;
                return {
                    ...prev,
                    ...updatedAssignment,
                } satisfies AssignmentData;
            });
        });

    }, [params.classId]);

    useEffect(() => {
        if (assignment) {
            setAssignmentData({
                ...assignment,
                refetch: false,
                newAttachments: [],
                removedAttachments: [],
                sections: assignment.sections || [],
            } as AssignmentData);
            setClassId(assignment.classId);
            dispatch(setRefetch(false));
            setIsSaved(true);
            joinClass(assignment.classId);
            emitAssignmentUpdate(assignment.classId, assignment);
        }
    }, [assignment]);

    useEffect(() => {
        if (!assignmentData) return;
        if (!assignmentData.refetch) return;

        saveChanges();
    }, [assignmentData]);

    useEffect(() => {
        setIsSaved(false);
    }, [assignmentData]);

    const updateAssignment = trpc.assignment.update.useMutation<RouterOutputs['assignment']['update']>({
        onSuccess: (data) => {
            dispatch(setRefetch(true));
            setIsSaving(false);
            setIsSaved(true);
            // Reset refetch flag and clear attachment arrays after successful save
            setAssignmentData(prev => ({
                ...prev,
                refetch: false,
                newAttachments: [],
                removedAttachments: []
            }));
            emitAssignmentUpdate(params.classId, data);
        },
        onError: (error) => {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: error.message || 'Failed to update assignment',
            }));
            setIsSaving(false);
        }
    });

    const saveChanges = () => {
        if (!assignmentData) return;
        
        setIsSaving(true);
        updateAssignment.mutate({
            classId: params.classId,
            id: params.assignmentId,
            title: assignmentData.title,
            instructions: assignmentData.instructions,
            dueDate: assignmentData.dueDate ? new Date(assignmentData.dueDate).toISOString() : undefined,
            maxGrade: assignmentData.maxGrade ?? undefined,
            graded: assignmentData.graded,
            weight: assignmentData.weight ?? undefined,
            type: assignmentData.type as "HOMEWORK" | "QUIZ" | "TEST" | "PROJECT" | "ESSAY" | "DISCUSSION" | "PRESENTATION" | "LAB" | "OTHER",
            sectionId: assignmentData.section?.id || null,
            files: assignmentData.newAttachments?.map(file => ({
                name: file.name,
                type: file.type,
                size: file.size,
                data: file.data
            })) || [],
            removedAttachments: assignmentData.removedAttachments?.map(a => a.id) || [],
        });
    };

    const handleAttachGrading = () => {
        dispatch(openModal({
            header: 'Attach Grading Tools',
            body: (
                <AttachGradingToAssignment
                    classId={params.classId}
                    assignmentId={params.assignmentId}
                    currentMarkSchemeId={assignmentData?.markScheme?.id || null}
                    currentGradingBoundaryId={assignmentData?.gradingBoundary?.id || null}
                    onSuccess={refetchAssignment}
                />
            )
        }));
    };

    if (isLoading || !assignmentData.sections) {
        return <div className="flex justify-center items-center h-full w-full">
            <Loading />
        </div>
    }

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
                <Button.Light onClick={() => router.back()}>
                    <HiArrowLeft className="w-4 h-4" />
                </Button.Light>
                <h1 className="font-semibold text-xl text-foreground-primary">Edit Assignment</h1>
            </div>

            {assignmentData && (
                <div className="flex flex-row space-x-6">
                    <div className="flex-1">
                        <Card className="flex flex-col space-y-6">
                            <Input.Text
                                label="Title"
                                type="text"
                                value={assignmentData.title}
                                onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })} 
                            />
                            
                            <Input.Textarea
                                className="w-full"
                                label="Instructions"
                                value={assignmentData.instructions}
                                onChange={(e) => setAssignmentData({ ...assignmentData, instructions: e.target.value })} 
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input.Text
                                    type="date"
                                    label="Due Date"
                                    value={assignmentData.dueDate?.toString().slice(0, 10)}
                                    onChange={(e) => setAssignmentData({
                                        ...assignmentData,
                                        refetch: false,
                                        dueDate: e.target.value,
                                    })} 
                                />

                                <div className="space-y-2">
                                    <span className="text-sm font-semibold text-foreground-secondary">Section</span>
                                    <Input.Select
                                        className="w-full"
                                        onChange={(e) => {
                                            setAssignmentData({
                                                ...assignmentData,
                                                refetch: true,
                                                section: e.target.value === 'none' ? null : {
                                                    name: '',
                                                    id: e.target.value,
                                                },
                                                sectionId: e.target.value === 'none' ? null : e.target.value
                                            });
                                        }}
                                        value={assignmentData?.section?.id ? assignmentData.section.id : 'none'}
                                    >
                                        {assignmentData.sections.map((section: { id: string, name: string}, index: number) => (
                                            <option key={index} value={section.id}>{section.name}</option>
                                        ))}
                                        <option value='none'>None</option>
                                    </Input.Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <span className="text-sm font-semibold text-foreground-secondary">Assignment Type</span>
                                    <Input.Select
                                        className="w-full"
                                        value={assignmentData.type || 'HOMEWORK'}
                                        onChange={(e) => setAssignmentData({ 
                                            ...assignmentData, 
                                            type: e.target.value as AssignmentData['type'] 
                                        })}
                                    >
                                        {assignmentTypes.map(assignmentType => (
                                            <option key={assignmentType} value={assignmentType}>
                                                <IconFrame className="p-1 size-6">{getAssignmentIcon(assignmentType)}</IconFrame>
                                                <span>{formatAssignmentType(assignmentType)}</span>
                                            </option>
                                        ))}
                                    </Input.Select>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox 
                                        checked={assignmentData.graded} 
                                        onChange={() => setAssignmentData({ ...assignmentData, graded: !assignmentData.graded})} 
                                    />
                                    <label htmlFor="graded" className="text-sm font-semibold">Graded Assignment</label>
                                </div>
                                        
                                {assignmentData.graded && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input.Text 
                                            label={assignmentData.markSchemeId ? "Computed Max Score" : "Max Score"} 
                                            onChange={(e) => setAssignmentData({...assignmentData, maxGrade: parseInt(e.currentTarget.value)})} 
                                            value={assignmentData.maxGrade ?? 0} 
                                            disabled={assignmentData.markSchemeId}
                                            type="number" 
                                        />
                                        <Input.Text 
                                            label="Weight" 
                                            onChange={(e) => setAssignmentData({...assignmentData, weight: parseInt(e.currentTarget.value)})} 
                                            value={assignmentData.weight ?? 0} 
                                            type="number" 
                                        />
                                    </div>
                                )}

                            </div>

                            {/* Show grading information if any */}
                            <div className="border-t border-border-secondary pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-foreground-secondary">Grading Tools</span>
                                    <Button.Primary onClick={handleAttachGrading} className="flex items-center gap-2">
                                        <MdChecklist className="w-4 h-4" />
                                        Attach
                                    </Button.Primary>
                                </div>
                                {(assignmentData.markScheme || assignmentData.gradingBoundary) ? (
                                    <GradingInfo
                                        markScheme={assignmentData.markScheme}
                                        gradingBoundary={assignmentData.gradingBoundary}
                                        readonly={true}
                                    />
                                ) : (
                                    <Empty
                                        icon={MdChecklist}
                                        title="No Grading Tools"
                                        description="No markscheme or grading boundary has been attached to this assignment."
                                    />
                                )}
                            </div>

                            {!isSaved && (
                                <div className="flex justify-end">
                                    <Button.Primary 
                                        onClick={saveChanges}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button.Primary>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="w-80">
                        <Card className="flex flex-col space-y-4">
                            <div className="text-lg font-semibold">Attachments</div>
                            
                            {assignmentData.attachments.length === 0 && (
                                <Empty 
                                    icon={HiPaperClip}
                                    title="No Attachments"
                                    description="No files have been attached to this assignment."
                                /> 
                            )}
                            
                            {assignmentData.attachments.map((attachment: Attachment, index: number) => (
                                <FileEdit
                                    key={index}
                                    src={attachment.id}
                                    name={attachment.name}
                                    type={attachment.type}
                                    thumbnailId={attachment.thumbnailId}
                                    onDelete={() => {
                                        setAssignmentData({
                                            ...assignmentData,
                                            refetch: true,
                                            attachments: [...assignmentData.attachments.filter((_attachment: Attachment) => _attachment.id !== attachment.id)],
                                            removedAttachments: [{ id: attachment.id }],
                                        })
                                    }} 
                                />
                            ))}
                            
                            <div className="flex flex-col space-y-3">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInput} 
                                    onChange={(e) => {
                                        if (!e.target.files || !e.target.files[0]) return;

                                        fileToBase64(e.target.files[0]).then(base64 => {
                                            if (!e.target.files || !e.target.files[0]) return;
                                            if (!base64) return;

                                            setAssignmentData({
                                                ...assignmentData,
                                                refetch: true,
                                                newAttachments: [
                                                    ...(assignmentData.newAttachments || []),
                                                    {
                                                        id: v4(),
                                                        name: e.target.files[0].name,
                                                        type: e.target.files[0].type,
                                                        size: e.target.files[0].size,
                                                        data: base64.toString(),
                                                    },
                                                ]
                                            });
                                            
                                            e.target.files = null;
                                            e.target.value = '';
                                        });
                                    }} 
                                />
                                
                                <Button.Primary 
                                    onClick={() => fileInput?.current?.click()}
                                    className="w-full"
                                >
                                    Attach File
                                </Button.Primary>
                            </div>
                        </Card>

                        <Card className="flex flex-col space-y-4 mt-4">
                            <div className="text-lg font-semibold">Event Attachment</div>
                            
                            {assignmentData.eventAttached ? (
                                <AttachedEvent
                                    assignmentId={params.assignmentId}
                                    event={assignmentData.eventAttached}
                                    classId={assignmentData.classId}
                                    isTeacher={appState.user.teacher}
                                    onEventDetached={() => {
                                        setAssignmentData({
                                            ...assignmentData,
                                            eventAttached: null,
                                        });
                                    }}
                                />
                            ) : (
                                <Empty 
                                    icon={HiCalendar}
                                    title="No Event Attached"
                                    description="This assignment is not attached to any event."
                                />
                            )}
                            
                            <Button.Primary
                                onClick={() => dispatch(openModal({
                                    body: <AttachEventToAssignment 
                                        assignmentId={params.assignmentId}
                                        classId={params.classId}
                                        onEventAttached={() => {
                                            // Refetch assignment data to get updated event info
                                            refetchAssignment();
                                        }}
                                    />,
                                    header: 'Attach to Event'
                                }))}
                            >
                                Attach to Event
                            </Button.Primary>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}