import { RouterOutputs } from "@/utils/trpc";

type PersonalEvent = RouterOutputs['agenda']['get']['events']['personal'][number];
type ClassEvent = RouterOutputs['agenda']['get']['events']['class'][number];

export function splitMultiDayEvent<T extends PersonalEvent | ClassEvent>(event: T): T[] {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    
    // If event is within same day, return as is
    if (start.getUTCDate() === end.getUTCDate() && 
        start.getUTCMonth() === end.getUTCMonth() && 
        start.getUTCFullYear() === end.getUTCFullYear()) {
        return [event];
    }

    const events: T[] = [];
    
    // Get the start and end dates (without time)
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    // Loop through each day
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dayStart = new Date(date);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        
        // First day: use original start time
        if (date.getTime() === startDate.getTime()) {
            dayStart.setTime(start.getTime());
        } else {
            dayStart.setHours(0, 0, 0, 0);
        }
        
        // Last day: use original end time
        if (date.getTime() === endDate.getTime()) {
            dayEnd.setTime(end.getTime());
        }
        
        const splitEvent = {
            ...event,
            startTime: dayStart.toISOString(),
            endTime: dayEnd.toISOString()
        } as T;

        events.push(splitEvent);
    }

    console.log(events.map(e => ({
        name: e.name,
        startTime: e.startTime,
        endTime: e.endTime
    })));

    return events;
} 