import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HiFolder, HiCloudUpload, HiX, HiCheck } from 'react-icons/hi';
import { trpc } from '@/utils/trpc';
import Button from './Button';
import FileUpload from './FileUpload';
import FileBrowser from './FileBrowser';
import { openModal, closeModal } from '@/store/appSlice';
import { useDispatch } from 'react-redux';
import IconFrame from './IconFrame';
import { getFileIconInfo } from '@/lib/fileTypes';
import { Cloud } from 'lucide-react';

interface FileSelectorProps {
    classId: string;
    onFilesSelected: (files: Array<{ id?: string; name: string; type: string; size: number; data?: string }>) => void;
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    maxFiles?: number;
    className?: string;
    disabled?: boolean;
    showPreview?: boolean;
    selectedFiles?: Array<{ id?: string; name: string; type: string; size: number; data?: string }>;
    'aria-label'?: string;
    'aria-describedby'?: string;
}

export default function FileSelector({
    classId,
    onFilesSelected,
    accept = '*/*',
    multiple = true,
    maxSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 10,
    className = '',
    disabled = false,
    showPreview = true,
    selectedFiles = [],
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby
}: FileSelectorProps) {
    const dispatch = useDispatch();
    const [localSelectedFiles, setLocalSelectedFiles] = useState<Array<{ id?: string; name: string; type: string; size: number; data?: string }>>(selectedFiles);
    const prevSelectedFilesRef = useRef<Array<{ id?: string; name: string; type: string; size: number; data?: string }>>(selectedFiles);

    // Sync local state with selectedFiles prop
    useEffect(() => {
        // Only update if the selectedFiles prop has actually changed
        const prevFileIds = prevSelectedFilesRef.current.map(f => f.id || f.name).sort();
        const newFileIds = selectedFiles.map(f => f.id || f.name).sort();
        
        // if (JSON.stringify(prevFileIds) !== JSON.stringify(newFileIds)) {
            setLocalSelectedFiles(selectedFiles);
            prevSelectedFilesRef.current = selectedFiles;
        // }
    }, [selectedFiles]);

    // Get root folder for file browsing
    const { data: rootFolder } = trpc.folder.getRootFolder.useQuery({ classId });

    const convertFileToBase64 = useCallback((file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }, []);

    const handleNewFilesSelected = (files: File[]) => {
        // Convert all files to base64 and then call onFilesSelected once
        Promise.all(
            files.map(async (file) => {
                const base64Data = await convertFileToBase64(file);
                return {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: base64Data,
                };
            })
        ).then((newFileData) => {
            const updatedFiles = multiple ? [...localSelectedFiles, ...newFileData] : newFileData;
            setLocalSelectedFiles(updatedFiles);
            onFilesSelected(updatedFiles);
        }).catch((error) => {
            console.error('Error converting files to base64:', error);
        });
    };

    const handleExistingFilesSelected = (files: Array<{ id: string; name: string; type: string; size: number | null }>) => {
        const existingFileData = files.map(file => ({
            id: file.id,
            name: file.name,
            type: file.type,
            size: file.size || 0,
        }));

        const updatedFiles = multiple ? [...localSelectedFiles, ...existingFileData] : existingFileData;
        setLocalSelectedFiles(updatedFiles);
        onFilesSelected(updatedFiles);
        dispatch(closeModal());
    };

    const handleBrowseFiles = () => {
        dispatch(openModal({
            header: 'Select Files from Class Files',
            body: (
                <FileBrowser
                    classId={classId}
                    onFilesSelected={handleExistingFilesSelected}
                    onCancel={() => dispatch(closeModal())}
                    multiple={multiple}
                    title="Select Files from Class Files"
                />
            )
        }));
    };

    const removeFile = (index: number) => {
        const updatedFiles = localSelectedFiles.filter((_, i) => i !== index);
        setLocalSelectedFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
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

    return (
        <div className={`space-y-4 ${className}`}>
            {/* File Upload Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Upload New Files
                    </h3>
                    <Button.SM
                        onClick={handleBrowseFiles}
                        disabled={disabled || !rootFolder}
                    >
                        <Cloud className="w-4 h-4" />
                    </Button.SM>
                </div>
                
                <FileUpload
                    onFilesSelected={handleNewFilesSelected}
                    accept={accept}
                    multiple={multiple}
                    maxSize={maxSize}
                    maxFiles={maxFiles - localSelectedFiles.length}
                    disabled={disabled}
                    showPreview={false}
                    aria-label={ariaLabel}
                    aria-describedby={ariaDescribedby}
                />
            </div>

            {/* Selected Files Preview */}
            {showPreview && localSelectedFiles.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Selected Files ({localSelectedFiles.length})
                    </h3>
                    <div className="space-y-2">
                        {localSelectedFiles.map((file, index) => (
                            <div
                                key={`${file.id || file.name}-${index}`}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <span className="text-lg">{getFileIcon(file.type)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatFileSize(file.size)}
                                            {file.id && (
                                                <span className="ml-2 text-blue-600 dark:text-blue-400">
                                                    (Existing file)
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <HiX className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 