'use client';

import { FC } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import Button from "./Button";

interface WeekNavigatorProps {
    weekDays: Date[];
    onWeekChange: (weekDays: Date[]) => void;
    selectedDay: number;
    onDaySelect: (dayIndex: number) => void;
}

const WeekNavigator: FC<WeekNavigatorProps> = ({ weekDays, onWeekChange, selectedDay, onDaySelect }) => {
    const WEEKDAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    const handlePreviousWeek = () => {
        if (weekDays.length === 0) return;
        
        const newWeekDays = weekDays.map(day => {
            const newDate = new Date(day);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
        onWeekChange(newWeekDays);
    };

    const handleNextWeek = () => {
        if (weekDays.length === 0) return;
        
        const newWeekDays = weekDays.map(day => {
            const newDate = new Date(day);
            newDate.setDate(newDate.getDate() + 7);
            return newDate;
        });
        onWeekChange(newWeekDays);
    };

    const goToToday = () => {
        const today = new Date();
        const dayOfWeek = (today.getDay() + 6) % 7; // Convert to Monday = 0
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - dayOfWeek);
        
        const newWeekDays = Array.from({ length: 7 }, (_, i) => {
            const newDate = new Date(weekStart);
            newDate.setDate(weekStart.getDate() + i);
            return newDate;
        });
        
        onWeekChange(newWeekDays);
        onDaySelect(dayOfWeek);
    };

    if (weekDays.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-row justify-between items-center p-1 border-b border-border dark:border-border-dark">
            <div className="flex items-center space-x-4">
                <button
                    onClick={handlePreviousWeek}
                    className="p-2 hover:bg-background-muted rounded-lg transition-colors"
                >
                    <HiArrowLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">
                        {weekDays[0].toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                        })} - {weekDays[6].toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                
                <button
                    onClick={handleNextWeek}
                    className="p-2 hover:bg-background-muted rounded-lg transition-colors"
                >
                    <HiArrowRight className="w-4 h-4" />
                </button>
            </div>
            
            <div className="flex items-center space-x-4">
                <Button.Light
                    onClick={goToToday}
                >
                    Today
                </Button.Light>
                
                <div className="flex space-x-1">
                    {weekDays.map((day, index) => (
                        <button
                            key={index}
                            onClick={() => onDaySelect(index)}
                            className={`
                                size-10 text-sm font-medium rounded-lg transition-colors
                                ${index === selectedDay 
                                    ? 'bg-primary-500 text-background' 
                                    : 'text-foreground-muted hover:text-foreground hover:bg-background-muted'
                                }
                            `}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-xs">{WEEKDAY_LABELS[index]}</span>
                                <span className="text-sm font-semibold">{day.getDate()}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeekNavigator; 