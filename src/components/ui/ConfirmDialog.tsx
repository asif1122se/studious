import React, { useEffect, useRef } from 'react';
import { HiExclamationCircle, HiInformationCircle, HiX } from 'react-icons/hi';
import Button from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'info',
    loading = false
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Focus the confirm button when dialog opens
            setTimeout(() => {
                confirmButtonRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when dialog is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const variantConfig = {
        danger: {
            icon: HiExclamationCircle,
            iconColor: 'text-red-500',
            confirmButtonVariant: 'danger' as const,
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800'
        },
        warning: {
            icon: HiExclamationCircle,
            iconColor: 'text-yellow-500',
            confirmButtonVariant: 'warning' as const,
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            borderColor: 'border-yellow-200 dark:border-yellow-800'
        },
        info: {
            icon: HiInformationCircle,
            iconColor: 'text-blue-500',
            confirmButtonVariant: 'primary' as const,
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800'
        }
    };

    const config = variantConfig[variant];
    const IconComponent = config.icon;

    return (
        <div 
            className="fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
        >
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    ref={dialogRef}
                    className={`relative w-full max-w-md transform overflow-hidden rounded-lg bg-background shadow-xl transition-all ${config.bgColor} ${config.borderColor} border`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center space-x-3">
                            <IconComponent 
                                className={`h-6 w-6 ${config.iconColor}`} 
                                aria-hidden="true"
                            />
                            <h2 
                                id="dialog-title"
                                className="text-lg font-semibold text-foreground"
                            >
                                {title}
                            </h2>
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-foreground-muted hover:text-foreground transition-colors"
                            aria-label="Close dialog"
                        >
                            <HiX className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <p 
                            id="dialog-description"
                            className="text-sm text-foreground-muted"
                        >
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 p-4 border-t border-border">
                        <Button.Light
                            onClick={onCancel}
                            disabled={loading}
                            aria-label="Cancel action"
                        >
                            {cancelText}
                        </Button.Light>
                        <Button.Primary
                            ref={confirmButtonRef}
                            onClick={onConfirm}
                            disabled={loading}
                            className={variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : ''}
                            aria-label={`Confirm ${title.toLowerCase()}`}
                        >
                            {loading ? 'Confirming...' : confirmText}
                        </Button.Primary>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hook for managing confirmation dialogs
export const useConfirmDialog = () => {
    const [dialogState, setDialogState] = React.useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        variant: 'info'
    });

    const confirm = (
        title: string,
        message: string,
        onConfirm: () => void,
        variant: 'danger' | 'warning' | 'info' = 'info'
    ) => {
        setDialogState({
            isOpen: true,
            title,
            message,
            onConfirm,
            variant
        });
    };

    const cancel = () => {
        setDialogState(prev => ({ ...prev, isOpen: false }));
    };

    const handleConfirm = () => {
        dialogState.onConfirm();
        cancel();
    };

    return {
        confirm,
        cancel,
        dialogProps: {
            ...dialogState,
            onConfirm: handleConfirm,
            onCancel: cancel
        }
    };
}; 