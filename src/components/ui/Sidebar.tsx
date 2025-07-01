import { useDispatch } from "react-redux";
import Button from "./Button";
import Input from "./Input";
import InviteCode from "../class/forms/InviteCode";
import { openModal } from "@/store/appSlice";
import { useEffect, useState, useRef } from "react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";

interface BaseNavigationItem {
    icon: React.ReactNode;
    label: string;
}

interface LinkNavigationItem extends BaseNavigationItem {
    type: 'link';
    href: string;
}

interface SelectNavigationItem extends BaseNavigationItem {
    type: 'select';
    options: { value: string; label: string; }[];
    value: string;
    onChange: (value: string) => void;
}

interface DropdownNavigationItem extends BaseNavigationItem {
    type: 'dropdown';
    items: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    }[];
}

type NavigationItem = LinkNavigationItem | SelectNavigationItem | DropdownNavigationItem;

interface SidebarProps {
    title?: string | React.ReactNode;
    navigationItems: NavigationItem[];
    children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ title, navigationItems, children }) => {
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderNavigationItem = (item: NavigationItem, index: number) => {
        if (item.type === 'select') {
            return (
                <div key={index} className="flex flex-row items-center space-x-3 px-4 py-3">
                    <Input.Select
                        value={item.value}
                        onChange={(e) => item.onChange(e.target.value)}
                        className="bg-background hover:bg-background-subtle text-foreground py-3 px-4 rounded-md transition-all duration-200 ease-in-out"
                        
                    >
                        {item.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Input.Select>
                </div>
            );
        }

        if (item.type === 'dropdown') {
            return (
                <div key={index} ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                        className="w-full flex flex-row items-center space-x-3 px-4 py-3 hover:bg-background-muted rounded-md transition-colors duration-200"
                    >
                        <div className="dark:text-foreground-muted">{item.icon}</div>
                        <span className="text-foreground dark:text-foreground flex-1 text-left">{item.label}</span>
                        <HiChevronDown className={`size-4 transition-transform duration-200 ${openDropdown === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === index && (
                        <div>
                            {item.items.map((dropdownItem, itemIndex) => (
                                <Button.Select
                                    key={itemIndex}
                                    onClick={() => {
                                        dropdownItem.onClick();
                                        setOpenDropdown(null);
                                    }}
                                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-background-muted text-left pl-8"
                                >
                                    <HiChevronRight className="size-3 text-foreground-muted" />
                                    {dropdownItem.icon && (
                                        <div className="dark:text-foreground-muted">{dropdownItem.icon}</div>
                                    )}
                                    <span className="text-foreground dark:text-foreground">{dropdownItem.label}</span>
                                </Button.Select>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Button.Select
                key={index}
                href={item.href}
                className="flex flex-row items-center space-x-3"
            >
                <div className="dark:text-foreground-muted">{item.icon}</div>
                <span className="text-foreground dark:text-foreground">{item.label}</span>
            </Button.Select>
        );
    };

    if (isMobile) {
        return (
            <div className="md:hidden fixed bottom-0 left-0 right-0 mx-5 mb-5 rounded-md bg-background dark:bg-background-subtle border border-border dark:border-border-dark z-50">
                <div className="flex justify-around items-center h-16">
                    {navigationItems.slice(0, 5).map((item, index) => {
                        if (item.type === 'select') {
                            return (
                                <div key={index} className="flex flex-col items-center justify-center space-y-1 px-3 py-2">
                                    <div className="text-foreground dark:text-foreground-muted">
                                        {item.icon}
                                    </div>
                                    <Input.Select
                                        value={item.value}
                                        onChange={(e) => item.onChange(e.target.value)}
                                        className="text-xs"
                                    >
                                        {item.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Input.Select>
                                </div>
                            );
                        }

                        if (item.type === 'dropdown') {
                            return (
                                <div key={index} ref={dropdownRef} className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                                        className="flex flex-col items-center justify-center space-y-1 px-3 py-2"
                                    >
                                        <div className="text-foreground dark:text-foreground-muted">
                                            {item.icon}
                                        </div>
                                        <span className="text-xs text-foreground dark:text-foreground-muted">
                                            {item.label}
                                        </span>
                                    </button>
                                    {openDropdown === index && (
                                        <div className="bg-background border border-border rounded-md shadow-lg z-50 min-w-[200px]">
                                            {item.items.map((dropdownItem, itemIndex) => (
                                                <button
                                                    key={itemIndex}
                                                    onClick={() => {
                                                        dropdownItem.onClick();
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-background-muted text-left pl-8"
                                                >
                                                    <HiChevronRight className="size-3 text-foreground-muted" />
                                                    {dropdownItem.icon && (
                                                        <div className="dark:text-foreground-muted">{dropdownItem.icon}</div>
                                                    )}
                                                    <span className="text-foreground dark:text-foreground">{dropdownItem.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Button.Select
                                key={index}
                                href={item.href}
                                className="flex flex-col items-center justify-center space-y-1 px-3 py-2"
                            >
                                <div className="text-foreground dark:text-foreground-muted">
                                    {item.icon}
                                </div>
                                <span className="text-xs text-foreground dark:text-foreground-muted">
                                    {item.label}
                                </span>
                            </Button.Select>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-[17rem] py-5 px-2 border-r border-border space-y-1 justify-between shrink-0">
            <div className="space-y-1">{title && <span className="font-semibold"
            >{title}</span>}
            {navigationItems.map((item, index) => renderNavigationItem(item, index))}</div>
            <>{children}</>
        </div>
    );
}