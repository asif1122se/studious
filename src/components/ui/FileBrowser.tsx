import React, { useState, useEffect } from 'react';
import { HiFolder, HiChevronRight, HiCheck, HiHome, HiDocument } from 'react-icons/hi';
import { trpc } from '@/utils/trpc';
import Button from './Button';
import IconFrame from './IconFrame';
import { getFileIconInfo } from '@/lib/fileTypes';

interface File {
    id: string;
    name: string;
    type: string;
    size: number | null;
    uploadedAt?: Date;
}

interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    hasChildren?: boolean;
}

interface FileBrowserProps {
    classId: string;
    onFilesSelected: (files: File[]) => void;
    onCancel: () => void;
    multiple?: boolean;
    title?: string;
    selectedFiles?: File[];
}

export default function FileBrowser({ 
    classId,
    onFilesSelected, 
    onCancel,
    multiple = true,
    title = "Select Files",
    selectedFiles = []
}: FileBrowserProps) {
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set(selectedFiles.map(f => f.id)));
    const [breadcrumb, setBreadcrumb] = useState<Array<{ id: string; name: string }>>([]);

    // Get root folder
    const { data: rootFolder } = trpc.folder.getRootFolder.useQuery({ classId });

    // Get current folder details
    const { data: currentFolder, refetch: refetchCurrentFolder } = trpc.folder.get.useQuery({ 
        folderId: currentFolderId!, 
        classId 
    }, {
        enabled: !!currentFolderId,
    });

    // Get child folders
    const childFolders = currentFolderId === rootFolder?.id 
        ? rootFolder?.childFolders || []
        : currentFolder?.childFolders || [];

    // Initialize with root folder
    useEffect(() => {
        if (rootFolder && !currentFolderId) {
            setCurrentFolderId(rootFolder.id);
            setBreadcrumb([{ id: rootFolder.id, name: rootFolder.name }]);
        }
    }, [rootFolder, currentFolderId]);

    const handleFolderClick = (folderId: string, folderName: string) => {
        // Navigate into folder
        setCurrentFolderId(folderId);
        setBreadcrumb(prev => [...prev, { id: folderId, name: folderName }]);
        // Only refetch if we're not at the root level
        if (folderId !== rootFolder?.id) {
            refetchCurrentFolder();
        }
    };

    const handleFileClick = (file: File) => {
        if (multiple) {
            const newSelectedIds = new Set(selectedFileIds);
            if (newSelectedIds.has(file.id)) {
                newSelectedIds.delete(file.id);
            } else {
                newSelectedIds.add(file.id);
            }
            setSelectedFileIds(newSelectedIds);
        } else {
            setSelectedFileIds(new Set([file.id]));
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1 && rootFolder) {
            // Root
            setCurrentFolderId(rootFolder.id);
            setBreadcrumb([{ id: rootFolder.id, name: rootFolder.name }]);
        } else {
            // Specific folder
            const newBreadcrumb = breadcrumb.slice(0, index + 1);
            setBreadcrumb(newBreadcrumb);
            setCurrentFolderId(newBreadcrumb[newBreadcrumb.length - 1].id);
        }
        // Only refetch if we're not going to the root level
        if (index !== -1) {
            refetchCurrentFolder();
        }
    };

    const handleParentClick = () => {
        if (breadcrumb.length > 1) {
            const newBreadcrumb = breadcrumb.slice(0, -1);
            setBreadcrumb(newBreadcrumb);
            setCurrentFolderId(newBreadcrumb[newBreadcrumb.length - 1].id);
            // Only refetch if we're not going to the root level
            if (newBreadcrumb[newBreadcrumb.length - 1].id !== rootFolder?.id) {
                refetchCurrentFolder();
            }
        }
    };

    const handleConfirm = () => {
        // Get all selected files from current folder and any previously selected files
        const currentFolderFiles = currentFolder?.files || rootFolder?.files || [];
        const selectedFiles = currentFolderFiles.filter(file => selectedFileIds.has(file.id));
        onFilesSelected(selectedFiles);
    };

    const formatFileSize = (bytes: number | null): string => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
        const iconInfo = getFileIconInfo(fileType);
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

    if (!rootFolder || !currentFolderId) return null;

    const currentFiles = currentFolder?.files || rootFolder?.files || [];

    return (
        <div className="w-[50rem] max-w-full mx-auto flex flex-col space-y-5">
            <div>
                <h3 className="text-lg font-medium text-foreground-primary">{title}</h3>
                <p className="text-sm text-foreground-muted mt-1">
                    Browse and select files from your class file system
                </p>
            </div>

            {/* Breadcrumb */}
            <div className="flex flex-col space-y-3">
                <label className="text-xs font-bold">Current Location</label>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm">
                        <button
                            onClick={() => handleBreadcrumbClick(-1)}
                            className="flex items-center space-x-1 hover:underline"
                        >
                            <HiHome className="w-4 h-4" />
                            <span>{rootFolder.name}</span>
                        </button>
                        {breadcrumb.slice(1).map((item, index) => (
                            <div key={item.id} className="flex items-center space-x-1">
                                <HiChevronRight className="w-4 h-4 text-gray-400" />
                                <button
                                    onClick={() => handleBreadcrumbClick(index + 1)}
                                    className="hover:underline"
                                >
                                    {item.name}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Show Parent Button */}
                    {breadcrumb.length > 1 && (
                        <Button.SM
                            onClick={handleParentClick}
                            title="Go to parent folder"
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <HiChevronRight className="w-4 h-4 rotate-180" />
                        </Button.SM>
                    )}
                </div>
            </div>

            {/* Files and Folders */}
            <div className="flex flex-col space-y-3">
                <label className="text-sm font-bold">Files and Folders</label>
                <div className="max-h-96 overflow-y-auto border border-border-secondary rounded-md">
                    <div className="p-2">
                        {/* Child folders */}
                        {childFolders.length > 0 && (
                            <div className="space-y-1 mb-3">
                                {childFolders.map((folder) => (
                                    <div
                                        key={folder.id}
                                        className="flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors hover:bg-background-muted"
                                        onClick={() => handleFolderClick(folder.id, folder.name)}
                                    >
                                        <HiFolder className="w-4 h-4 text-primary-500" />
                                        <span className="text-sm font-medium flex-1">{folder.name}</span>
                                        <HiChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Files */}
                        {currentFiles.length > 0 && (
                            <div className="space-y-1">
                                {childFolders.length > 0 && (
                                    <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2" />
                                )}
                                {currentFiles.map((file) => {
                                    const isSelected = selectedFileIds.has(file.id);
                                    return (
                                        <div
                                            key={file.id}
                                            className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                                                isSelected
                                                    ? 'bg-primary-100 text-primary-500' 
                                                    : 'hover:bg-background-muted'
                                            }`}
                                            onClick={() => handleFileClick(file)}
                                        >
                                            <span className="text-lg">{getFileIcon(file.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <HiCheck className="w-4 h-4 text-primary-500" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Empty state */}
                        {childFolders.length === 0 && currentFiles.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <HiDocument className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                <p className="text-sm">No files or folders in this location</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Selection Summary */}
            <div className="p-3 bg-background-muted dark:bg-background-subtle rounded-md border border-border-secondary">
                <div className="text-sm text-foreground-secondary">
                    Selected: <span className="font-medium text-foreground-primary">
                        {selectedFileIds.size} file(s)
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center justify-end space-x-3 text-sm">
                <Button.Light onClick={onCancel}>
                    Cancel
                </Button.Light>
                <Button.Primary 
                    onClick={handleConfirm}
                    disabled={selectedFileIds.size === 0}
                    className="bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-md"
                >
                    Select {selectedFileIds.size > 0 ? `${selectedFileIds.size} File(s)` : 'Files'}
                </Button.Primary>
            </div>
        </div>
    );
} 