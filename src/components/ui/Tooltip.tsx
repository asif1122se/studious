import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
    disabled?: boolean;
}

const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
};

const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900'
};

export default function Tooltip({ 
    content, 
    children, 
    position = 'top', 
    delay = 200,
    className = '',
    disabled = false
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
    const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
        if (disabled) return;
        
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            setHideTimeout(null);
        }
        
        const timeout = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        
        setShowTimeout(timeout);
    };

    const hideTooltip = () => {
        if (showTimeout) {
            clearTimeout(showTimeout);
            setShowTimeout(null);
        }
        
        const timeout = setTimeout(() => {
            setIsVisible(false);
        }, 100);
        
        setHideTimeout(timeout);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            hideTooltip();
        }
    };

    useEffect(() => {
        return () => {
            if (showTimeout) clearTimeout(showTimeout);
            if (hideTimeout) clearTimeout(hideTimeout);
        };
    }, [showTimeout, hideTimeout]);

    return (
        <div 
            ref={triggerRef}
            className={`relative inline-block ${className}`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-describedby={isVisible ? 'tooltip-content' : undefined}
        >
            {children}
            
            {isVisible && (
                <div
                    ref={tooltipRef}
                    id="tooltip-content"
                    role="tooltip"
                    className={`
                        absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg
                        max-w-xs break-words
                        ${positionClasses[position]}
                        animate-in fade-in-0 zoom-in-95 duration-200
                    `}
                    aria-hidden="true"
                >
                    {content}
                    {/* Arrow */}
                    <div 
                        className={`
                            absolute w-0 h-0 border-4 border-transparent
                            ${arrowClasses[position]}
                        `}
                    />
                </div>
            )}
        </div>
    );
}

// Hook for managing tooltip state
export const useTooltip = (delay = 200) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
    const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

    const show = () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            setHideTimeout(null);
        }
        
        const timeout = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        
        setShowTimeout(timeout);
    };

    const hide = () => {
        if (showTimeout) {
            clearTimeout(showTimeout);
            setShowTimeout(null);
        }
        
        const timeout = setTimeout(() => {
            setIsVisible(false);
        }, 100);
        
        setHideTimeout(timeout);
    };

    useEffect(() => {
        return () => {
            if (showTimeout) clearTimeout(showTimeout);
            if (hideTimeout) clearTimeout(hideTimeout);
        };
    }, [showTimeout, hideTimeout]);

    return {
        isVisible,
        show,
        hide,
        triggerProps: {
            onMouseEnter: show,
            onMouseLeave: hide,
            onFocus: show,
            onBlur: hide
        }
    };
}; 