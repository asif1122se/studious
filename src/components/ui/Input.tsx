import React, { useState, useRef, useEffect } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { MdKeyboardArrowDown } from 'react-icons/md';

// Base props interface for all input components
interface BaseInputProps {
    label?: string;
    value?: string | number;
    placeholder?: string;
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
}

// Add this interface after the other interfaces
interface SearchableSelectProps extends BaseInputProps {
    onChange?: (e: { target: { value: string } }) => void;
    searchList: ReadonlyArray<{ readonly value: string; readonly label: string }>;
}

function InputWrapper(props: InputWrapperProps) {
    if (!props.label) return <>{props.children}</>
    return (
        <div className={`flex flex-col space-y-1 w-full ${props.className}`}>
            <label className="font-semibold text-xs text-foreground">{props.label}</label>
            {props.children}
        </div>
    );
}

const Input = {
    Text: ({ label, value, onChange, placeholder, ...props }: InputElementProps) => {
        if (!placeholder && label) placeholder = `Enter the ${label.toLowerCase()} here...`;
        if (!placeholder) placeholder = 'Type here...';

        const [showPassword, setShowPassword] = useState(false);

        return (
            <InputWrapper label={label}>
                <div className="relative">
                    <input
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        {...props}
                        type={props.type === 'password' ? (showPassword ? "text" : "password") : props.type}
                        className={`px-3 py-2 bg-background shadow-sm border-border border rounded-md text-sm outline-none transition-all duration-200 ease-in-out focus:border-primary-300 focus:ring-1 focus:ring-primary-300 w-full ${props.className} ${props.disabled && 'text-foreground-muted'} ${props.type === 'password' ? 'pr-10' : ''}`}
                    />
                    {props.type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                        >
                            {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </InputWrapper>
        )
    },
    Select: ({ label, value, onChange, children, placeholder = "Select an option", ...props }: SelectProps) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectRef = useRef<HTMLDivElement>(null);

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
            <InputWrapper label={label}>
                <div ref={selectRef} className="relative">
                    <div
                        onClick={() => !props.disabled && setIsOpen(!isOpen)}
                        className={`
                            px-3 py-2 
                            bg-background
                            border-border border rounded-md 
                            text-sm outline-none shadow-sm
                            flex justify-between items-center
                            transition-all duration-200 ease-in-out
                            ${props.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-primary-300'}
                            ${props.className}
                        `}
                    >
                        <span className={!value ? 'text-foreground-muted' : ' flex flex-row space-x-2 items-center'}>
                            {selectedText ? selectedText.props.children : placeholder}
                        </span>
                        <MdKeyboardArrowDown 
                            className={`                                size-5 transition-transform duration-200 
                                ${isOpen ? 'rotate-180' : ''}
                            `} 
                        />
                    </div>

                    {/* Animated Dropdown */}
                    <div
                        className={`
                            absolute z-50 w-full mt-1 p-1
                            bg-background
                            border border-border
                            space-y-1
                            rounded-md shadow-sm max-h-60 overflow-auto
                            transition-all duration-200 origin-top
                            ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
                        `}
                        style={{
                            transform: isOpen ? 'scale(1)' : 'scale(0.95)',
                            opacity: isOpen ? 1 : 0,
                        }}
                    >
                        {isOpen && React.Children.map(children, child => {
                            if (React.isValidElement(child) && child.type === 'option') {
                                return (
                                    <div
                                        onClick={() => {
                                            onChange?.({ target: { value: child.props.value } });
                                            setIsOpen(false);
                                        }}
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
                </div>
            </InputWrapper>
        );
    },
    Textarea: ({ label, value, onChange, placeholder, ...props }: TextareaProps) => {
        if (!placeholder && label) placeholder = `Enter the ${label.toLowerCase()} here...`;
        if (!placeholder) placeholder = 'Type here...';

        return (
            <InputWrapper label={label}>
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                    className={`px-4 py-3 border-border border rounded-md text-sm outline-none shadow-sm transition-all duration-200 ease-in-out focus:border-primary-300 focus:ring-1 focus:ring-primary-300 bg-background ${props.className}`}
                />
            </InputWrapper>
        )
    },
    Small: ({ label, value, onChange, placeholder, ...props }: InputElementProps) => {
        if (!placeholder && label) placeholder = `Enter the ${label.toLowerCase()} here...`;
        if (!placeholder) placeholder = 'Type here...';

        return (
            <InputWrapper label={label}>
                <input
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                    className={`px-2 py-1 bg-background-muted border-border border rounded-md text-sm outline-none shadow-sm transition-all duration-200 ease-in-out focus:border-primary-300 focus:ring-1 focus:ring-primary-300 ${props.className}`}
                />
            </InputWrapper>
        )
    },
    SearchableSelect: ({ label, value, onChange, searchList, placeholder = "Search and select...", ...props }: SearchableSelectProps) => {
        const [isOpen, setIsOpen] = useState(false);
        const [displayValue, setDisplayValue] = useState('');
        const selectRef = useRef<HTMLDivElement>(null);

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
            <InputWrapper label={label}>
                <div ref={selectRef} className="relative">
                    <input
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
                        className="px-3 py-2 border-border border rounded-md text-sm outline-none shadow-sm transition-all duration-200 ease-in-out focus:border-primary-300 focus:ring-1 focus:ring-primary-300 w-full bg-background"
                        {...props}
                    />

                    {isOpen && (
                        <div className="
                            absolute z-50 w-full mt-1
                            bg-background
                            border border-border
                            rounded-md shadow-lg
                        ">
                            <div className="max-h-60 overflow-auto">
                                {filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => {
                                            onChange?.({ target: { value: option.value } });
                                            setDisplayValue(option.label);
                                            setIsOpen(false);
                                        }}
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
                                    <div className="px-4 py-2.5 cursor-pointer text-sm text-muted">
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
