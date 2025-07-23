import React, { useState, useRef, useEffect } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { MdKeyboardArrowDown } from 'react-icons/md';

// Base props interface for all input components
interface BaseInputProps {
    label?: string;
    value?: string | number;
    placeholder?: string;
    error?: string;
    required?: boolean;
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    [key: string]: any;
}

// Props for components that use HTMLInputElement
interface InputElementProps extends BaseInputProps {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Props for textarea component
interface TextareaProps extends BaseInputProps {
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

// Props for select component
interface SelectProps extends BaseInputProps {
    onChange?: (e: { target: { value: string } }) => void;
    children: React.ReactNode;
}

// Props for the wrapper component
interface InputWrapperProps {
    children: React.ReactNode;
    label?: string;
    className?: string;
    error?: string;
    required?: boolean;
    id?: string;
}

// Add this interface after the other interfaces
interface SearchableSelectProps extends BaseInputProps {
    onChange?: (e: { target: { value: string } }) => void;
    searchList: ReadonlyArray<{ readonly value: string; readonly label: string }>;
}

function InputWrapper({ label, error, required, id, children, className }: InputWrapperProps) {
    if (!label) return <>{children}</>
    return (
        <div className={`flex flex-col space-y-1 w-full ${className}`}>
            <label 
                htmlFor={id} 
                className="font-semibold text-xs text-foreground"
            >
                {label}
                {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </label>
            {children}
            {error && (
                <p 
                    id={`${id}-error`} 
                    className="text-sm text-red-500" 
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

const Input = {
    Text: ({ 
        label, 
        value, 
        onChange, 
        placeholder, 
        error,
        required,
        id,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedby,
        'aria-invalid': ariaInvalid,
        ...props 
    }: InputElementProps) => {
        if (!placeholder && label) placeholder = `Enter the ${label.toLowerCase()} here...`;
        if (!placeholder) placeholder = 'Type here...';

        const [showPassword, setShowPassword] = useState(false);
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <InputWrapper label={label} error={error} required={required} id={inputId}>
                <div className="relative">
                    <input
                        id={inputId}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        aria-label={ariaLabel || (label ? `${label} input field` : undefined)}
                        aria-describedby={ariaDescribedby || (error ? `${inputId}-error` : undefined)}
                        aria-invalid={ariaInvalid !== undefined ? ariaInvalid : !!error}
                        aria-required={required}
                        {...props}
                        type={props.type === 'password' ? (showPassword ? "text" : "password") : props.type}
                        className={`px-3 py-2 bg-background shadow-sm border rounded-md text-sm outline-none transition-all duration-200 ease-in-out focus:border-primary-300 focus:ring-1 focus:ring-primary-300 w-full ${
                            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border'
                        } ${props.className} ${props.disabled && 'text-foreground-muted'} ${props.type === 'password' ? 'pr-10' : ''}`}
                    />
                    {props.type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                        >
                            {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </InputWrapper>
        )
    },
    Select: ({ 
        label, 
        value, 
        onChange, 
        children, 
        placeholder = "Select an option", 
        error,
        required,
        id,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedby,
        'aria-invalid': ariaInvalid,
        ...props 
    }: SelectProps) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectRef = useRef<HTMLDivElement>(null);
        const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        // Find selected option text
        const selectedText = React.Children.toArray(children).find(
            (child) => React.isValidElement(child) && child.props.value === value
        ) as React.ReactElement;

        return (
            <InputWrapper label={label} error={error} required={required} id={selectId}>
                <div ref={selectRef} className="relative">
                    <div
                        id={selectId}
                        role="combobox"
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                        aria-label={ariaLabel || (label ? `${label} dropdown` : 'Select option')}
                        aria-describedby={ariaDescribedby || (error ? `${selectId}-error` : undefined)}
                        aria-invalid={ariaInvalid !== undefined ? ariaInvalid : !!error}
                        aria-required={required}
                        onClick={() => !props.disabled && setIsOpen(!isOpen)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                if (!props.disabled) setIsOpen(!isOpen);
                            } else if (e.key === 'Escape') {
                                setIsOpen(false);
                            }
                        }}
                        tabIndex={props.disabled ? -1 : 0}
                        className={`
                            px-3 py-2 
                            bg-background
                            border rounded-md 
                            text-sm outline-none shadow-sm
                            flex justify-between items-center
                            transition-all duration-200 ease-in-out
                            ${props.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-primary-300'}
                            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border focus:border-primary-300 focus:ring-1 focus:ring-primary-300'}
                            ${props.className}
                        `}
                    >
                        <span className={!value ? 'text-foreground-muted' : ' flex flex-row space-x-2 items-center'}>
                            {selectedText ? selectedText.props.children : placeholder}
                        </span>
                        <MdKeyboardArrowDown 
                            className={`size-5 transition-transform duration-200 
                                ${isOpen ? 'rotate-180' : ''}
                            `} 
                            aria-hidden="true"
                        />
                    </div>

                    {/* Animated Dropdown */}
                    {isOpen && (
                        <div
                            role="listbox"
                            aria-label={`${label || 'Options'} list`}
                            className={`
                                absolute z-50 w-full mt-1 p-1
                                bg-background
                                border border-border
                                space-y-1
                                rounded-md shadow-sm max-h-60 overflow-auto
                                transition-all duration-200 origin-top
                                opacity-100 scale-100 pointer-events-auto
                            `}
                            style={{
                                transform: 'scale(1)',
                                opacity: 1,
                            }}
                        >
                            {React.Children.map(children, child => {
                                if (React.isValidElement(child) && child.type === 'option') {
                                    return (
                                        <div
                                            role="option"
                                            aria-selected={child.props.value === value}
                                            onClick={() => {
                                                onChange?.({ target: { value: child.props.value } });
                                                setIsOpen(false);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    onChange?.({ target: { value: child.props.value } });
                                                    setIsOpen(false);
                                                }
                                            }}
                                            tabIndex={0}
                                            className={`
                                                px-3 py-2.5 cursor-pointer text-sm
                                                hover:bg-background-muted 
                                                transition-colors duration-200
                                                rounded-md          
                                                ${child.props.value === value &&
                                                    'bg-background-muted' 
                                                }
                                                flex flex-row space-x-2 items-center
                                            `}
                                        >
                                            {child.props.children}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}
                </div>
            </InputWrapper>
        );
    },
    Textarea: ({ 
        label, 
        value, 
        onChange, 
        placeholder, 
        error,
        required,
        id,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedby,
        'aria-invalid': ariaInvalid,
        ...props 
    }: TextareaProps) => {
        if (!placeholder && label) placeholder = `Enter the ${label.toLowerCase()} here...`;
        if (!placeholder) placeholder = 'Type here...';

        const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <InputWrapper label={label} error={error} required={required} id={textareaId}>
                <textarea
                    id={textareaId}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    aria-label={ariaLabel || (label ? `${label} text area` : undefined)}
                    aria-describedby={ariaDescribedby || (error ? `${textareaId}-error` : undefined)}
                    aria-invalid={ariaInvalid !== undefined ? ariaInvalid : !!error}
                    aria-required={required}
                    {...props}
                    className={`px-4 py-3 border rounded-md text-sm outline-none shadow-sm transition-all duration-200 ease-in-out focus:border-primary-300 focus:ring-1 focus:ring-primary-300 bg-background ${
                        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border'
                    } ${props.className}`}
                />
            </InputWrapper>
        )
    },
    Small: ({ 
        label, 
        value, 
        onChange, 
        placeholder, 
        error,
        required,
        id,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedby,
        'aria-invalid': ariaInvalid,
        ...props 
    }: InputElementProps) => {
        if (!placeholder && label) placeholder = `Enter the ${label.toLowerCase()} here...`;
        if (!placeholder) placeholder = 'Type here...';

        const inputId = id || `small-input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <InputWrapper label={label} error={error} required={required} id={inputId}>
                <input
                    id={inputId}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    aria-label={ariaLabel || (label ? `${label} input field` : undefined)}
                    aria-describedby={ariaDescribedby || (error ? `${inputId}-error` : undefined)}
                    aria-invalid={ariaInvalid !== undefined ? ariaInvalid : !!error}
                    aria-required={required}
                    {...props}
                    className={`px-2 py-1 bg-background-muted border rounded-md text-sm outline-none shadow-sm transition-all duration-200 ease-in-out focus:border-primary-300 focus:ring-1 focus:ring-primary-300 ${
                        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border'
                    } ${props.className}`}
                />
            </InputWrapper>
        )
    },
    SearchableSelect: ({ 
        label, 
        value, 
        onChange, 
        searchList, 
        placeholder = "Search and select...", 
        error,
        required,
        id,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedby,
        'aria-invalid': ariaInvalid,
        ...props 
    }: SearchableSelectProps) => {
        const [isOpen, setIsOpen] = useState(false);
        const [displayValue, setDisplayValue] = useState('');
        const selectRef = useRef<HTMLDivElement>(null);
        const inputId = id || `searchable-select-${Math.random().toString(36).substr(2, 9)}`;

        // Update display value when value changes
        useEffect(() => {
            const selectedOption = searchList.find(option => option.value === value);
            setDisplayValue(selectedOption?.label || value?.toString() || '');
        }, [value, searchList]);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const filteredOptions = searchList.filter(option =>
            option.label.toLowerCase().includes(displayValue.toLowerCase())
        );

        return (
            <InputWrapper label={label} error={error} required={required} id={inputId}>
                <div ref={selectRef} className="relative">
                    <input
                        id={inputId}
                        type="text"
                        value={displayValue}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setDisplayValue(newValue);
                            onChange?.({ target: { value: newValue } });
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder={placeholder}
                        aria-label={ariaLabel || (label ? `${label} searchable dropdown` : 'Search and select')}
                        aria-describedby={ariaDescribedby || (error ? `${inputId}-error` : undefined)}
                        aria-invalid={ariaInvalid !== undefined ? ariaInvalid : !!error}
                        aria-required={required}
                        aria-autocomplete="list"
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                        className={`px-3 py-2 border rounded-md text-sm outline-none shadow-sm transition-all duration-200 ease-in-out focus:border-primary-300 focus:ring-1 focus:ring-primary-300 w-full bg-background ${
                            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border'
                        }`}
                        {...props}
                    />

                    {isOpen && (
                        <div 
                            role="listbox"
                            aria-label={`${label || 'Options'} list`}
                            className="
                                absolute z-50 w-full mt-1
                                bg-background
                                border border-border
                                rounded-md shadow-lg
                            "
                        >
                            <div className="max-h-60 overflow-auto">
                                {filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        role="option"
                                        aria-selected={option.value === value}
                                        onClick={() => {
                                            onChange?.({ target: { value: option.value } });
                                            setDisplayValue(option.label);
                                            setIsOpen(false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                onChange?.({ target: { value: option.value } });
                                                setDisplayValue(option.label);
                                                setIsOpen(false);
                                            }
                                        }}
                                        tabIndex={0}
                                        className={`
                                            px-4 py-2.5 cursor-pointer text-sm
                                            hover:bg-background-muted 
                                            transition-colors duration-200
                                            ${option.value === value ? 
                                                'bg-primary-50 text-primary-600' 
                                                : ''
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                                {filteredOptions.length === 0 && (
                                    <div className="px-4 py-2.5 cursor-pointer text-sm text-muted" role="status">
                                        No results found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </InputWrapper>
        );
    }
}

export default Input;
