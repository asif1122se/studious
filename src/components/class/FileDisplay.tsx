"use client";

import { useState } from "react";
import { HiDownload, HiTrash, HiPencil, HiFolder } from "react-icons/hi";
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
    const iconInfo = getFileIconInfo(file.type);

    const getSignedUrl = trpc.file.getSignedUrl.useMutation({
        onSuccess: (data) => {
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = data.url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsDownloading(false);
        },
        onError: (error) => {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: `Failed to download file: ${error.message}`,
            }));
            setIsDownloading(false);
        },
    });

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
        getSignedUrl.mutate({ fileId: file.id });
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
        <div className={`flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow ${className}`}>
            <div className="flex items-center space-x-3 flex-1 min-w-0">
                <IconFrame
                    backgroundColor={iconInfo.backgroundColor}
                    baseColor={iconInfo.baseColor}
                    className="flex-shrink-0"
                >
                    {iconInfo.icon}
                </IconFrame>
                
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
            
            <div className="flex items-center space-x-1 flex-shrink-0">
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