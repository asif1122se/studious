"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { HiDocumentText, HiBell, HiAcademicCap, HiGlobe, HiTrash } from "react-icons/hi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useState } from "react";
import ConfirmDialog, { useConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function SettingsPage() {
    const appState = useSelector((state: RootState) => state.app);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        assignments: true,
        announcements: true,
    });
    const { confirm, dialogProps } = useConfirmDialog();

    const handleDeleteAccount = () => {
        confirm(
            'Delete Account',
            'This action is permanent and cannot be undone. All your data will be deleted.',
            () => {
                // TODO: implement actual account deletion API call
                console.log('Account deletion confirmed');
            },
            'danger'
        );
    };

    const handleNotificationToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">
                    Settings
                </h1>
                <p className="text-foreground-muted mt-2">
                    Manage your account preferences and settings
                </p>
            </div>

            <div className="space-y-6">
                {/* Account Settings */}
                <Card>
                    <div className="flex items-center space-x-3 mb-4">
                        <HiDocumentText className="h-5 w-5 text-primary-600" />
                        <h2 className="text-xl font-semibold text-foreground">
                            Account Settings
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Username</h3>
                                <p className="text-sm text-foreground-muted">@{appState.user.username}</p>
                            </div>
                            <Button.Light>Change</Button.Light>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Email Address</h3>
                                <p className="text-sm text-foreground-muted">user@example.com</p>
                            </div>
                            <Button.Light>Change</Button.Light>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Account Type</h3>
                                <p className="text-sm text-foreground-muted">
                                    {appState.user.teacher ? 'Teacher' : 'Student'}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <div className="flex items-center space-x-3 mb-4">
                        <HiBell className="h-5 w-5 text-primary-600" />
                        <h2 className="text-xl font-semibold text-foreground">
                            Notifications
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Email Notifications</h3>
                                <p className="text-sm text-foreground-muted">Receive notifications via email</p>
                            </div>
                            <Toggle
                                checked={notifications.email}
                                onToggle={() => handleNotificationToggle('email')}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Push Notifications</h3>
                                <p className="text-sm text-foreground-muted">Receive notifications in browser</p>
                            </div>
                            <Toggle
                                checked={notifications.push}
                                onToggle={() => handleNotificationToggle('push')}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Assignment Reminders</h3>
                                <p className="text-sm text-foreground-muted">Get notified about upcoming assignments</p>
                            </div>
                            <Toggle
                                checked={notifications.assignments}
                                onToggle={() => handleNotificationToggle('assignments')}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Announcements</h3>
                                <p className="text-sm text-foreground-muted">Get notified about class announcements</p>
                            </div>
                            <Toggle
                                checked={notifications.announcements}
                                onToggle={() => handleNotificationToggle('announcements')}
                            />
                        </div>
                    </div>
                </Card>

                

                {/* Appearance Settings */}
                <Card>
                    <div className="flex items-center space-x-3 mb-4">
                        <HiGlobe className="h-5 w-5 text-primary-600" />
                        <h2 className="text-xl font-semibold text-foreground">
                            Appearance
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Dark Mode</h3>
                                <p className="text-sm text-foreground-muted">Switch between light and dark themes</p>
                            </div>
                            <Toggle
                                checked={darkMode}
                                onToggle={() => setDarkMode(!darkMode)}
                            />
                        </div>
                    </div>
                </Card>

                {/* Privacy & Security */}
                <Card>
                    <div className="flex items-center space-x-3 mb-4">
                        <HiAcademicCap className="h-5 w-5 text-primary-600" />
                        <h2 className="text-xl font-semibold text-foreground">
                            Privacy & Security
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                                <p className="text-sm text-foreground-muted">Add an extra layer of security</p>
                            </div>
                            <Button.Light>Enable</Button.Light>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Login History</h3>
                                <p className="text-sm text-foreground-muted">View recent login activity</p>
                            </div>
                            <Button.Light>View</Button.Light>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Data Export</h3>
                                <p className="text-sm text-foreground-muted">Download your data</p>
                            </div>
                            <Button.Light>Export</Button.Light>
                        </div>
                    </div>
                </Card>

                {/* Danger Zone */}
                <Card>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-red-600">
                            Danger Zone
                        </h2>
                        <p className="text-sm text-foreground-muted">
                            Irreversible and destructive actions
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-foreground">Delete Account</h3>
                                <p className="text-sm text-foreground-muted">
                                    Permanently delete your account and all associated data
                                </p>
                            </div>
                            <Button.Primary onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                                <span className="inline-flex items-center space-x-2">
                                    <HiTrash className="w-4 h-4" />
                                    <span>Delete Account</span>
                                </span>
                            </Button.Primary>
                        </div>
                    </div>
                </Card>
                <ConfirmDialog {...dialogProps} confirmText="Delete" cancelText="Cancel" variant="danger" />
            </div>
        </div>
    );
}
