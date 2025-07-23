"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAlert, closeModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface CreateFolderProps {
    classId: string;
    parentFolderId?: string;
    onSuccess?: () => void;
}

export default function CreateFolder({ classId, parentFolderId, onSuccess }: CreateFolderProps) {
    const dispatch = useDispatch();
    const [folderName, setFolderName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const createFolder = trpc.folder.create.useMutation({
        onSuccess: () => {
            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                remark: "Folder created successfully",
            }));
            dispatch(closeModal());
            setFolderName("");
            onSuccess?.();
        },
        onError: (error) => {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: error.message,
            }));
            setIsCreating(false);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!folderName.trim()) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: "Please enter a folder name",
            }));
            return;
        }

        setIsCreating(true);
        createFolder.mutate({
            classId,
            name: folderName.trim(),
            parentFolderId,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="folderName" className="block text-sm font-medium text-foreground-primary mb-2">
                    Folder Name
                </label>
                <Input.Text
                    id="folderName"
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Enter folder name"
                    required
                    autoFocus
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button.Light
                    type="button"
                    onClick={() => dispatch(closeModal())}
                    disabled={isCreating}
                >
                    Cancel
                </Button.Light>
                <Button.Primary
                    type="submit"
                    isLoading={isCreating}
                    disabled={!folderName.trim()}
                >
                    Create Folder
                </Button.Primary>
            </div>
        </form>
    );
} 