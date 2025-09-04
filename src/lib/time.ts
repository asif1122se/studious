export const getTimeDifferenceInHours = (start: string | Date, end: string | Date) => {
    // @ts-ignore
    const diffMs = new Date(end) - new Date(start); // Difference in milliseconds
    return diffMs / (1000 * 60 * 60); // Convert ms to hours
};

// Get user's timezone from browser or default to UTC
export const getUserTimezone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
};

// Format time in user's local timezone
export const fmtTime = (date: Date | string, timezone?: string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const tz = timezone || getUserTimezone();
    
    return dateObj.toLocaleTimeString('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

// Format date in user's local timezone
export const fmtDate = (date: Date | string, timezone?: string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const tz = timezone || getUserTimezone();
    
    return dateObj.toLocaleDateString('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Format date and time together in user's local timezone
export const fmtDateTime = (date: Date | string, timezone?: string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const tz = timezone || getUserTimezone();
    
    return dateObj.toLocaleString('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

// Convert UTC date to user's timezone for form inputs
export const formatDateForInput = (dateString: string, timezone?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tz = timezone || getUserTimezone();
    
    // Get the date in the user's timezone
    const localDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
    
    return localDate.toISOString().replace("Z", "");
};

// Convert local date to UTC for backend
export const formatDateForBackend = (dateString: string, timezone?: string) => {
    if (!dateString) return "";
    const tz = timezone || getUserTimezone();
    
    // Create date in user's timezone and convert to UTC
    const localDate = new Date(dateString);
    const utcDate = new Date(localDate.toLocaleString('en-US', { timeZone: 'UTC' }));
    
    return utcDate.toISOString();
};