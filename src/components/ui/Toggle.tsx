import React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
    checked: boolean;
    onToggle: () => void;
    disabled?: boolean;
    className?: string;
    size?: "sm" | "md" | "lg";
}

const Toggle: React.FC<ToggleProps> = ({
    checked,
    onToggle,
    disabled = false,
    className,
    size = "md"
}) => {
    const sizeClasses = {
        sm: "w-9 h-5",
        md: "w-11 h-6",
        lg: "w-14 h-7"
    };

    const thumbSizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    const thumbTranslateClasses = {
        sm: checked ? "translate-x-4" : "translate-x-0.5",
        md: checked ? "translate-x-5" : "translate-x-0.5",
        lg: checked ? "translate-x-7" : "translate-x-0.5"
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={onToggle}
            className={cn(
                "relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                checked 
                    ? "bg-primary-600 hover:bg-primary-700" 
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
                disabled && "opacity-50 cursor-not-allowed",
                sizeClasses[size],
                className
            )}
        >
            <span
                className={cn(
                    "inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out",
                    thumbSizeClasses[size],
                    thumbTranslateClasses[size]
                )}
            />
        </button>
    );
};

export default Toggle;


