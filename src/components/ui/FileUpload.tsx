import React, { useState, useRef, useCallback } from 'react';
import { HiCloudUpload, HiX, HiDocument, HiCheck } from 'react-icons/hi';
import Button from './Button';
import { identity } from '@trpc/server/unstable-core-do-not-import';
import IconFrame from './IconFrame';
import { getFileIconInfo } from '@/lib/fileTypes';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in bytes
    maxFiles?: number;
    className?: string;
    disabled?: boolean;
    showPreview?: boolean;
    'aria-label'?: string;
    'aria-describedby'?: string;
}

export default function FileUpload({
    onFilesSelected,
    accept = '*/*',
    multiple = true,
    maxSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 10,
    className = '',
    disabled = false,
    showPreview = true,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby
}: FileUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const validateFile = (file: File): string | null => {
        if (maxSize && file.size > maxSize) {
            return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
        }

        if (accept !== '*/*') {
            const acceptedTypes = accept.split(',').map(type => type.trim());
            const fileType = file.type;
            const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

            const isAccepted = acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return fileExtension === type;
                }
                return fileType === type || fileType.startsWith(type.replace('*', ''));
            });

            if (!isAccepted) {
                return `File type not allowed. Accepted types: ${accept}`;
            }
        }

        return null;
    };

    const processFiles = useCallback((fileList: FileList) => {
        const newFiles: File[] = [];
        const errors: string[] = [];

        Array.from(fileList).forEach(file => {
            const error = validateFile(file);

            if (error) {
                errors.push(`${file.name}: ${error}`);
                return;
            }

            if (files.length + newFiles.length >= maxFiles) {
                errors.push(`Maximum ${maxFiles} files allowed`);
                return;
            }

            newFiles.push(file);
        });

        if (errors.length > 0) {
            // You might want to show these errors in a toast or alert
            console.error('File validation errors:', errors);
        }

        if (newFiles.length > 0) {
            const updatedFiles = newFiles;
            setFiles(updatedFiles);
            onFilesSelected(updatedFiles);
        }
    }, [files, maxFiles, multiple, onFilesSelected, accept, maxSize]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (disabled) return;

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            processFiles(droppedFiles);
        }
    }, [disabled, processFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragOver(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            processFiles(selectedFiles);
        }
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const removeFile = (name: string) => {
        const updatedFiles = files.filter(f => f.name !== name);
        setFiles(updatedFiles);
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
        return <IconFrame
            backgroundColor={iconInfo.backgroundColor}
            baseColor={iconInfo.baseColor}
            className="flex-shrink-0"
        >
            {iconInfo.icon}
        </IconFrame>
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div
                ref={dropZoneRef}
                className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${isDragOver
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !disabled && fileInputRef.current?.click()}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label={ariaLabel || 'File upload area'}
                aria-describedby={ariaDescribedby}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!disabled) {
                            fileInputRef.current?.click();
                        }
                    }
                }}
            >
                <HiCloudUpload className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop files here, or{' '}
                    <span className="text-primary-600 hover:text-primary-500 font-medium">
                        browse
                    </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {accept !== '*/*' && `Accepted types: ${accept}`}
                    {maxSize && ` • Max size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`}
                    {maxFiles > 1 && ` • Max files: ${maxFiles}`}
                </p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
            />

            {showPreview && files.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Selected Files ({files.length})
                    </h3>
                    <div className="space-y-2">
                        {files.map((file) => (
                            <div
                                key={file.name}
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
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => removeFile(file.name)}
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