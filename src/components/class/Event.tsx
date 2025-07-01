import { useState } from 'react';
import { getTimeDifferenceInHours } from "@/lib/time";
import { addAlert, closeModal, openModal, setRefetch } from "@/store/appSlice";
import { HiClock, HiPencil, HiTrash, HiPaperClip, HiLocationMarker, HiCalendar } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Button from "../ui/Button";
import UpdatePersonalEvent from "./forms/UpdatePersonalEvent";
import { AlertLevel } from "@/lib/alertLevel";
import UpdateClassEvent from "./forms/UpdateClassEvent";
import { emitEventDelete } from '@/lib/socket';
import { RouterOutputs, trpc } from '@/utils/trpc';
import type { TRPCClientErrorLike } from '@trpc/client';
import AttachAssignmentToEvent from './forms/AttachAssignmentToEvent';
import AttachedAssignments from './AttachedAssignments';
import IconFrame from '../ui/IconFrame';
import { format, parseISO } from 'date-fns';

interface EventProps {
    id: string;
    startTime: string | Date;
    endTime: string | Date;
    remarks: string;
    eventName: string;
    location: string;
    spacingPerHour: number;
    personal: boolean;
    classId?: string;
    color?: string;
    width?: number;
    left?: number;
    zIndex?: number;
    onUpdate: (event: RouterOutputs['agenda']['get']['events']['personal'][number] | RouterOutputs['agenda']['get']['events']['class'][number]) => void;
    onDelete: () => void;
}

export default function Event({
    id,
    startTime,
    onUpdate,
    onDelete,
    endTime,
    remarks,
    eventName,
    location,
    spacingPerHour,
    personal,
    classId,
    color,
    width,
    left,
    zIndex
}: EventProps) {
    const dispatch = useDispatch();

    const { data: eventData, refetch: refetchEvent } = trpc.event.get.useQuery({
        id
    }, {
        enabled: !personal && !!classId
    });

    const deleteEvent = trpc.event.delete.useMutation({
        onSuccess: () => {
            emitEventDelete(personal ? '' : id, id);
            dispatch(addAlert({
                level: AlertLevel.SUCCESS,
                remark: 'Event deleted successfully'
            }));
            dispatch(setRefetch(true));
            dispatch(closeModal());
        },
        onError: (error: TRPCClientErrorLike<any>) => {
            dispatch(addAlert({
                level: AlertLevel.ERROR,
                remark: error.message || 'Please try again later',
            }));
        }
    });

    const handleAssignmentAttached = () => {
        console.log('handleAssignmentAttached called');
        refetchEvent();
    };

    const handleAssignmentDetached = () => {
        console.log('handleAssignmentDetached called');
        refetchEvent();
    };

    const backgroundColor=`${color || eventData?.event?.color || '#3B82F6'}20`;
    const borderColor=`${color || eventData?.event?.color || '#3B82F6'}40`;

    // Convert UTC times to local timezone for display
    const startDate = typeof startTime === 'string' ? parseISO(startTime) : startTime;
    const endDate = typeof endTime === 'string' ? parseISO(endTime) : endTime;

    return <div style={{
        top: spacingPerHour * (startDate.getHours() + startDate.getMinutes() / 60),
        height: getTimeDifferenceInHours(startTime, endTime) * spacingPerHour,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        width: width ? `${width}%` : '100%',
        left: left ? `${left}%` : '0%',
        zIndex: zIndex || 1
    }}
        className="absolute flex-grow-0 flex-shrink-0 overflow-hidden flex flex-row items-start space-x-3 p-3 rounded-lg border transition-all duration-200 shadow-sm hover:shadow-md hover:bg-opacity-30"
        onClick={() => {
            dispatch(openModal({
                body: <div className="w-[45rem] max-h-[85vh] overflow-y-auto">
                    {/* Header Section */}
                    <div className="sticky top-0 bg-background z-10 pb-4 border-b border-border">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <IconFrame backgroundColor={backgroundColor} baseColor={borderColor}>
                                    <HiCalendar className="w-5 h-5" />
                                </IconFrame>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">
                                        {eventName || 'Untitled Event'}
                                    </h2>
                                    <p className="text-sm text-foreground-muted">
                                        {format(startDate, 'EEEE, MMMM d, yyyy')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button.SM 
                                    onClick={() => {
                                        dispatch(openModal({
                                            body: personal ? <UpdatePersonalEvent id={id} onUpdate={onUpdate} /> : <UpdateClassEvent id={id} onUpdate={onUpdate} />,
                                            header: 'Update event'
                                        }));
                                    }}
                                >
                                    <HiPencil className="w-4 h-4" />
                                </Button.SM>
                                <Button.SM 
                                    onClick={() => {
                                        onDelete();
                                        deleteEvent.mutate({ id });
                                    }} 
                                    disabled={deleteEvent.isPending}
                                >
                                    <HiTrash className="w-4 h-4" />
                                </Button.SM>
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="py-6 space-y-6">
                        {/* Time and Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-border rounded-lg p-4">
                                <div className="flex items-center space-x-3 mb-2">
                                    <HiClock className="w-5 h-5 text-primary-500" />
                                    <h3 className="font-semibold text-foreground">Time</h3>
                                </div>
                                <p className="text-foreground-secondary">
                                    {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                                </p>
                                <p className="text-sm text-foreground-muted mt-1">
                                    {getTimeDifferenceInHours(startTime, endTime).toFixed(1)} hours
                                </p>
                            </div>

                            <div className="border border-border rounded-lg p-4">
                                <div className="flex items-center space-x-3 mb-2">
                                    <HiLocationMarker className="w-5 h-5 text-primary-500" />
                                    <h3 className="font-semibold text-foreground">Location</h3>
                                </div>
                                <p className="text-foreground-secondary">
                                    {location || 'No location specified'}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {remarks && (
                            <div className="border border-border rounded-lg p-4">
                                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                                <p className="text-foreground-secondary leading-relaxed">
                                    {remarks}
                                </p>
                            </div>
                        )}

                        {/* Assignments Section */}
                        {!personal && classId && (
                            <div className="border-t border-border pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        Assignments
                                    </h3>
                                    <Button.Primary
                                        onClick={() => dispatch(openModal({
                                            body: <AttachAssignmentToEvent 
                                                eventId={id} 
                                                onAssignmentAttached={handleAssignmentAttached}
                                            />,
                                            header: 'Attach Assignment'
                                        }))}
                                        className="flex items-center space-x-2"
                                    >
                                        <HiPaperClip className="w-4 h-4" />
                                        <span>Attach Assignment</span>
                                    </Button.Primary>
                                </div>
                                {eventData && (
                                    <AttachedAssignments
                                        key={eventData.event.assignmentsAttached.length}
                                        eventId={id}
                                        assignments={eventData.event.assignmentsAttached}
                                        classId={classId}
                                        onAssignmentDetached={handleAssignmentDetached}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>, 
                header: "View event" // Remove default header since we have a custom one
            }));
        }}
    >
        <div className="flex flex-col space-y-2 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <HiClock className="w-4 h-4" style={{ color: borderColor }} />
                    <span className="font-semibold text-sm text-foreground">
                        {format(startDate, 'h:mm a')}
                    </span>
                </div>
                {!personal && classId && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: borderColor }}></div>
                )}
            </div>
            <div className="space-y-1">
                <h3 className="font-medium text-sm text-foreground leading-tight">
                    {eventName || 'Untitled Event'}
                </h3>
                {location && (
                    <p className="text-xs text-foreground-muted truncate">
                        📍 {location}
                    </p>
                )}
            </div>
        </div>
    </div>
}