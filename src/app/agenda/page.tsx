"use client";

import CreateEvent from "@/components/class/forms/CreateEvent";
import Button from "@/components/ui/Button";
import Calendar from "@/components/ui/Calendar";
import WeekNavigator from "@/components/ui/WeekNavigator";
import { splitMultiDayEvent } from "@/lib/splitMultiDayEvent";
import { detectOverlaps } from "@/lib/eventOverlap";
import { openModal, setRefetch } from "@/store/appSlice";
import { useEffect, useRef, useState } from "react";
import { HiCalendar, HiExclamation, HiCheckCircle, HiClock as HiTime } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Event from "@/components/class/Event";
import { trpc } from "@/utils/trpc";
import type { RouterOutputs } from "@/utils/trpc";
import Card from "@/components/ui/Card";
import { formatAssignmentType, getAssignmentIcon } from "@/lib/assignment";
import IconFrame from "@/components/ui/IconFrame";
import Badge from "@/components/Badge";
import { 
  startOfDay, 
  isSameDay, 
  format, 
  getDay, 
  getDate,
  differenceInDays,
  parseISO
} from "date-fns";

type PersonalEvent = RouterOutputs['agenda']['get']['events']['personal'][number];
type ClassEvent = RouterOutputs['agenda']['get']['events']['class'][number];

export default function Agenda() {
    const [weekDays, setWeekDays] = useState<Date[]>([]);
    const [selectedDay, setSelectedDay] = useState<number>(0);
    const eventComponent = useRef<HTMLDivElement>(null);
    const [events, setEvents] = useState<{
        personal: PersonalEvent[],
        class: ClassEvent[],
    }>();
    const dispatch = useDispatch();

    const WEEKDAY_LABELS = [
        'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'
    ]
    const spacingPerHour = 80;

    useEffect(() => {
        if (eventComponent && eventComponent.current) eventComponent.current.scrollTop = 80 * 8;
    }, []);

    const { data: agendaData } = trpc.agenda.get.useQuery(
        {
            weekStart: weekDays[0]?.toISOString() || new Date().toISOString(),
        },
        {
            enabled: weekDays.length > 0,
        }
    );

    // Get assignments due today
    const { data: assignmentsData } = trpc.assignment.dueToday.useQuery();

    useEffect(() => {
        if (agendaData) {
            const processedEvents = {
                personal: agendaData.events.personal.flatMap((event: PersonalEvent) => splitMultiDayEvent(event)),
                class: agendaData.events.class.flatMap((event: ClassEvent) => splitMultiDayEvent(event))
            };
            setEvents(processedEvents);
            dispatch(setRefetch(false));
        }
    }, [agendaData, dispatch]);

    // Get today's date
    const today = startOfDay(new Date());
    const todayString = format(today, 'yyyy-MM-dd');

    // Filter assignments due today
    const dueToday = assignmentsData?.filter(assignment => {
        const dueDate = format(startOfDay(new Date(assignment.dueDate)), 'yyyy-MM-dd');
        return dueDate === todayString;
    }) || [];

    const [upcomingEvents, setUpcomingEvents] = useState<ClassEvent[]>([]);

    useEffect(() => {
        if (events) {
            // Combine events and remove duplicates based on ID and startTime
            const allEvents = [...events.personal, ...events.class];
            const uniqueEvents = new Map();
            
            allEvents.forEach(event => {
                const key = event.id;
                if (!uniqueEvents.has(key)) {
                    uniqueEvents.set(key, event);
                }
            });
            
            const filteredEvents = Array.from(uniqueEvents.values()).filter(event => {
                const eventDate = startOfDay(parseISO(event.startTime));
                const today = startOfDay(new Date());
                
                const diffDays = differenceInDays(eventDate, today);

                return diffDays > 0 && diffDays <= 3;
            }).sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()).slice(0, 5);
            
            setUpcomingEvents(filteredEvents);
        }
    }, [events]);

    const handleCalendarChange = (date: { day: number, month: number, year: number, week?: Date[] }) => {
        if (date.week) {
            setWeekDays(date.week);
            const selectedDate = new Date(Date.UTC(date.year, date.month, date.day));
            const dayOfWeek = getDay(selectedDate);
            setSelectedDay(dayOfWeek === 0 ? 6 : dayOfWeek - 1);
        }
    };

    const handleWeekChange = (newWeekDays: Date[]) => {
        setWeekDays(newWeekDays);
    };

    const handleDaySelect = (dayIndex: number) => {
        setSelectedDay(dayIndex);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Week Navigator */}
            {weekDays.length > 0 && (
                <WeekNavigator
                    weekDays={weekDays}
                    onWeekChange={handleWeekChange}
                    selectedDay={selectedDay}
                    onDaySelect={handleDaySelect}
                />
            )}
            
            <div className="flex flex-row ml-12 pt-5 space-x-6 flex-1 overflow-y-auto">
                {/* Left sidebar - Due Today & Upcoming */}
                <div className="flex flex-col w-[20rem] shrink-0 space-y-4">
                    {/* Calendar */}
                    <Card className="p-2">
                        <Calendar onChange={handleCalendarChange} />
                    </Card>
                    {/* Due Today Section */}
                    <Card>
                        <div className="flex items-center space-x-2 mb-4">
                            <HiExclamation className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold text-foreground">Due Today</h3>
                            <Badge variant="error">
                                {dueToday.length}
                            </Badge>
                        </div>
                        
                        {dueToday.length === 0 ? (
                            <div className="text-center py-4">
                                <HiCheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-foreground-muted">No assignments due today!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {dueToday.map((assignment) => (
                                    <div key={assignment.id} className="flex items-start space-x-3 p-3 bg-background-muted rounded-lg hover:bg-background-active transition-colors">
                                        <IconFrame className="p-1 size-6 bg-primary-100 text-primary-600 rounded">
                                            {getAssignmentIcon(assignment.type)}
                                        </IconFrame>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm text-foreground truncate">
                                                {assignment.title}
                                            </h4>
                                            <p className="text-xs text-foreground-muted">
                                                {assignment.class.name}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Badge variant="primary">
                                                    {formatAssignmentType(assignment.type)}
                                                </Badge>
                                                {assignment.graded && (
                                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                                                        {assignment.maxGrade} pts
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Upcoming Events Section */}
                    <Card>
                        <div className="flex items-center space-x-2 mb-4">
                            <HiCalendar className="w-5 h-5 text-primary-500" />
                            <h3 className="font-semibold text-foreground">Upcoming Events</h3>
                        </div>
                        
                        {upcomingEvents.length === 0 ? (
                            <div className="text-center py-4">
                                <HiTime className="w-8 h-8 text-foreground-muted mx-auto mb-2" />
                                <p className="text-sm text-foreground-muted">No upcoming events</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id + event.startTime} className="flex items-start space-x-3 p-3 bg-background-muted rounded-lg hover:bg-background-active transition-colors">
                                        <div 
                                            className="w-3 h-3 rounded-full mt-1"
                                            style={{ backgroundColor: event.color || '#3B82F6' }}
                                        />
                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <h4 className="font-medium text-sm text-foreground truncate">
                                                {event.name || 'Untitled Event'}
                                            </h4>
                                            <p className="text-xs text-foreground-muted">
                                                {format(parseISO(event.startTime), 'EEE, MMM d, h:mm a')}
                                            </p>
                                            {event.location && (
                                                <p className="text-xs text-foreground-muted truncate">
                                                    📍 {event.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Main calendar area */}
                <div className="flex-1 flex flex-col space-y-3 px-12 overflow-x-hidden">
                    <div className="flex flex-row justify-between items-center">
                        <Button.Primary
                            onClick={() => {
                                dispatch(openModal({ body: <CreateEvent selectedDay={weekDays[selectedDay]} onCreate={(event) => {
                                    if (!events) {
                                        return;
                                    }

                                    if (event.class) {
                                        setEvents({
                                            ...events,
                                            class: [...events.class, event]
                                        });
                                    } else {
                                        setEvents({
                                            personal: [
                                                ...(events.personal || []),
                                                event
                                            ],
                                            class: []
                                        });
                                    }
                                }} />, header: 'Add event' }));
                            }}
                        >Add Event</Button.Primary>
                        
                        <div className="text-sm text-foreground-muted">
                            {weekDays[selectedDay] && (
                                <span>
                                    {format(weekDays[selectedDay], 'EEEE, MMMM d, yyyy')}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col w-full overflow-x-auto">
                        <div className="flex flex-row w-full pl-12 min-w-max">
                            {weekDays.map((day, index) => <span key={index}
                                onClick={() => setSelectedDay(index)}
                                className={`hover:underline flex-shrink-0 flex-grow-0 text-sm font-semibold text-center w-[9rem] ${index == selectedDay ? 'text-primary-500' : "text-gray-500 dark:text-gray-300"}`}>{WEEKDAY_LABELS[index]} <span className={`${index == selectedDay ? 'text-white px-2 rounded-full bg-primary-500' : "text-gray-500 dark:text-gray-300"}`}>{getDate(day)}</span></span>
                            )}
                        </div>

                        <div className="flex flex-row overflow-y-scroll h-[50rem] relative min-w-max" ref={eventComponent}>
                            {
                                Array.from({ length: 24 }, (_, i) => (<div key={i} className="absolute w-[2rem] text-foreground-muted font-bold border-border dark:border-border-dark flex-shrink-0 flex-grow-0" style={{
                                    height: spacingPerHour,
                                        top: spacingPerHour * i
                                }}>{i.toString().padStart(2, "0")}:00</div>))
                            }
                            <div className="relative w-full flex flex-row ml-12">
                                {
                                    Array.from({ length: 24 }, (_, i) => (<div key={i} className="absolute w-[63rem] border-b border-border dark:border-border-dark flex-shrink-0 flex-grow-0" style={{
                                        height: spacingPerHour,
                                        top: spacingPerHour * i
                                    }}></div>))
                                }
                                {
                                    weekDays.map((day, index) => (
                                        <div key={index} className="flex flex-col w-[9rem] shrink-0">
                                            <div className="relative items-center">
                                                {
                                                    Array.from({ length: 24 }, (_, i) => (<div key={i} className="w-full border-b border-x border-border dark:border-border-dark flex-shrink-0 flex-grow-0" style={{
                                                        height: spacingPerHour,
                                                    }}></div>))
                                                }
                                                {events &&
                                                    (() => {
                                                        const personalEvents = events.personal.filter((e) => isSameDay(parseISO(e.startTime), day));
                                                        const classEvents = events.class.filter((e) => isSameDay(parseISO(e.startTime), day));
                                                        
                                                        // Combine both event types for overlap detection
                                                        const allDayEvents = [
                                                            ...personalEvents.map(event => ({ ...event, type: 'personal' })),
                                                            ...classEvents.map(event => ({ ...event, type: 'class' }))
                                                        ];
                                                        
                                                        const positionedEvents = detectOverlaps(allDayEvents, spacingPerHour);
                                                        
                                                        return positionedEvents.map((positionedEvent) => {
                                                            const originalEvent = positionedEvent.originalEvent;
                                                            const isPersonal = originalEvent.type === 'personal';
                                                            
                                                            return (
                                                                <Event 
                                                                    key={positionedEvent.id}
                                                                    id={positionedEvent.id}
                                                                    personal={isPersonal}
                                                                    startTime={originalEvent.startTime}
                                                                    endTime={originalEvent.endTime}
                                                                    location={originalEvent.location ? originalEvent.location : 'No location specified'}
                                                                    remarks={originalEvent.remarks ? originalEvent.remarks : 'No remarks were left'}
                                                                    eventName={originalEvent.name ? originalEvent.name : 'Untitled event'}
                                                                    onUpdate={(event) => {
                                                                        if (isPersonal) {
                                                                            setEvents({
                                                                                ...events,
                                                                                personal: [
                                                                                    ...events.personal.filter((e) => e.id !== event.id),
                                                                                    event
                                                                                ],
                                                                            });
                                                                        } else {
                                                                            setEvents({
                                                                                ...events,  
                                                                                class: [
                                                                                    ...events.class.filter((e) => e.id !== event.id),
                                                                                    event
                                                                                ]
                                                                            });
                                                                        }
                                                                    }}
                                                                    onDelete={() => {
                                                                        if (isPersonal) {
                                                                            setEvents({
                                                                                ...events,
                                                                                personal: events.personal.filter((e) => e.id !== positionedEvent.id)
                                                                            });
                                                                        } else {
                                                                            setEvents({
                                                                                ...events,
                                                                                class: events.class.filter((e) => e.id !== positionedEvent.id)
                                                                            });
                                                                        }
                                                                    }}
                                                                    spacingPerHour={spacingPerHour}
                                                                    classId={!isPersonal ? (originalEvent.classId || undefined) : undefined}
                                                                    color={originalEvent.color}
                                                                    width={positionedEvent.width}
                                                                    left={positionedEvent.left}
                                                                    zIndex={positionedEvent.zIndex}
                                                                />
                                                            );
                                                        });
                                                    })()
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}