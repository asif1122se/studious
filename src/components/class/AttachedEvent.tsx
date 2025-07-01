import { useDispatch } from "react-redux";
import { addAlert, openModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import Button from "@/components/ui/Button";
import { HiCalendar, HiX, HiExternalLink } from "react-icons/hi";
import { format, parseISO } from "date-fns";

interface AttachedEvent {
  classId?: string; // @todo: this shouldn't be optional
  id: string;
  name: string | null;
  startTime: string;
  endTime: string;
  location: string | null;
  remarks: string | null;
}

interface AttachedEventProps {
  assignmentId: string;
  event: AttachedEvent;
  classId: string;
  onEventDetached: () => void;
  isTeacher: boolean;
}

export default function AttachedEvent({ assignmentId, event, onEventDetached, classId, isTeacher }: AttachedEventProps) {
  const dispatch = useDispatch();

  const detachFromEvent = trpc.assignment.detachEvent.useMutation({
    onSuccess: () => {
      dispatch(addAlert({
        level: AlertLevel.SUCCESS,
        remark: "Event detached from assignment successfully"
      }));
      onEventDetached();
    },
    onError: (error) => {
      dispatch(addAlert({
        level: AlertLevel.ERROR,
        remark: error.message || "Failed to detach event from assignment"
      }));
    }
  });

  const handleDetachFromEvent = () => {
    detachFromEvent.mutate({
      assignmentId,
      classId
    });
  };

  return (
    <div className="p-3 border border-border rounded-lg hover:bg-background-subtle">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    <HiCalendar className="w-4 h-4 text-primary-500" />
                    <h4 className="font-medium text-sm truncate">{event.name || 'Untitled Event'}</h4>
                </div>
              <Button.SM
                onClick={() => {
                  // You could add navigation to the event here if needed
                  dispatch(addAlert({
                    level: AlertLevel.INFO,
                    remark: "Event details: " + (event.name || 'Untitled Event'),
                  }));
                }}
                className="p-1"
              >
                <HiExternalLink className="w-3 h-3" />
              </Button.SM>
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              {format(parseISO(event.startTime), 'MMM d, yyyy')} • {format(parseISO(event.startTime), 'h:mm a')} - {format(parseISO(event.endTime), 'h:mm a')}
            </p>
            {event.location && (
              <p className="text-xs text-foreground-muted mt-1">
                Location: {event.location}
              </p>
            )}
            {event.remarks && (
              <p className="text-xs text-foreground-muted mt-1 truncate">
                {event.remarks}
              </p>
            )}
          </div>
        </div>
        {isTeacher && (
        <Button.SM
          onClick={handleDetachFromEvent}
          disabled={detachFromEvent.isPending}
          className="p-1 text-foreground-muted hover:text-red-500"
          >
            <HiX className="w-4 h-4" />
          </Button.SM>
        )}
      </div>
    </div>
  );
} 