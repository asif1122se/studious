import Button from "../ui/Button";
import { HiCheck, HiPencil, HiTrash } from "react-icons/hi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAlert, setRefetch } from "@/store/appSlice";
import IconFrame from "../ui/IconFrame";
import { RootState } from "@/store/store";
import Textbox from "../ui/Textbox";
import { RouterOutputs, trpc } from "@/utils/trpc";
import { RouterInputs } from "@/utils/trpc";
import Card from "../ui/Card";
import ProfilePicture from '../ui/ProfilePicture';
import { AlertLevel } from "@/lib/alertLevel";
import Badge from "../Badge";
import { fmtDate } from "@/lib/time";

export default function Announcement({
    classId,
    id,
    remarks,
    user,
    onUpdate,
    onDelete,
}: {
    id: string,
    classId: string,
    remarks: string,
    user: {
        id: string,
        username: string,
        profilePicUrl?: string,
    }
    onUpdate: (result: RouterOutputs['announcement']['update']) => void,
    onDelete: () => void,
}) {
    const dispatch = useDispatch();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<RouterInputs['announcement']['create']>({
        remarks: remarks,
        classId: classId,
    });

    // Get the current user from Redux state
    const currentUser = useSelector((state: RootState) => state.app.user);

    // Check if the current user is the creator of the announcement
    const canEdit = currentUser.id === user.id;

    const updateAnnouncement = trpc.announcement.update.useMutation({
        onSuccess: (result) => {
            setEditing(false);
            dispatch(setRefetch(true));
            dispatch(addAlert({ level: AlertLevel.SUCCESS, remark: "Announcement updated successfully" }));
            onUpdate(result);
        },
        onError: (error) => {
            dispatch(addAlert({ level: AlertLevel.ERROR, remark: error.message }));
        },
    });

    const deleteAnnouncement = trpc.announcement.delete.useMutation({
        onSuccess: () => {
            dispatch(setRefetch(true));
            dispatch(addAlert({ level: AlertLevel.SUCCESS, remark: "Announcement deleted successfully" }));
            onDelete();
        },
        onError: (error) => {
            dispatch(addAlert({ level: AlertLevel.ERROR, remark: error.message }));
        },
    });

    return (
        <Card className="hover:shadow-lg transition-all duration-200">
            <div className="flex items-start space-x-4">

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <ProfilePicture
                                username={user.username}
                                size="sm"
                            />
                            <span className="font-semibold text-foreground-primary">
                                {user.username}
                            </span>
                            <Badge variant="foreground">
                                {fmtDate(new Date())}
                            </Badge>
                        </div>
                        {canEdit && (
                            <div className="flex items-center space-x-2">
                                <Button.SM
                                    onClick={() => setEditing(true)}
                                >
                                    <HiPencil className="h-4 w-4" />
                                </Button.SM>
                                <Button.SM
                                    className="text-foreground-muted hover:text-error hover:bg-error-50 dark:hover:bg-error-900/20"
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this announcement?")) {
                                            deleteAnnouncement.mutate({ id });
                                        }
                                    }}
                                >
                                    <HiTrash className="h-4 w-4" />
                                </Button.SM>
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        {editing ? (
                            <div className="space-y-4">
                                <Textbox
                                    content={form.remarks}
                                    onChange={(content) => setForm({ ...form, remarks: content })}
                                />
                                <div className="flex items-center space-x-3">
                                    <Button.Primary
                                        onClick={() => {
                                            updateAnnouncement.mutate({
                                                id,
                                                data: {
                                                    content: form.remarks,
                                                },
                                            });
                                        }}
                                        className="flex items-center space-x-2"
                                    >
                                        <HiCheck className="h-4 w-4" />
                                        <span>Save Changes</span>
                                    </Button.Primary>
                                    <Button.Light
                                        onClick={() => setEditing(false)}
                                    >
                                        Cancel
                                    </Button.Light>
                                </div>
                            </div>
                        ) : (
                            <div className="richText">
                                <div dangerouslySetInnerHTML={{ __html: remarks }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}