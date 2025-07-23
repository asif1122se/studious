"use client";

import { HiFolder, HiPencil, HiTrash, HiArrowRight } from "react-icons/hi";
import { trpc } from "@/utils/trpc";
import { useDispatch } from "react-redux";
import { addAlert, openModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import IconFrame from "@/components/ui/IconFrame";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FolderNavigator from "./FolderNavigator";
import RenameModal from "./RenameModal";

interface FolderDisplayProps {
    folder: {
        id: string;
        name: string;
        _count?: {
            files: number;
            childFolders: number;
        };
    };
    classId: string;
    currentFolderId?: string;
    onFolderClick?: (folder: any) => void;
    onFolderUpdated?: () => void;
    showOperations?: boolean;
    className?: string;
}

export default function FolderDisplay({ 
    folder, 
    classId, 
    currentFolderId,
    onFolderClick,
    onFolderUpdated,
    showOperations = false,
    className = ""
}: FolderDisplayProps) {
    const dispatch = useDispatch();

    const moveFolder = trpc.folder.move.useMutation({
        onSuccess: () => {
            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                remark: "Folder moved successfully",
            }));
            onFolderUpdated?.();
        },
        onError: (error) => {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: `Failed to move folder: ${error.message}`,
            }));
        },
    });

    const renameFolder = trpc.folder.rename.useMutation({
        onSuccess: () => {
            onFolderUpdated?.();
        },
        onError: (error) => {
            throw new Error(error.message);
        },
    });

    const deleteFolder = trpc.folder.delete.useMutation({
        onSuccess: () => {
            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                remark: "Folder deleted successfully",
            }));
            onFolderUpdated?.();
        },
        onError: (error) => {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: `Failed to delete folder: ${error.message}`,
            }));
        },
    });

    const handleMove = () => {
        dispatch(openModal({
            header: "Move Folder",
            body: (
                <FolderNavigator
                    classId={classId}
                    currentFolderId={folder.id}
                    onSelect={(targetFolderId, targetFolderName) => {
                        moveFolder.mutate({
                            folderId: folder.id,
                            targetParentFolderId: targetFolderId,
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
            header: "Rename Folder",
            body: (
                <RenameModal
                    currentName={folder.name}
                    onRename={async (newName) => {
                        await renameFolder.mutateAsync({
                            folderId: folder.id,
                            newName,
                            classId,
                        });
                    }}
                    type="folder"
                />
            ),
        }));
    };

    const handleDelete = () => {
        const fileCount = folder._count?.files || 0;
        const folderCount = folder._count?.childFolders || 0;
        
        if (confirm(`Are you sure you want to delete "${folder.name}" and all its contents (${fileCount} files, ${folderCount} folders)?`)) {
            deleteFolder.mutate({
                classId,
                folderId: folder.id,
            });
        }
    };

    const handleClick = () => {
        if (onFolderClick) {
            onFolderClick(folder);
        }
    };

    const fileCount = folder._count?.files || 0;
    const folderCount = folder._count?.childFolders || 0;

    return (
        <Card 
            className={`p-4 ${className}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <IconFrame className="p-2 size-8 bg-blue-50 text-blue-600 rounded-lg">
                        <HiFolder className="h-6 w-6" />
                    </IconFrame>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground-primary truncate">
                            {folder.name}
                        </h3>
                        <p className="text-sm text-foreground-muted">
                            {fileCount} files, {folderCount} folders
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-1 flex-shrink-0">
                    {onFolderClick && (
                        <Button.SM
                            onClick={() => {
                                handleClick();
                            }}
                            title="Open folder"
                        >
                            <HiArrowRight className="w-4 h-4" />
                        </Button.SM>
                    )}
                    
                    {showOperations && (
                        <>
                            <Button.SM
                                onClick={() => {
                                    handleMove();
                                }}
                                title="Move folder"
                            >
                                <HiFolder className="w-4 h-4" />
                            </Button.SM>
                            
                            <Button.SM
                                onClick={() => {
                                    handleRename();
                                }}
                                title="Rename folder"
                            >
                                <HiPencil className="w-4 h-4" />
                            </Button.SM>
                            
                            <Button.SM
                                onClick={() => {
                                    handleDelete();
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete folder"
                            >
                                <HiTrash className="w-4 h-4" />
                            </Button.SM>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
} 