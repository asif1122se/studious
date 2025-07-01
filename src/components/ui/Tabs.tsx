"use client";

import { ReactNode } from "react";

export interface Tab {
    name: string;
    count?: number;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: number;
    onTabChange: (index: number) => void;
    className?: string;
}

export default function Tabs({ tabs, activeTab, onTabChange, className = "" }: TabsProps) {
    return (
        <div className={`flex space-x-4 border-b border-border ${className}`}>
            {tabs.map((tab, index) => (
                <button
                    key={tab.name}
                    onClick={() => onTabChange(index)}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === index
                            ? 'text-primary-500 border-b-2 border-primary-500'
                            : 'text-foreground-muted hover:text-foreground'
                    }`}
                >
                    {tab.name}
                    {tab.count !== undefined && ` (${tab.count})`}
                </button>
            ))}
        </div>
    );
} 