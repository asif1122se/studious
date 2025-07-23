"use client";

import { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import Button from './Button';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  'aria-label'?: string;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  orientation?: 'top' | 'bottom';
  align?: 'left' | 'right';
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export default function Dropdown({ 
  trigger, 
  items, 
  className = '', 
  orientation = 'bottom', 
  align = 'left',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && !items[focusedIndex].disabled) {
          items[focusedIndex].onClick();
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
    }
  };

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(0);
    } else {
      setFocusedIndex(-1);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`} 
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <div 
        ref={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTriggerClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={ariaLabel || 'Open dropdown menu'}
        aria-describedby={ariaDescribedby}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`absolute ${orientation === 'top' ? 'bottom-full' : 'top-full'} ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-56 rounded-md shadow-lg bg-background border border-border ring-1 ring-black ring-opacity-5 z-50`}
          role="menu"
          aria-label={ariaLabel || 'Dropdown menu'}
          aria-orientation="vertical"
        >
          <div className="p-1">
            {items.map((item, index) => (
              <Button.Select
                key={index}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`
                  w-full text-left px-4 py-2 text-sm
                  ${item.disabled 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'hover:bg-background-muted hover:text-foreground'
                  }
                  ${focusedIndex === index ? 'bg-background-muted' : ''}
                `}
                role="menuitem"
                aria-label={item['aria-label'] || item.label}
                aria-disabled={item.disabled}
                tabIndex={-1}
                onMouseEnter={() => setFocusedIndex(index)}
                onFocus={() => setFocusedIndex(index)}
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