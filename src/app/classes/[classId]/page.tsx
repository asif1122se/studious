"use client";

import { trpc } from "@/utils/trpc";
import type { RouterOutputs } from "@/utils/trpc";
import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, setRefetch } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { HiSpeakerphone, HiAcademicCap, HiUserGroup, HiCalendar, HiPencil, HiTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import Textbox from "@/components/ui/Textbox";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loading from "@/components/Loading";
import Empty from "@/components/ui/Empty";
import { emitNewAnnouncement, initializeSocket, joinClass, leaveClass } from "@/lib/socket";
import Card from "@/components/ui/Card";
import { getContrastingTextColor } from "@/utils/color";
import IconFrame from "@/components/ui/IconFrame";

type ClassData = RouterOutputs['class']['get']['class'];
type Announcement = ClassData['announcements'][number];

export default function ClassHome({ params }: { params: { classId: string } }) {
    const { classId } = params;
    const [classProps, setClassProps] = useState<ClassData | null>(null);
    const [announcementTitle, setAnnouncementTitle] = useState<string>('');
    const [announcementContent, setAnnouncementContent] = useState<string>('');
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const appState = useSelector((state: RootState) => state.app);
    const dispatch = useDispatch();

    const { mutate: createAnnouncement } = trpc.announcement.create.useMutation();
    const { mutate: updateAnnouncement } = trpc.announcement.update.useMutation();
    const { mutate: deleteAnnouncement } = trpc.announcement.delete.useMutation();

    useEffect(() => {
        // Initialize socket connection
        const socket = initializeSocket();

        // Join class room
        joinClass(classId);

        // Handle new announcements
        socket.on('announcement-created', (announcement: Announcement) => {
            setClassProps((prev: ClassData | null) => {
                if (!prev) return null;
                return {
                    ...prev,
                    announcements: [announcement, ...prev.announcements]
                };
            });
        });

        // Cleanup on unmount
        return () => {
            leaveClass(classId);
            socket.off('announcement-created');
        };
    }, [classId]);

    const { data: classData, isLoading } = trpc.class.get.useQuery({ classId });

    useEffect(() => {
        if (classData?.class) {
            setClassProps({
                ...classData.class,
                announcements: classData.class.announcements.sort((a: Announcement, b: Announcement) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
            });
        }
    }, [classData]);

    const handleDeleteAnnouncement = async (id: string) => {
        try {
            deleteAnnouncement({ id });
            dispatch(addAlert({ level: AlertLevel.SUCCESS, remark: "Announcement deleted successfully" }));
        } catch (error) {
            dispatch(addAlert({ level: AlertLevel.ERROR, remark: "Failed to delete announcement" }));
        }
    };

    const handleSubmitAnnouncement = () => {
        if (!announcementTitle.trim()) {
            dispatch(addAlert({ level: AlertLevel.ERROR, remark: "Please enter a title" }));
            return;
        }

        const formattedContent = `<h1>${announcementTitle}</h1>${announcementContent}`;

        if (editingAnnouncement) {
            updateAnnouncement({
                id: editingAnnouncement.id,
                data: {
                    content: formattedContent,
                },
            }, {
                onSuccess: () => {
                    dispatch(setRefetch(true));
                    dispatch(addAlert({ level: AlertLevel.SUCCESS, remark: "Announcement updated successfully" }));
                    resetEditor();
                },
                onError: () => {
                    dispatch(addAlert({ level: AlertLevel.ERROR, remark: "Failed to update announcement" }));
                }
            });
        } else {
            createAnnouncement({
                classId,
                remarks: formattedContent,
            }, {
                onSuccess: (data) => {
                    emitNewAnnouncement(classId, data.announcement);
                    dispatch(setRefetch(true));
                    dispatch(addAlert({ level: AlertLevel.SUCCESS, remark: "Announcement created successfully" }));
                    resetEditor();
                },
                onError: () => {
                    dispatch(addAlert({ level: AlertLevel.ERROR, remark: "Failed to create announcement" }));
                }
            });
        }
    };

    const resetEditor = () => {
        setAnnouncementTitle("");
        setAnnouncementContent("");
        setEditingAnnouncement(null);
    };

    const handleEditAnnouncement = (announcement: Announcement) => {
        const titleMatch = announcement.remarks.match(/<h1>(.*?)<\/h1>/);
        if (titleMatch) {
            setAnnouncementTitle(titleMatch[1]);
            setAnnouncementContent(announcement.remarks.replace(/<h1>.*?<\/h1>/, ''));
        } else {
            setAnnouncementContent(announcement.remarks);
        }
        setEditingAnnouncement(announcement);
    };

    if (!classProps) {
        return <div className="w-full h-full flex items-center justify-center">
            <Loading />
        </div>;
    }

    const classColor = classProps.color ?? '#3B82F6';
    const textColor = getContrastingTextColor(classColor);

    return (
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto">

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Announcement Editor */}
                    {appState.user.teacher && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <IconFrame>
                                        <HiSpeakerphone className="h-5 w-5" />
                                    </IconFrame>
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
                                        </h2>
                                        <p className="text-sm text-foreground-muted">
                                            {editingAnnouncement ? 'Update your announcement' : 'Share important updates with your class'}
                                        </p>
                                    </div>
                                </div>
                                {editingAnnouncement && (
                                    <Button.SM
                                        onClick={resetEditor}
                                        className="text-foreground-muted hover:text-foreground"
                                    >
                                        Cancel
                                    </Button.SM>
                                )}
                            </div>
                            <div className="space-y-4">
                                <Input.Text
                                    value={announcementTitle}
                                    placeholder="Announcement Title"
                                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                                    className="w-full"
                                />
                                {announcementTitle.length > 0 && (
                                    <div className="space-y-4">
                                        <Textbox
                                            content={announcementContent}
                                            onChange={(content) => setAnnouncementContent(content)}
                                        />
                                        <Button.Primary 
                                            onClick={handleSubmitAnnouncement}
                                            className="w-full"
                                        >
                                            {editingAnnouncement ? 'Update Announcement' : 'Post Announcement'}
                                        </Button.Primary>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Announcements List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                Announcements
                            </h2>
                        </div>

                        {classProps.announcements.length > 0 ? (
                            <div className="space-y-4">
                                {classProps.announcements.map((announcement: Announcement, index: number) => (
                                    <Card key={index} className="p-6 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-start space-x-4">
                                            <IconFrame>
                                                <HiSpeakerphone className="h-5 w-5" />
                                            </IconFrame>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-foreground-primary">
                                                            {announcement.teacher.username}
                                                        </span>
                                                        <span className="text-sm text-foreground-muted">
                                                            {new Date(announcement.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {appState.user.teacher && (
                                                        <div className="flex items-center space-x-2">
                                                            <Button.SM 
                                                                onClick={() => handleEditAnnouncement(announcement)}
                                                                className="flex items-center text-foreground hover:text-primary-500"
                                                            >
                                                                <HiPencil className="h-5 w-5" />
                                                            </Button.SM>
                                                            <Button.SM 
                                                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                                className="flex items-center text-foreground hover:text-error"
                                                            >
                                                                <HiTrash className="h-5 w-5" />
                                                            </Button.SM>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="prose prose-sm max-w-none">
                                                    <div dangerouslySetInnerHTML={{ __html: announcement.remarks }} />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-6">
                                <Empty 
                                    icon={HiSpeakerphone}
                                    title="No Announcements"
                                    description="There are no announcements in this class yet."
                                />
                            </Card>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Class Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <IconFrame>
                                    <HiAcademicCap className="h-5 w-5" />
                                </IconFrame>
                                <div>
                                    <p className="text-sm text-foreground-muted">Subject</p>
                                    <p className="font-medium">{classProps.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <IconFrame>
                                    <HiUserGroup className="h-5 w-5" />
                                </IconFrame>
                                <div>
                                    <p className="text-sm text-foreground-muted">Section</p>
                                    <p className="font-medium">Section {classProps.section}</p>
                                </div>
                            </div>
                            {/* <div className="flex items-center space-x-3">
                                <IconFrame>
                                    <HiCalendar className="h-5 w-5" />
                                </IconFrame>
                                <div>
                                    <p className="text-sm text-foreground-muted">Created</p>
                                    <p className="font-medium">{new Date(classProps.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div> */}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
