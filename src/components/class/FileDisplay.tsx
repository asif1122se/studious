"use client";

import { useState, useEffect, useRef } from "react";
import { HiDownload, HiTrash, HiPencil, HiFolder, HiEye } from "react-icons/hi";
import { RouterOutputs, trpc } from "@/utils/trpc";
import { useDispatch } from "react-redux";
import { addAlert, openModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import IconFrame from "@/components/ui/IconFrame";
import Button from "@/components/ui/Button";
import { getFileIconInfo } from "@/lib/fileTypes";
import FolderNavigator from "./FolderNavigator";
import RenameModal from "./RenameModal";


interface FileDisplayProps {
    file: RouterOutputs["folder"]["get"]["files"][number];
    onDelete?: () => void;
    showDelete?: boolean;
    className?: string;
    classId: string;
    currentFolderId?: string;
    onFileUpdated?: () => void;
}

// Miniature preview component
const MiniaturePreview = ({ file, classId, previewUrl, isLoading, hasError }: { 
    file: RouterOutputs["folder"]["get"]["files"][number], 
    classId: string,
    previewUrl: string | null,
    isLoading: boolean,
    hasError: boolean
}) => {
    const iconInfo = getFileIconInfo(file.type);

    if (isLoading) {
        return (
            <IconFrame
                backgroundColor={iconInfo.backgroundColor}
                baseColor={iconInfo.baseColor}
                className="flex-shrink-0"
            >
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </IconFrame>
        );
    }

    // If there was an error loading the preview, show the default icon
    if (hasError) {
        return (
            <IconFrame
                backgroundColor={iconInfo.backgroundColor}
                baseColor={iconInfo.baseColor}
                className="flex-shrink-0"
            >
                {iconInfo.icon}
            </IconFrame>
        );
    }

    if (file.type.startsWith('image/') && previewUrl) {
        return (
            <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img 
                    src={previewUrl} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    // For other supported file types with preview URL, show file-type specific icon
    if (previewUrl) {
        return (
            <IconFrame
                backgroundColor={iconInfo.backgroundColor}
                baseColor={iconInfo.baseColor}
                className="flex-shrink-0"
            >
                {iconInfo.icon}
            </IconFrame>
        );
    }

    // Fallback to original icon
    return (
        <IconFrame
            backgroundColor={iconInfo.backgroundColor}
            baseColor={iconInfo.baseColor}
            className="flex-shrink-0"
        >
            {iconInfo.icon}
        </IconFrame>
    );
};

export default function FileDisplay({ 
    file, 
    onDelete, 
    showDelete = false, 
    className = "",
    classId,
    currentFolderId,
    onFileUpdated
}: FileDisplayProps) {
    const dispatch = useDispatch();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [miniaturePreviewUrl, setMiniaturePreviewUrl] = useState<string | null>(null);
    const [isMiniatureLoading, setIsMiniatureLoading] = useState(false);
    const [hasMiniatureError, setHasMiniatureError] = useState(false);
    const hasLoadedMiniatureRef = useRef(false);
    const iconInfo = getFileIconInfo(file.type);

    const getSignedUrl = trpc.file.getSignedUrl.useMutation();

    // Load miniature preview
    useEffect(() => {
        // Reset states when file changes
        setMiniaturePreviewUrl(null);
        setIsMiniatureLoading(false);
        setHasMiniatureError(false);
        hasLoadedMiniatureRef.current = false;
        
        // Only load preview for supported file types
        const supportedTypes = [
            'image/',
            'video/',
            'application/pdf',
            'text/',
            'application/json',
            'application/javascript',
            'text/javascript',
            'text/css',
            'text/html'
        ];
        
        const isSupported = supportedTypes.some(type => 
            file.type.startsWith(type) || file.type === type
        );
        
        if (isSupported && !miniaturePreviewUrl && !hasLoadedMiniatureRef.current) {
            hasLoadedMiniatureRef.current = true;
            setIsMiniatureLoading(true);
            getSignedUrl.mutate(
                { fileId: file.id },
                {
                    onSuccess: (data: { url: string }) => {
                        setMiniaturePreviewUrl(data.url);
                        setIsMiniatureLoading(false);
                    },
                    onError: (error: any) => {
                        setIsMiniatureLoading(false);
                        setHasMiniatureError(true);
                    },
                }
            );
        }
    }, [file.id, file.type]);

    // Unified function to get signed URL for different purposes
    const getSignedUrlForPurpose = (purpose: 'download' | 'preview' | 'miniature') => {
        const onSuccess = (data: { url: string }) => {
            switch (purpose) {
                case 'download':
                    // Create a temporary link and trigger download
                    const link = document.createElement('a');
                    link.href = data.url;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setIsDownloading(false);
                    break;
                    
                case 'preview':
                    setIsPreviewLoading(false);
                    dispatch(openModal({
                        header: `Preview: ${file.name}`,
                        body: (
                            <div className="w-full max-w-4xl max-h-[80vh] overflow-auto">
                                {file.type.startsWith('image/') ? (
                                    <img 
                                        src={data.url} 
                                        alt={file.name}
                                        className="max-w-full h-auto"
                                        style={{ maxHeight: '600px' }}
                                    />
                                ) : file.type === 'application/pdf' ? (
                                    <iframe
                                        src={data.url}
                                        width="100%"
                                        height="600px"
                                        title={file.name}
                                        className="border-0"
                                    />
                                ) : file.type.startsWith('video/') ? (
                                    <video
                                        src={data.url}
                                        controls
                                        width="100%"
                                        height="600px"
                                        className="border-0 rounded-lg"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : file.type.startsWith('text/') || file.type === 'application/json' || file.type === 'application/javascript' ? (
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                        <pre className="text-sm overflow-auto max-h-[600px]">
                                            <code>
                                                {/* We'll load the text content here */}
                                                Loading text content...
                                            </code>
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        <div className="text-center">
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Preview not available for this file type
                                            </p>
                                            <Button.SM onClick={() => window.open(data.url, '_blank')}>
                                                Open in New Tab
                                            </Button.SM>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ),
                    }));
                    break;
                    
                case 'miniature':
                    setMiniaturePreviewUrl(data.url);
                    setIsMiniatureLoading(false);
                    break;
            }
        };

        const onError = (error: any) => {
            switch (purpose) {
                case 'download':
                    dispatch(addAlert({
                        level: AlertLevel.ERROR,
                        remark: `Failed to download file: ${error.message}`,
                    }));
                    setIsDownloading(false);
                    break;
                    
                case 'preview':
                    setIsPreviewLoading(false);
                    dispatch(addAlert({
                        level: AlertLevel.ERROR,
                        remark: `Failed to preview file: ${error.message}`,
                    }));
                    break;
                    
                case 'miniature':
                    setIsMiniatureLoading(false);
                    setHasMiniatureError(true);
                    break;
            }
        };

        return { onSuccess, onError };
    };

    const moveFile = trpc.file.move.useMutation({
        onSuccess: () => {
            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                remark: "File moved successfully",
            }));
            onFileUpdated?.();
        },
        onError: (error) => {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: `Failed to move file: ${error.message}`,
            }));
        },
    });

    const renameFile = trpc.file.rename.useMutation({
        onSuccess: () => {
            onFileUpdated?.();
        },
        onError: (error) => {
            throw new Error(error.message);
        },
    });

    const deleteFileMutation = trpc.file.delete.useMutation({
        onSuccess: () => {
            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                remark: "File deleted successfully",
            }));
            onFileUpdated?.();
        },
        onError: (error) => {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: `Failed to delete file: ${error.message}`,
            }));
        },
    });

    const handleDownload = () => {
        setIsDownloading(true);
        const { onSuccess, onError } = getSignedUrlForPurpose('download');
        getSignedUrl.mutate({ fileId: file.id }, { onSuccess, onError });
    };

    const handlePreview = () => {
        setIsPreviewLoading(true);
        const { onSuccess, onError } = getSignedUrlForPurpose('preview');
        getSignedUrl.mutate({ fileId: file.id }, { onSuccess, onError });
    };

    const handleFileClick = () => {
        // Only show preview for supported file types
        const supportedTypes = [
            'application/pdf',
            'image/',
            'video/',
            'text/',
            'application/json',
            'application/javascript',
            'text/javascript',
            'text/css',
            'text/html'
        ];
        
        const isSupported = supportedTypes.some(type => 
            file.type.startsWith(type) || file.type === type
        );
        
        if (isSupported) {
            handlePreview();
        } else {
            // For unsupported files, trigger download
            handleDownload();
        }
    };

    const handleMove = () => {
        dispatch(openModal({
            header: "Move File",
            body: (
                <FolderNavigator
                    classId={classId}
                    currentFolderId={currentFolderId}
                    onSelect={(targetFolderId, targetFolderName) => {
                        moveFile.mutate({
                            fileId: file.id,
                            targetFolderId,
                            classId,
                        });
                    }}
                    onCancel={() => dispatch(openModal({ header: "", body: null }))}
                    title="Select Destination Folder"
                />
            ),
        }));
    };

    const handleRename = () => {
        dispatch(openModal({
            header: "Rename File",
            body: (
                <RenameModal
                    currentName={file.name}
                    onRename={async (newName) => {
                        await renameFile.mutateAsync({
                            fileId: file.id,
                            newName,
                            classId,
                        });
                    }}
                    type="file"
                />
            ),
        }));
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
            deleteFileMutation.mutate({
                fileId: file.id,
                classId,
            });
        }
    };

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return "Unknown size";
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (date: string | null): string => {
        if (!date) return "Unknown date";
        return new Date(date).toLocaleDateString();
    };

    return (
        <div 
            className={`flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer ${className}`}
            onClick={handleFileClick}
        >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
                <MiniaturePreview 
                    file={file} 
                    classId={classId} 
                    previewUrl={miniaturePreviewUrl}
                    isLoading={isMiniatureLoading}
                    hasError={hasMiniatureError}
                />
                
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground-primary truncate">
                        {file.name}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-foreground-muted">
                        <span>{formatFileSize(file.size || 0)}</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                        {file.user && (
                            <span>by {file.user.username}</span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center space-x-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <Button.SM
                    onClick={handlePreview}
                    isLoading={isPreviewLoading}
                    title="Preview"
                >
                    <HiEye className="w-4 h-4" />
                </Button.SM>
                
                <Button.SM
                    onClick={handleDownload}
                    isLoading={isDownloading}
                    title="Download"
                >
                    <HiDownload className="w-4 h-4" />
                </Button.SM>
                
                {showDelete && (
                    <>
                        <Button.SM
                            onClick={handleMove}
                            title="Move to folder"
                        >
                            <HiFolder className="w-4 h-4" />
                        </Button.SM>
                        
                        <Button.SM
                            onClick={handleRename}
                            title="Rename"
                        >
                            <HiPencil className="w-4 h-4" />
                        </Button.SM>
                        
                        <Button.SM
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete"
                        >
                            <HiTrash className="w-4 h-4" />
                        </Button.SM>
                    </>
                )}
            </div>
        </div>
    );
} 