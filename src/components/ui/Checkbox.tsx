import React from 'react';
import { HiCheck, HiDocumentText } from 'react-icons/hi';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    label?: string;
    id?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'success' | 'warning' | 'error';
}

const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    onChange,
    disabled = false,
    className = '',
    label,
    id,
    name,
    size = 'md',
    color = 'primary'
}) => {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const colorClasses = {
        primary: checked 
            ? 'bg-primary-500 border-primary-500 text-white' 
            : 'border-border hover:border-primary-300 focus:border-primary-500',
        success: checked 
            ? 'bg-success border-success text-white' 
            : 'border-border hover:border-success/50 focus:border-success',
        warning: checked 
            ? 'bg-warning border-warning text-white' 
            : 'border-border hover:border-warning/50 focus:border-warning',
        error: checked 
            ? 'bg-error border-error text-white' 
            : 'border-border hover:border-error/50 focus:border-error'
    };

    const focusRingClasses = {
        primary: 'focus:ring-primary-500/20',
        success: 'focus:ring-success/20',
        warning: 'focus:ring-warning/20',
        error: 'focus:ring-error/20'
    };

    const iconSizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    const checkboxElement = (
        <div className={`relative flex-shrink-0 ${sizeClasses[size]}`}>
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                className={`
                    ${sizeClasses[size]}
                    rounded border-2 bg-background
                    ${colorClasses[color]}
                    focus:ring-2 focus:ring-offset-1 focus:ring-offset-background
                    ${focusRingClasses[color]}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 ease-in-out
                    appearance-none cursor-pointer
                    ${className}
                `}
            />
            {checked && (
                <div className={`
                    ${sizeClasses[size]}
                    absolute inset-0
                    flex
                    justify-center items-center
                    pointer-events-none
                    z-10
                `}>
                    <HiCheck className={`${iconSizes[size]} text-white`} />
                </div>
            )}
        </div>
    );

    if (label) {
        return (
            <label 
                htmlFor={id}
                className={`
                    flex items-center space-x-3 cursor-pointer select-none
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {checkboxElement}
                <span className="text-sm text-foreground font-medium">{label}</span>
            </label>
        );
    }

    return checkboxElement;
};

export default Checkbox; 