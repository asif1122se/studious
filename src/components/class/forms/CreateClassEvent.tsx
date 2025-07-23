import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAlert, closeModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ColorPicker from "@/components/ui/ColorPicker";
import { format, addHours } from "date-fns";
import { emitEventCreate } from "@/lib/socket";

interface CreateClassEventProps {
  classId: string;
  onCreate: () => void;
}

export default function CreateClassEvent({ classId, onCreate }: CreateClassEventProps) {
  const [eventData, setEventData] = useState({
    name: "",
    location: "",
    remarks: "",
    startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"), // 1 hour later
    onCreate,
    classId: classId,
    color: "#3B82F6",
  });

  const dispatch = useDispatch();

  const {mutate: createEvent, isPending} = trpc.event.create.useMutation({
    onSuccess: (data) => {
      onCreate();
      emitEventCreate(data.event);
      dispatch(addAlert({ level: AlertLevel.SUCCESS, remark: "Event created successfully" }));
      dispatch(closeModal());
    },
    onError: (error) => {
      dispatch(addAlert({ level: AlertLevel.ERROR, remark: error.message }));
    },
  });

  const handleSubmit = () => {
    createEvent(eventData);
    dispatch(closeModal());
  };

  return (
    <div className="space-y-4 w-[24rem] max-w-full">
      <Input.Text
        label="Name"
        value={eventData.name}
        onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
        required
      />
      <Input.Text
        label="Location"
        value={eventData.location}
        onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
      />
      <Input.Textarea
        label="Remarks"
        value={eventData.remarks}
        onChange={(e) => setEventData({ ...eventData, remarks: e.target.value })}
      />
      <ColorPicker
        value={eventData.color}
        onChange={(color) => setEventData({ ...eventData, color })}
        label="Event Color"
        description="Choose a color to distinguish this event from others."
        size="sm"
        showCustomPicker={true}
      />
      <Input.Text
        label="Start Time"
        type="datetime-local"
        value={eventData.startTime}
        onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
        required
      />
      <Input.Text
        label="End Time"
        type="datetime-local"
        value={eventData.endTime}
        onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button.Light onClick={() => dispatch(closeModal())}>Cancel</Button.Light>
        <Button.Primary isLoading={isPending} onClick={handleSubmit} type="submit">{
            isPending ? "Creating event..." : "Create event"
        }</Button.Primary>
      </div>
    </div>
  );
} 