"use client";

import { trpc } from "@/utils/trpc";
import type { RouterOutputs } from "@/utils/trpc";
import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, setRefetch } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { HiSpeakerphone, HiAcademicCap, HiUserGroup, HiCalendar, HiPencil, HiTrash, HiArrowLeft } from "react-icons/hi";
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
import Link from "next/link";
import Announcement from "@/components/class/Announcement";

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
        <div className="min-h-screen">
            {/* Banner */}
            <div 
                className="relative overflow-hidden rounded-md mb-5"
                style={{ backgroundColor: classColor }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center space-x-4 mb-6">
                        <Link 
                            href="/classes"
                            className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                        >
                            <HiArrowLeft className="h-5 w-5" />
                            <span>Back to Classes</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">

                        <div>
                            <h1 className="text-4xl font-bold mb-2" style={{ color: textColor }}>
                                {classProps.subject}
                            </h1>
                            <p className="text-xl opacity-90" style={{ color: textColor }}>
                                Section {classProps.section}
                            </p>
                            <div className="flex items-center space-x-4 mt-3">
                                <div className="flex items-center space-x-2">
                                    <HiUserGroup className="h-5 w-5 opacity-80" style={{ color: textColor }} />
                                    <span className="opacity-80" style={{ color: textColor }}>
                                        {classProps.students?.length || 0} Students
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <HiSpeakerphone className="h-5 w-5 opacity-80" style={{ color: textColor }} />
                                    <span className="opacity-80" style={{ color: textColor }}>
                                        {classProps.announcements.length} Announcements
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className=" ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Announcement Editor */}
                        {appState.user.teacher && (
                            <Card className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <IconFrame>
                                            <HiSpeakerphone className="h-6 w-6" />
                                        </IconFrame>
                                        <div>
                                            <h2 className="text-xl font-semibold text-foreground-primary">
                                                {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
                                            </h2>
                                            <p className="text-sm text-foreground-muted">
                                                {editingAnnouncement ? 'Update your announcement' : 'Share important updates with your class'}
                                            </p>
                                        </div>
                                    </div>
                                    {editingAnnouncement && (
                                        <Button.Light
                                            onClick={resetEditor}
                                        >
                                            Cancel
                                        </Button.Light>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    <Input.Text
                                        value={announcementTitle}
                                        placeholder="Announcement Title"
                                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                                        className="w-full text-lg"
                                    />
                                    {announcementTitle.length > 0 && (
                                        <div className="space-y-6">
                                            <Textbox
                                                content={announcementContent}
                                                onChange={(content) => setAnnouncementContent(content)}
                                            />
                                            <Button.Primary 
                                                onClick={handleSubmitAnnouncement}
                                                className="w-full py-3 text-lg font-medium"
                                            >
                                                {editingAnnouncement ? 'Update Announcement' : 'Post Announcement'}
                                            </Button.Primary>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Announcements List */}
                        <div className="space-y-6">

                            {classProps.announcements.length > 0 ? (
                                <div className="space-y-6">
                                    {classProps.announcements.map((announcement: Announcement, index: number) => (
                                        <Announcement
                                            key={announcement.id}
                                            id={announcement.id}
                                            classId={classId}
                                            remarks={announcement.remarks}
                                            user={announcement.teacher}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <Card className="p-12 text-center">
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
                        <Card>
                            <h3 className="text-lg font-semibold mb-6 text-foreground-primary">Class Details</h3>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <IconFrame>
                                        <HiAcademicCap className="h-5 w-5" />
                                    </IconFrame>
                                    <div>
                                        <p className="text-sm text-foreground-muted">Subject</p>
                                        <p className="font-semibold text-foreground-primary">{classProps.subject}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <IconFrame>
                                        <HiUserGroup className="h-5 w-5" />
                                    </IconFrame>
                                    <div>
                                        <p className="text-sm text-foreground-muted">Section</p>
                                        <p className="font-semibold text-foreground-primary">Section {classProps.section}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
