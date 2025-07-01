"use client";

import { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import Button from './Button';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  orientation?: 'top' | 'bottom';
  align?: 'left' | 'right';
}

export default function Dropdown({ trigger, items, className = '', orientation = 'bottom', align = 'left' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
          <div className={`absolute ${orientation === 'top' ? 'bottom-full' : 'top-full'} ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-56 rounded-md shadow-lg bg-background border border-border ring-1 ring-black ring-opacity-5 z-50`}>
          <div className="p-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <Button.Select
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={`
                  w-full text-left px-4 py-2 text-sm
                  ${item.disabled 
                    ? ' cursor-not-allowed' 
                    : 'hover:bg-background-muted hover:text-foreground'
                  }
                `}
                role="menuitem"
              >
                {item.label}
              </Button.Select>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 