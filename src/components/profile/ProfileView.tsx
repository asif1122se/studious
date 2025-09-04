"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAlert } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProfilePicture from "@/components/ui/ProfilePicture";
import ProfilePictureModal from "./ProfilePictureModal";
import { HiPencil, HiCamera } from "react-icons/hi";
import { format } from "date-fns";

interface User {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePicUrl?: string;
    createdAt: string;
    updatedAt: string;
    teacher: boolean;
    student: boolean;
}

interface ProfileViewProps {
    user: User;
    onEdit: () => void;
}

export default function ProfileView({ user, onEdit }: ProfileViewProps) {
    const dispatch = useDispatch();
    const [showPictureModal, setShowPictureModal] = useState(false);

    // TODO: Implement these mutations when backend routes are available
    const updateProfilePicture = {
        mutate: (pictureUrl: string) => {
            dispatch(addAlert({
                level: AlertLevel.INFO,
                remark: "Profile picture update functionality will be implemented with backend routes"
            }));
        }
    };

    const handlePictureChange = (pictureUrl: string) => {
        updateProfilePicture.mutate(pictureUrl);
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMMM d, yyyy');
        } catch {
            return 'Unknown';
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <Card>
                <div className="flex items-start space-x-6">
                    <div className="relative">
                        <ProfilePicture 
                            username={user.username} 
                            size="xl" 
                            profilePicUrl={user.profilePicUrl}
                        />
                        <div className="absolute -bottom-2 -right-2">
                            <Button.SM
                                className="bg-primary-600 hover:bg-primary-700 text-white p-1 flex items-center justify-center"
                                onClick={() => setShowPictureModal(true)}
                            >
                                <HiCamera className="h-4 w-4" />
                            </Button.SM>
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    {user.firstName && user.lastName 
                                        ? `${user.firstName} ${user.lastName}`
                                        : user.username
                                    }
                                </h2>
                                <p className="text-foreground-muted">
                                    @{user.username}
                                </p>
                            </div>
                            <Button.Primary onClick={onEdit} className="flex items-center">
                                <HiPencil className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button.Primary>
                        </div>
                        
                        {user.bio && (
                            <div className="text-foreground mb-4">
                                <div 
                                    className="richText"
                                    dangerouslySetInnerHTML={{ __html: user.bio }}
                                />
                            </div>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
                            <div>
                                <span className="font-medium">Email:</span> {user.email}
                            </div>
                            <div>
                                <span className="font-medium">Role:</span> {user.teacher ? 'Teacher' : 'Student'}
                            </div>
                            <div>
                                <span className="font-medium">Member since:</span> {formatDate(user.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Account Information */}
            <Card>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                    Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground-muted mb-1">
                            Username
                        </label>
                        <p className="text-foreground">{user.username}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground-muted mb-1">
                            Email Address
                        </label>
                        <p className="text-foreground">{user.email}</p>
                    </div>
                    {user.firstName && (
                        <div>
                            <label className="block text-sm font-medium text-foreground-muted mb-1">
                                First Name
                            </label>
                            <p className="text-foreground">{user.firstName}</p>
                        </div>
                    )}
                    {user.lastName && (
                        <div>
                            <label className="block text-sm font-medium text-foreground-muted mb-1">
                                Last Name
                            </label>
                            <p className="text-foreground">{user.lastName}</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-foreground-muted mb-1">
                            Account Type
                        </label>
                        <p className="text-foreground">
                            {user.teacher ? 'Teacher' : 'Student'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground-muted mb-1">
                            Last Updated
                        </label>
                        <p className="text-foreground">{formatDate(user.updatedAt)}</p>
                    </div>
                </div>
            </Card>

            {/* Profile Picture Modal */}
            {showPictureModal && (
                <ProfilePictureModal
                    currentPictureUrl={user.profilePicUrl}
                    onClose={() => setShowPictureModal(false)}
                    onSave={handlePictureChange}
                />
            )}
        </div>
    );
}
