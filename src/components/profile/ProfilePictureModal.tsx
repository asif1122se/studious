"use client";

import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addAlert } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { HiCamera, HiX, HiUpload, HiCheck } from "react-icons/hi";

interface ProfilePictureModalProps {
    currentPictureUrl?: string;
    onClose: () => void;
    onSave: (pictureUrl: string) => void;
}

// Avatar generation with actual avatar designs
const AVATAR_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F7DC6F', '#D7BDE2'
];

const AVATAR_STYLES = [
    { name: 'Simple Faces', type: 'face' },
    // { name: 'Geometric', type: 'geometric' },
    { name: 'Abstract', type: 'abstract' },
    { name: 'Patterns', type: 'pattern' },
    { name: 'Animals', type: 'animal' },
    { name: 'Robots', type: 'robot' },
];

const AVATAR_SEEDS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'
];

export default function ProfilePictureModal({ 
    currentPictureUrl, 
    onClose, 
    onSave 
}: ProfilePictureModalProps) {
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedTab, setSelectedTab] = useState<'upload' | 'avatars'>('upload');
    const [selectedAvatar, setSelectedAvatar] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const generateAvatarUrl = (style: any, seed: string, colorIndex: number) => {
        const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
        const symbol = seed;
        
        let svg;
        switch (style.type) {
            case 'face':
                // Simple face avatars with different expressions
                const expressions = [
                    // Happy
                    `<path d="M 48 80 Q 64 90 80 80" stroke="white" stroke-width="3" fill="none"/>`,
                    // Sad
                    `<path d="M 48 90 Q 64 80 80 90" stroke="white" stroke-width="3" fill="none"/>`,
                    // Surprised
                    `<circle cx="64" cy="80" r="6" fill="white"/>`,
                    // Wink
                    `<path d="M 48 48 Q 52 52 56 48" stroke="white" stroke-width="3" fill="none"/>
                     <circle cx="80" cy="48" r="4" fill="white"/>
                     <path d="M 48 80 Q 64 90 80 80" stroke="white" stroke-width="3" fill="none"/>`,
                    // Serious
                    `<path d="M 48 48 L 56 48" stroke="white" stroke-width="3" fill="none"/>
                     <path d="M 72 48 L 80 48" stroke="white" stroke-width="3" fill="none"/>
                     <path d="M 48 80 L 80 80" stroke="white" stroke-width="3" fill="none"/>`,
                    // Laughing
                    `<path d="M 48 80 Q 64 100 80 80" stroke="white" stroke-width="3" fill="none"/>
                     <path d="M 64 70 Q 64 75 64 80" stroke="white" stroke-width="2" fill="none"/>`,
                    // Cool
                    `<circle cx="48" cy="48" r="4" fill="white"/>
                     <circle cx="80" cy="48" r="4" fill="white"/>
                     <path d="M 48 80 Q 64 85 80 80" stroke="white" stroke-width="3" fill="none"/>
                     <path d="M 64 40 L 64 50" stroke="white" stroke-width="2" fill="none"/>`,
                    // Sleepy
                    `<path d="M 48 48 Q 52 46 56 48" stroke="white" stroke-width="3" fill="none"/>
                     <path d="M 72 48 Q 76 46 80 48" stroke="white" stroke-width="3" fill="none"/>
                     <path d="M 48 80 Q 64 85 80 80" stroke="white" stroke-width="3" fill="none"/>
                     <path d="M 64 70 Q 64 72 64 74" stroke="white" stroke-width="2" fill="none"/>`
                ];
                
                svg = `
                    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="64" cy="64" r="56" fill="${color}"/>
                        <circle cx="48" cy="48" r="4" fill="white"/>
                        <circle cx="80" cy="48" r="4" fill="white"/>
                        ${expressions[colorIndex % expressions.length]}
                    </svg>
                `;
                break;
            case 'geometric':
                // Geometric pattern avatars
                svg = `
                    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="128" height="128" fill="${color}"/>
                        <circle cx="32" cy="32" r="12" fill="white" opacity="0.3"/>
                        <circle cx="96" cy="32" r="12" fill="white" opacity="0.3"/>
                        <circle cx="32" cy="96" r="12" fill="white" opacity="0.3"/>
                        <circle cx="96" cy="96" r="12" fill="white" opacity="0.3"/>
                        <text x="64" y="80" text-anchor="middle" fill="white" font-size="32" font-family="Arial, sans-serif" font-weight="bold">${symbol}</text>
                    </svg>
                `;
                break;
            case 'abstract':
                // Abstract design avatars
                svg = `
                    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="grad${colorIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                                <stop offset="100%" style="stop-color:${color}dd;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <circle cx="64" cy="64" r="56" fill="url(#grad${colorIndex})"/>
                        <path d="M 20 40 Q 64 20 108 40 Q 64 60 20 40" fill="white" opacity="0.2"/>
                        <path d="M 20 88 Q 64 108 108 88 Q 64 68 20 88" fill="white" opacity="0.2"/>
                        <text x="64" y="80" text-anchor="middle" fill="white" font-size="36" font-family="Arial, sans-serif" font-weight="bold">${symbol}</text>
                    </svg>
                `;
                break;
            case 'pattern':
                // Pattern-based avatars
                svg = `
                    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="pattern${colorIndex}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                                <circle cx="8" cy="8" r="2" fill="${color}"/>
                                <circle cx="8" cy="8" r="6" fill="none" stroke="${color}" stroke-width="1" opacity="0.3"/>
                            </pattern>
                        </defs>
                        <rect x="0" y="0" width="128" height="128" fill="url(#pattern${colorIndex})"/>
                        <circle cx="64" cy="64" r="40" fill="${color}" opacity="0.8"/>
                        <text x="64" y="75" text-anchor="middle" fill="white" font-size="28" font-family="Arial, sans-serif" font-weight="bold">${symbol}</text>
                    </svg>
                `;
                break;
            case 'animal':
                // Animal-themed avatars
                svg = `
                    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="64" cy="64" r="56" fill="${color}"/>
                        <circle cx="48" cy="40" r="6" fill="white"/>
                        <circle cx="80" cy="40" r="6" fill="white"/>
                        <circle cx="48" cy="40" r="3" fill="black"/>
                        <circle cx="80" cy="40" r="3" fill="black"/>
                        <circle cx="64" cy="50" r="2" fill="black"/>
                        <path d="M 40 60 Q 64 70 88 60" stroke="white" stroke-width="2" fill="none"/>
                        <path d="M 35 35 Q 45 25 55 35" stroke="white" stroke-width="2" fill="none"/>
                        <path d="M 73 35 Q 83 25 93 35" stroke="white" stroke-width="2" fill="none"/>
                    </svg>
                `;
                break;
            case 'robot':
                // Robot-themed avatars
                svg = `
                    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                        <rect x="32" y="32" width="64" height="64" rx="8" fill="${color}"/>
                        <rect x="40" y="40" width="16" height="16" rx="2" fill="white"/>
                        <rect x="72" y="40" width="16" height="16" rx="2" fill="white"/>
                        <rect x="40" y="40" width="8" height="8" rx="1" fill="black"/>
                        <rect x="80" y="40" width="8" height="8" rx="1" fill="black"/>
                        <rect x="48" y="72" width="32" height="8" rx="2" fill="white"/>
                        <rect x="56" y="76" width="16" height="2" fill="black"/>
                        <rect x="32" y="48" width="4" height="8" fill="white"/>
                        <rect x="92" y="48" width="4" height="8" fill="white"/>
                    </svg>
                `;
                break;
            default:
                svg = `
                    <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="64" cy="64" r="56" fill="${color}"/>
                        <text x="64" y="80" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="bold">${symbol}</text>
                    </svg>
                `;
        }
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    const validateAndSetFile = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: "Please select an image file"
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: "Image size must be less than 5MB"
            }));
            return;
        }

        setUploadedFile(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        validateAndSetFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            validateAndSetFile(files[0]);
        }
    };

    const handleAvatarSelect = (avatarUrl: string) => {
        setSelectedAvatar(avatarUrl);
        setPreviewUrl(avatarUrl);
        setUploadedFile(null);
    };

    const handleSave = async () => {
        if (!previewUrl) {
            dispatch(addAlert({
                level: AlertLevel.WARNING,
                remark: "Please select an image or avatar"
            }));
            return;
        }

        setIsSubmitting(true);
        
        try {
            // TODO: When backend is implemented, upload the file here
            // For now, we'll just use the preview URL
            onSave(previewUrl);
            
            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                remark: "Profile picture updated successfully"
            }));
            
            onClose();
        } catch (error) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: "Failed to update profile picture"
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemovePicture = () => {
        setSelectedAvatar('');
        setUploadedFile(null);
        setPreviewUrl('');
        onSave(''); // Empty string to remove picture
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">
                        Change Profile Picture
                    </h2>
                    <Button.SM onClick={onClose}>
                        <HiX className="h-4 w-4" />
                    </Button.SM>
                </div>

                {/* Current Picture */}
                {currentPictureUrl && (
                    <div className="mb-6 p-4 bg-background-muted rounded-lg">
                        <h3 className="text-sm font-medium text-foreground-muted mb-2">
                            Current Picture
                        </h3>
                        <div className="flex items-center space-x-4">
                            <img 
                                src={currentPictureUrl} 
                                alt="Current profile" 
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <Button.Light onClick={handleRemovePicture}>
                                Remove Picture
                            </Button.Light>
                        </div>
                    </div>
                )}

                {/* Preview */}
                {previewUrl && (
                    <div className="mb-6 p-4 bg-background-muted rounded-lg">
                        <h3 className="text-sm font-medium text-foreground-muted mb-2">
                            Preview
                        </h3>
                        <div className="flex items-center space-x-4">
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="text-sm text-foreground-muted">
                                {uploadedFile ? `Uploaded: ${uploadedFile.name}` : 'Selected avatar'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex space-x-1 mb-6">
                    <Button.SM
                        className={`flex-1 flex items-center justify-center ${selectedTab === 'upload' ? 'bg-primary-600 text-white' : 'bg-background-muted'}`}
                        onClick={() => setSelectedTab('upload')}
                    >
                        <HiUpload className="h-4 w-4 mr-2" />
                        Upload Image
                    </Button.SM>
                    <Button.SM
                        className={`flex-1 flex items-center justify-center ${selectedTab === 'avatars' ? 'bg-primary-600 text-white' : 'bg-background-muted'}`}
                        onClick={() => setSelectedTab('avatars')}
                    >
                        <HiCamera className="h-4 w-4 mr-2" />
                        Choose Avatar
                    </Button.SM>
                </div>

                {/* Upload Tab */}
                {selectedTab === 'upload' && (
                    <div className="space-y-4">
                        <div 
                            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary-300 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <HiUpload className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                            <p className="text-foreground-muted mb-4">
                                Click to upload an image or drag and drop
                            </p>
                            <Button.Primary
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Choose File
                            </Button.Primary>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                        <div className="text-sm text-foreground-muted">
                            <p>Supported formats: JPG, PNG, GIF</p>
                            <p>Maximum size: 5MB</p>
                        </div>
                    </div>
                )}

                {/* Avatars Tab */}
                {selectedTab === 'avatars' && (
                    <div className="space-y-6">
                        {AVATAR_STYLES.map((style) => (
                            <div key={style.name}>
                                <h3 className="text-sm font-medium text-foreground mb-3">
                                    {style.name}
                                </h3>
                                <div className="grid grid-cols-8 gap-2">
                                    {AVATAR_SEEDS.slice(0, 8).map((seed, index) => {
                                        const avatarUrl = generateAvatarUrl(style, seed, index);
                                        return (
                                            <button
                                                key={seed}
                                                onClick={() => handleAvatarSelect(avatarUrl)}
                                                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                                                    selectedAvatar === avatarUrl
                                                        ? 'border-primary-600 ring-2 ring-primary-200'
                                                        : 'border-border hover:border-primary-300'
                                                }`}
                                            >
                                                <img 
                                                    src={avatarUrl} 
                                                    alt={`${style.name} avatar`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-border">
                    <Button.Light onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button.Light>
                    <Button.Primary 
                        onClick={handleSave}
                        isLoading={isSubmitting}
                        disabled={!previewUrl || isSubmitting}
                        className="flex items-center"
                    >
                        <HiCheck className="h-4 w-4 mr-2" />
                        Save Picture
                    </Button.Primary>
                </div>
            </Card>
        </div>
    );
}
