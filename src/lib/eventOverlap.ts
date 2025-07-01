export interface EventWithPosition {
  id: string;
  startTime: Date;
  endTime: Date;
  top: number;
  height: number;
  width: number;
  left: number;
  zIndex: number;
  overlapGroup: number;
  originalEvent: any; // The original event data
}

export interface OverlapGroup {
  events: EventWithPosition[];
  maxOverlaps: number;
}

export function detectOverlaps(events: any[], spacingPerHour: number): EventWithPosition[] {
  // Convert events to EventWithPosition format
  const eventsWithPosition: EventWithPosition[] = events.map(event => ({
    id: event.id,
    startTime: new Date(event.startTime),
    endTime: new Date(event.endTime),
    top: spacingPerHour * (new Date(event.startTime).getHours() + new Date(event.startTime).getMinutes() / 60),
    height: getTimeDifferenceInHours(event.startTime, event.endTime) * spacingPerHour,
    width: 0, // Will be calculated
    left: 0,  // Will be calculated
    zIndex: 1,
    overlapGroup: 0,
    originalEvent: event
  }));

  // Sort events by start time
  eventsWithPosition.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  // Group overlapping events
  const overlapGroups: OverlapGroup[] = [];
  let currentGroup: EventWithPosition[] = [];
  let groupId = 0;

  for (let i = 0; i < eventsWithPosition.length; i++) {
    const currentEvent = eventsWithPosition[i];
    
    // Check if current event overlaps with any event in the current group
    const overlapsWithGroup = currentGroup.some(groupEvent => 
      eventsOverlap(currentEvent, groupEvent)
    );

    if (overlapsWithGroup || currentGroup.length === 0) {
      // Add to current group
      currentEvent.overlapGroup = groupId;
      currentGroup.push(currentEvent);
    } else {
      // Start a new group
      if (currentGroup.length > 0) {
        overlapGroups.push({
          events: [...currentGroup],
          maxOverlaps: currentGroup.length
        });
      }
      groupId++;
      currentEvent.overlapGroup = groupId;
      currentGroup = [currentEvent];
    }
  }

  // Add the last group
  if (currentGroup.length > 0) {
    overlapGroups.push({
      events: currentGroup,
      maxOverlaps: currentGroup.length
    });
  }

  // Calculate width and left position for each event
  overlapGroups.forEach(group => {
    const { events, maxOverlaps } = group;
    const width = 100 / maxOverlaps;
    
    events.forEach((event, index) => {
      event.width = width;
      event.left = (index * width);
    });
  });

  return eventsWithPosition;
}

function eventsOverlap(event1: EventWithPosition, event2: EventWithPosition): boolean {
  return event1.startTime < event2.endTime && event2.startTime < event1.endTime;
}

function getTimeDifferenceInHours(startTime: string | Date, endTime: string | Date): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
} 