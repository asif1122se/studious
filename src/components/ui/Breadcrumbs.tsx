import React from 'react';
import Link from 'next/link';
import { HiChevronRight, HiHome } from 'react-icons/hi';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    showHome?: boolean;
    homeHref?: string;
    className?: string;
    separator?: React.ReactNode;
}

export default function Breadcrumbs({ 
    items, 
    showHome = true, 
    homeHref = '/',
    className = '',
    separator = <HiChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
}: BreadcrumbsProps) {
    const allItems = showHome 
        ? [{ label: 'Home', href: homeHref, icon: HiHome }, ...items]
        : items;

    return (
        <nav 
            className={`flex ${className}`} 
            aria-label="Breadcrumb"
        >
            <ol className="flex items-center space-x-2">
                {allItems.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <span className="mx-2" aria-hidden="true">
                                {separator}
                            </span>
                        )}
                        
                        {item.href ? (
                            <Link 
                                href={item.href}
                                className={`
                                    flex items-center space-x-1 text-sm font-medium
                                    text-primary-600 hover:text-primary-500 
                                    dark:text-primary-400 dark:hover:text-primary-300
                                    transition-colors duration-200
                                    ${index === allItems.length - 1 ? 'pointer-events-none' : ''}
                                `}
                                aria-current={index === allItems.length - 1 ? 'page' : undefined}
                            >
                                {item.icon && <item.icon className="h-4 w-4" aria-hidden="true" />}
                                <span>{item.label}</span>
                            </Link>
                        ) : (
                            <span 
                                className={`
                                    flex items-center space-x-1 text-sm font-medium
                                    text-gray-500 dark:text-gray-400
                                    ${index === allItems.length - 1 ? 'text-gray-900 dark:text-gray-100' : ''}
                                `}
                                aria-current={index === allItems.length - 1 ? 'page' : undefined}
                            >
                                {item.icon && <item.icon className="h-4 w-4" aria-hidden="true" />}
                                <span>{item.label}</span>
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

// Hook for managing breadcrumb state
export const useBreadcrumbs = (initialItems: BreadcrumbItem[] = []) => {
    const [items, setItemsState] = React.useState<BreadcrumbItem[]>(initialItems);

    const addItem = (item: BreadcrumbItem) => {
        setItemsState(prev => [...prev, item]);
    };

    const removeItem = (index: number) => {
        setItemsState(prev => prev.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, item: BreadcrumbItem) => {
        setItemsState(prev => prev.map((existing, i) => i === index ? item : existing));
    };

    const clearItems = () => {
        setItemsState([]);
    };

    const setItems = (newItems: BreadcrumbItem[]) => {
        setItemsState(newItems);
    };

    return {
        items,
        addItem,
        removeItem,
        updateItem,
        clearItems,
        setItems
    };
};

// Utility function to generate breadcrumbs from pathname
export const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    
    return segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const label = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return {
            label,
            href: index === segments.length - 1 ? undefined : href
        };
    });
}; 