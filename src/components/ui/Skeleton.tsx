import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular';
    animated?: boolean;
}

export default function Skeleton({ 
    className = '', 
    width, 
    height, 
    variant = 'text',
    animated = true
}: SkeletonProps) {
    const baseClasses = 'bg-gray-200 dark:bg-gray-700';
    const animationClasses = animated ? 'animate-pulse' : '';
    
    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-md'
    };

    const defaultDimensions = {
        text: { width: '100%', height: '1rem' },
        circular: { width: '2rem', height: '2rem' },
        rectangular: { width: '100%', height: '8rem' }
    };

    const finalWidth = width || defaultDimensions[variant].width;
    const finalHeight = height || defaultDimensions[variant].height;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
            style={{ 
                width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
                height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight
            }}
            role="status"
            aria-label="Loading content"
        />
    );
}

// Predefined skeleton components for common use cases
export const SkeletonText = ({ lines = 1, className = '' }: { lines?: number; className?: string }) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
            <Skeleton 
                key={index} 
                variant="text" 
                height="1rem"
                width={index === lines - 1 ? '75%' : '100%'}
            />
        ))}
    </div>
);

export const SkeletonAvatar = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
    const sizeMap = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };
    
    return (
        <Skeleton 
            variant="circular" 
            className={`${sizeMap[size]} ${className}`}
        />
    );
};

export const SkeletonButton = ({ className = '' }: { className?: string }) => (
    <Skeleton 
        variant="rectangular" 
        width="6rem" 
        height="2.5rem" 
        className={className}
    />
);

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
    <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
            <SkeletonAvatar size="md" />
            <div className="flex-1">
                <SkeletonText lines={2} />
            </div>
        </div>
        <SkeletonText lines={3} className="mb-4" />
        <div className="flex space-x-2">
            <SkeletonButton />
            <SkeletonButton />
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }: { rows?: number; columns?: number; className?: string }) => (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
                {Array.from({ length: columns }).map((_, index) => (
                    <Skeleton 
                        key={index} 
                        variant="text" 
                        width={`${100 / columns}%`} 
                        height="1rem"
                    />
                ))}
            </div>
        </div>
        
        {/* Rows */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="px-4 py-3">
                    <div className="flex space-x-4">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <Skeleton 
                                key={colIndex} 
                                variant="text" 
                                width={`${100 / columns}%`} 
                                height="1rem"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
); 