'use client';

import { useState, useEffect, FC } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { fmtDate } from "@/lib/time";

enum Month {
    JAN = 0,
    FEB,
    MAR,
    APR,
    MAY,
    JUN,
    JUL,
    AUG,
    SEP,
    OCT,
    NOV,
    DEC
}

type Day = {
    prev: boolean;
    label: number;
    date: Date;
};

interface CalendarProps {
    onChange: (date: { 
        day: number, 
        month: Month | number, 
        year: number, 
        week?: Date[] 
    }) => void;
}

const Calendar: FC<CalendarProps> = ({ onChange }) => {
    const [active, setActive] = useState<{ day: number, month: Month | number, year: number }>({
        day: new Date().getUTCDate(), 
        month: new Date().getUTCMonth(),
        year: new Date().getUTCFullYear()
    });

    const [date, setDate] = useState<{ month: Month, year: number }>({ month: active.month as Month, year: active.year });

    const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const monthStart = new Date(Date.UTC(date.year, date.month, 1));
    const daysInMonth = new Date(Date.UTC(date.year, date.month + 1, 0)).getDate();

    const prevDaysCount = (monthStart.getDay() + 6) % 7;
    const prevDates: Day[] = Array.from({ length: prevDaysCount }, (_, i) => ({
        prev: true,
        label: new Date(Date.UTC(date.year, date.month, -(prevDaysCount - i))).getDate(),
        date: new Date(Date.UTC(date.year, date.month, -(prevDaysCount - i)))
    }));

    const monthEnd = new Date(Date.UTC(date.year, date.month, daysInMonth));
    const afterDaysCount = (7 - monthEnd.getDay()) % 7;
    const afterDates: Day[] = Array.from({ length: afterDaysCount }, (_, i) => ({
        prev: true,
        label: new Date(Date.UTC(date.year, date.month + 1, i + 1)).getDate(),
        date: new Date(Date.UTC(date.year, date.month + 1, i + 1))
    }));

    const dates: Day[] = [
        ...prevDates.reverse(),
        ...Array.from({ length: daysInMonth }, (_, i) => ({ 
            prev: false, 
            label: i + 1,
            date: new Date(Date.UTC(date.year, date.month, i + 1))
        })),
        ...afterDates
    ];

    const weekstoDays: Record<number, Day[]> = Array.from({ length: 7 }, () => []);

    dates.forEach((day, i) => {
        weekstoDays[i % 7].push(day);
    });

    const handlePreviousMonth = () => {
        const newMonth = (date.month - 1 + 12) % 12;
        const newYear = date.month === 0 ? date.year - 1 : date.year;
        setDate({ month: newMonth, year: newYear });
    };

    const handleNextMonth = () => {
        const newMonth = (date.month + 1) % 12;
        const newYear = date.month === 11 ? date.year + 1 : date.year;
        setDate({ month: newMonth, year: newYear });
    };

    const goToToday = () => {
        const today = new Date();
        const todayDay = today.getUTCDate();
        const todayMonth = today.getUTCMonth();
        const todayYear = today.getUTCFullYear();
        
        setActive({ day: todayDay, month: todayMonth, year: todayYear });
        setDate({ month: todayMonth, year: todayYear });
        
        // Calculate week for today
        const dayOfWeek = (today.getDay() + 6) % 7; // Convert to Monday = 0
        const weekStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - dayOfWeek));
        const weeksAll = Array.from({ length: 7 }, (_, i) => 
            new Date(Date.UTC(weekStart.getUTCFullYear(), weekStart.getUTCMonth(), weekStart.getUTCDate() + i))
        );
        
        onChange({ day: todayDay, month: todayMonth, year: todayYear, week: weeksAll });
    };

    // Get the current week dates for highlighting
    const getCurrentWeekDates = () => {
        const activeDate = new Date(Date.UTC(active.year, active.month, active.day));
        const dayOfWeek = (activeDate.getDay() + 6) % 7; // Convert to Monday = 0
        const weekStart = new Date(Date.UTC(activeDate.getUTCFullYear(), activeDate.getUTCMonth(), activeDate.getUTCDate() - dayOfWeek));
        
        return Array.from({ length: 7 }, (_, i) => 
            new Date(Date.UTC(weekStart.getUTCFullYear(), weekStart.getUTCMonth(), weekStart.getUTCDate() + i))
        );
    };

    const currentWeekDates = getCurrentWeekDates();

    const isInCurrentWeek = (dayDate: Date) => {
        return currentWeekDates.some(weekDate => 
            weekDate.getUTCDate() === dayDate.getUTCDate() && 
            weekDate.getUTCMonth() === dayDate.getUTCMonth() && 
            weekDate.getUTCFullYear() === dayDate.getUTCFullYear()
        );
    };

    const isToday = (dayDate: Date) => {
        const today = new Date();
        return dayDate.getUTCDate() === today.getUTCDate() && 
               dayDate.getUTCMonth() === today.getUTCMonth() && 
               dayDate.getUTCFullYear() === today.getUTCFullYear();
    };

    useEffect(() => {
        WEEKDAY_LABELS.forEach((label, index) => {
            weekstoDays[index].forEach((day, dayIndex) => {
                if (day.label === active.day && !day.prev && date.month === active.month && date.year === active.year) {
                    onChange({ day: day.label, month: date.month, year: date.year, week: Array.from({ length: 7 }, (_, i) => new Date(Date.UTC( date.year, date.month, day.label - (index) + i, 12, 0, 0, 0)) ) });
                }
            });
        });
    }, [active]);

    return (
        <div className="flex flex-col w-full">
            {/* Header */}
            <div className="flex flex-row justify-between items-center p-4 border-b border-border dark:border-border-dark">
                <button 
                    onClick={handlePreviousMonth}
                    className="p-2 hover:bg-background-muted rounded-lg transition-colors"
                >
                    <HiArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="font-semibold text-lg text-foreground">
                        {Month[date.month]} {date.year}
                    </span>
                </div>
                <button 
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-background-muted rounded-lg transition-colors"
                >
                    <HiArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 p-2">
                {WEEKDAY_LABELS.map((label, index) => (
                    <div key={index} className="text-center">
                        <span className="text-xs font-medium text-foreground-muted">{label}</span>
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 p-2">
                {dates.map((day, index) => {
                    const isSelected = day.label === active.day && !day.prev && date.month === active.month && date.year === active.year;
                    const isWeekDay = isInCurrentWeek(day.date);
                    const isTodayDate = isToday(day.date);
                    
                    return (
                        <div 
                            key={index}
                            className={`
                                relative w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg cursor-pointer transition-all duration-200
                                ${day.prev ? 'text-foreground-muted/50' : 'text-foreground'}
                                ${isWeekDay && !day.prev ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                                ${isTodayDate ? 'ring-2 ring-primary-500' : ''}
                                ${isSelected ? 'bg-primary-500 text-white shadow-lg' : ''}
                                ${!day.prev ? 'hover:bg-background-muted' : ''}
                            `}
                            onClick={() => {
                                if (day.prev) {
                                    const newMonth = day.label > 7 ? date.month - 1 : date.month + 1;
                                    const newYear = day.label > 7 ? date.year : date.year;
                                    setActive({ day: day.label, month: newMonth, year: newYear });
                                    setDate({ month: newMonth, year: newYear });
                                } else {
                                    setActive({ day: day.label, month: date.month, year: date.year });
                                }
                                
                                const weekStart = new Date(Date.UTC(day.date.getUTCFullYear(), day.date.getUTCMonth(), day.date.getUTCDate() - ((day.date.getDay() + 6) % 7)));
                                const weeksAll = Array.from({ length: 7 }, (_, i) => 
                                    new Date(Date.UTC(weekStart.getUTCFullYear(), weekStart.getUTCMonth(), weekStart.getUTCDate() + i))
                                );
                                
                                onChange({ day: day.label, month: date.month, year: date.year, week: weeksAll });
                            }}
                        >
                            {day.label}
                            {isTodayDate && !isSelected && (
                                <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Week indicator */}
            <div className="p-3 border-t border-border dark:border-border-dark">
                <div className="text-xs text-foreground-muted text-center">
                    {currentWeekDates.length > 0 ? (
                        <>
                            Week of {fmtDate(currentWeekDates[0])} - {fmtDate(currentWeekDates[6])}
                        </>
                    ) : (
                        'Loading...'
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
