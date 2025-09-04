"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAlert } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import { validate } from "@/lib/validation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface PasswordChangeProps {
    onSuccess?: () => void;
}

const REQUIRED_FIELD_KEYS = [
    'currentPassword',
    'newPassword',
    'confirmPassword'
];

export default function PasswordChange({ onSuccess }: PasswordChangeProps) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // TODO: Implement this mutation when backend routes are available
    const changePassword = {
        mutate: (data: { currentPassword: string; newPassword: string }) => {
            dispatch(addAlert({
                level: AlertLevel.INFO,
                remark: "Password change functionality will be implemented with backend routes"
            }));
            setIsSubmitting(false);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            onSuccess?.();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        const validated = validate(REQUIRED_FIELD_KEYS, formData);
        if (!validated.valid) {
            dispatch(addAlert({
                level: AlertLevel.WARNING,
                remark: validated.remark,
            }));
            return;
        }

        // Validate password strength
        if (formData.newPassword.length < 8) {
            dispatch(addAlert({
                level: AlertLevel.WARNING,
                remark: "New password must be at least 8 characters long",
            }));
            return;
        }

        // Validate password confirmation
        if (formData.newPassword !== formData.confirmPassword) {
            dispatch(addAlert({
                level: AlertLevel.WARNING,
                remark: "New passwords do not match",
            }));
            return;
        }

        // Validate that new password is different from current
        if (formData.currentPassword === formData.newPassword) {
            dispatch(addAlert({
                level: AlertLevel.WARNING,
                remark: "New password must be different from current password",
            }));
            return;
        }

        setIsSubmitting(true);
        changePassword.mutate({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        });
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const getPasswordStrength = (password: string) => {
        if (!password) return { score: 0, label: '', color: '' };
        
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        const strengthMap = {
            0: { label: 'Very Weak', color: 'text-red-500' },
            1: { label: 'Weak', color: 'text-red-400' },
            2: { label: 'Fair', color: 'text-yellow-500' },
            3: { label: 'Good', color: 'text-yellow-400' },
            4: { label: 'Strong', color: 'text-green-500' },
            5: { label: 'Very Strong', color: 'text-green-600' }
        };
        
        return { score, ...strengthMap[score as keyof typeof strengthMap] };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);

    return (
        <Card>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    Change Password
                </h3>
                <p className="text-foreground-muted">
                    Update your password to keep your account secure
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                <div className="relative">
                    <Input.Text
                        label="Current Password"
                        type={showPasswords.current ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        placeholder="Enter your current password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-8 text-foreground-muted hover:text-foreground"
                    >
                        {showPasswords.current ? <HiEyeOff className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                    </button>
                </div>

                {/* New Password */}
                <div className="relative">
                    <Input.Text
                        label="New Password"
                        type={showPasswords.new ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        placeholder="Enter your new password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-8 text-foreground-muted hover:text-foreground"
                    >
                        {showPasswords.new ? <HiEyeOff className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                    </button>
                    
                    {/* Password Strength Indicator */}
                    {formData.newPassword && (
                        <div className="mt-2">
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 w-8 rounded-full ${
                                                level <= passwordStrength.score
                                                    ? passwordStrength.color.replace('text-', 'bg-')
                                                    : 'bg-background-muted'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className={`text-sm ${passwordStrength.color}`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm New Password */}
                <div className="relative">
                    <Input.Text
                        label="Confirm New Password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Confirm your new password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-8 text-foreground-muted hover:text-foreground"
                    >
                        {showPasswords.confirm ? <HiEyeOff className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                    </button>
                    
                    {/* Password Match Indicator */}
                    {formData.confirmPassword && (
                        <div className="mt-2">
                            <span className={`text-sm ${
                                formData.newPassword === formData.confirmPassword
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}>
                                {formData.newPassword === formData.confirmPassword
                                    ? '✓ Passwords match'
                                    : '✗ Passwords do not match'
                                }
                            </span>
                        </div>
                    )}
                </div>

                {/* Password Requirements */}
                <div className="bg-background-muted p-4 rounded-md">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                        Password Requirements:
                    </h4>
                    <ul className="text-sm text-foreground-muted space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Contains uppercase and lowercase letters</li>
                        <li>• Contains at least one number</li>
                        <li>• Contains at least one special character</li>
                    </ul>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-4">
                    <Button.Primary 
                        type="submit" 
                        isLoading={isSubmitting}
                        disabled={isSubmitting || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                    >
                        {isSubmitting ? 'Changing Password...' : 'Change Password'}
                    </Button.Primary>
                </div>
            </form>
        </Card>
    );
}
