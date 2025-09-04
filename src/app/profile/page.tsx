"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { trpc } from "@/utils/trpc";
import Loading from "@/components/Loading";
import ProfileView from "@/components/profile/ProfileView";
import ProfileEdit from "@/components/profile/ProfileEdit";
import PasswordChange from "@/components/profile/PasswordChange";
import { useState } from "react";

export default function ProfilePage() {
    const appState = useSelector((state: RootState) => state.app);
    const [isEditing, setIsEditing] = useState(false);

    // Create a mock user object from the app state for now
    // This will be replaced with actual tRPC calls when backend routes are implemented
    const mockUser = {
        id: appState.user.id,
        username: appState.user.username,
        email: 'user@example.com', // This would come from the backend
        firstName: '',
        lastName: '',
        bio: '',
        profilePicUrl: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        teacher: appState.user.teacher,
        student: appState.user.student,
    };

    const refetch = () => {
        // This would trigger a refetch when backend routes are implemented
        console.log('Refetching profile data...');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">
                    Profile
                </h1>
                <p className="text-foreground-muted mt-2">
                    Manage your account information and preferences
                </p>
            </div>

            {isEditing ? (
                <ProfileEdit
                    user={mockUser}
                    onSave={() => {
                        setIsEditing(false);
                        refetch();
                    }}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div className="space-y-6">
                    <ProfileView
                        user={mockUser}
                        onEdit={() => setIsEditing(true)}
                    />
                    <PasswordChange onSuccess={refetch} />
                </div>
            )}
        </div>
    );
}
