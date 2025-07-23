"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAlert, closeModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import { fileToBase64 } from "@/lib/fileToBase64";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";

interface UploadFilesToFolderProps {
    classId: string;
    folderId: string;
    folderName: string;
    onSuccess?: () => void;
}

export default function UploadFilesToFolder({ classId, folderId, folderName, onSuccess }: UploadFilesToFolderProps) {
    const dispatch = useDispatch();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const uploadFiles = trpc.folder.uploadFiles.useMutation({
        onSuccess: (data) => {
            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                remark: `${data.uploadedCount} file(s) uploaded successfully to ${folderName}`,
            }));
            dispatch(closeModal());
            setSelectedFiles([]);
            onSuccess?.();
        },
        onError: (error) => {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: error.message,
            }));
            setIsUploading(false);
        },
    });

    const handleFilesSelected = (files: File[]) => {
        setSelectedFiles(files);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: "Please select files to upload",
            }));
            return;
        }

        setIsUploading(true);

        try {
            const fileData = await Promise.all(
                selectedFiles.map(async (file) => {
                    const base64 = await fileToBase64(file);
                    return {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: base64,
                    };
                })
            );

            uploadFiles.mutate({
                classId,
                folderId,
                files: fileData,
            });
        } catch (error) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: "Failed to process files",
            }));
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-foreground-primary mb-2">
                    Upload Files to "{folderName}"
                </h3>
                <p className="text-sm text-foreground-muted">
                    Select files to upload to this folder. You can drag and drop files or click to browse.
                </p>
            </div>

            <FileUpload
                onFilesSelected={handleFilesSelected}
                accept="*/*"
                multiple={true}
                maxSize={50 * 1024 * 1024} // 50MB
                maxFiles={20}
                showPreview={true}
            />

            <div className="flex justify-end space-x-3 pt-4">
                <Button.Light
                    type="button"
                    onClick={() => dispatch(closeModal())}
                    disabled={isUploading}
                >
                    Cancel
                </Button.Light>
                <Button.Primary
                    type="button"
                    onClick={handleUpload}
                    isLoading={isUploading}
                    disabled={selectedFiles.length === 0}
                >
                    {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} File(s)`}
                </Button.Primary>
            </div>
        </div>
    );
} 