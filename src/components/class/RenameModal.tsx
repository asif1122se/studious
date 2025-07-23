"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAlert, closeModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface RenameModalProps {
    currentName: string;
    onRename: (newName: string) => Promise<void>;
    type: "file" | "folder";
}

export default function RenameModal({ currentName, onRename, type }: RenameModalProps) {
    const dispatch = useDispatch();
    const [newName, setNewName] = useState(currentName);
    const [isRenaming, setIsRenaming] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newName.trim()) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: `${type === 'file' ? 'File' : 'Folder'} name cannot be empty`,
            }));
            return;
        }

        if (newName.trim() === currentName) {
            dispatch(closeModal());
            return;
        }

        setIsRenaming(true);
        try {
            await onRename(newName.trim());
            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                remark: `${type === 'file' ? 'File' : 'Folder'} renamed successfully`,
            }));
            dispatch(closeModal());
        } catch (error) {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: `Failed to rename ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }));
        } finally {
            setIsRenaming(false);
        }
    };

    const handleCancel = () => {
        dispatch(closeModal());
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-medium text-foreground-primary">
                    Rename {type === 'file' ? 'File' : 'Folder'}
                </h3>
                <p className="text-sm text-foreground-muted mt-1">
                    Enter a new name for "{currentName}"
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="newName" className="block text-sm font-medium text-foreground-primary mb-2">
                        New Name
                    </label>
                    <Input.Text
                        id="newName"
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder={`Enter new ${type} name`}
                        autoFocus
                        required
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button.Light onClick={handleCancel} type="button">
                        Cancel
                    </Button.Light>
                    <Button.Primary 
                        type="submit"
                        isLoading={isRenaming}
                        disabled={!newName.trim() || newName.trim() === currentName}
                    >
                        {isRenaming ? 'Renaming...' : 'Rename'}
                    </Button.Primary>
                </div>
            </form>
        </div>
    );
} 