"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAlert } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import { validate } from "@/lib/validation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProfilePicture from "@/components/ui/ProfilePicture";
import ProfilePictureModal from "./ProfilePictureModal";
import { HiCamera } from "react-icons/hi";
import Spinner from "@/components/ui/Spinner";
import { fmtDate } from "@/lib/time";

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

interface ProfileEditProps {
    user: User;
    onSave: () => void;
    onCancel: () => void;
}

const REQUIRED_FIELD_KEYS = [
    'firstName',
    'lastName',
    'bio'
];

export default function ProfileEdit({ user, onSave, onCancel }: ProfileEditProps) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPictureModal, setShowPictureModal] = useState(false);

    // TODO: Implement this mutation when backend routes are available
    const updateProfile = {
        mutate: (data: { firstName: string; lastName: string; bio: string }) => {
            dispatch(addAlert({
                level: AlertLevel.INFO,
                remark: "Profile update functionality will be implemented with backend routes"
            }));
            setIsSubmitting(false);
            onSave();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validated = validate(REQUIRED_FIELD_KEYS, formData);
        if (!validated.valid) {
            dispatch(addAlert({
                level: AlertLevel.WARNING,
                remark: validated.remark,
            }));
            return;
        }

        setIsSubmitting(true);
        updateProfile.mutate({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            bio: formData.bio.trim(),
        });
    };

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            bio: user.bio || '',
        });
        onCancel();
    };

    const handlePictureChange = (pictureUrl: string) => {
        // TODO: Implement profile picture update when backend routes are available
        dispatch(addAlert({
            level: AlertLevel.INFO,
            remark: "Profile picture update functionality will be implemented with backend routes"
        }));
    };

    const hasChanges = () => {
        return (
            formData.firstName !== (user.firstName || '') ||
            formData.lastName !== (user.lastName || '') ||
            formData.bio !== (user.bio || '')
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Edit Profile
                    </h2>
                    <p className="text-foreground-muted">
                        Update your personal information and bio
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture */}
                    <div>
                        <h3 className="text-lg font-medium text-foreground mb-4">
                            Profile Picture
                        </h3>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <ProfilePicture 
                                    username={user.username} 
                                    size="lg" 
                                    profilePicUrl={user.profilePicUrl}
                                />
                                <Button.SM
                                    className="absolute -bottom-1 -right-1 bg-primary-600 hover:bg-primary-700 text-white p-1 flex items-center justify-center"
                                    onClick={() => setShowPictureModal(true)}
                                >
                                    <HiCamera className="h-3 w-3" />
                                </Button.SM>
                            </div>
                            <div>
                                <p className="text-sm text-foreground-muted">
                                    Click the camera icon to change your profile picture
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-medium text-foreground mb-4">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input.Text
                                label="First Name"
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="Enter your first name"
                                maxLength={50}
                            />
                            <Input.Text
                                label="Last Name"
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Enter your last name"
                                maxLength={50}
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <h3 className="text-lg font-medium text-foreground mb-4">
                            About Me
                        </h3>
                        <Input.Textarea
                            label="Bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            maxLength={500}
                        />
                        <div className="text-sm text-foreground-muted text-right">
                            {formData.bio.length}/500 characters
                        </div>
                    </div>

                    {/* Account Information (Read-only) */}
                    <div>
                        <h3 className="text-lg font-medium text-foreground mb-4">
                            Account Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground-muted mb-1">
                                    Username
                                </label>
                                <p className="text-foreground bg-background-muted px-3 py-2 rounded-md">
                                    {user.username}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground-muted mb-1">
                                    Email Address
                                </label>
                                <p className="text-foreground bg-background-muted px-3 py-2 rounded-md">
                                    {user.email}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground-muted mb-1">
                                    Account Type
                                </label>
                                <p className="text-foreground bg-background-muted px-3 py-2 rounded-md">
                                    {user.teacher ? 'Teacher' : 'Student'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground-muted mb-1">
                                    Member Since
                                </label>
                                <p className="text-foreground bg-background-muted px-3 py-2 rounded-md">
                                    {fmtDate(user.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                        <Button.Light onClick={handleCancel} disabled={isSubmitting}>
                            Cancel
                        </Button.Light>
                        <Button.Primary 
                            type="submit" 
                            isLoading={isSubmitting}
                            disabled={!hasChanges() || isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button.Primary>
                    </div>
                </form>
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
