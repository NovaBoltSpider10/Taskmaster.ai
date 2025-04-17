import React, { useState, useEffect } from "react";

interface EventFormData {
  title: React.ReactNode;
  start: Date;
  end: Date;
  description?: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventFormData) => void;
  onDelete?: () => void;
  isEditing: boolean;
  eventData: EventFormData;
  setEventData: (event: EventFormData) => void;
}

const formatToInput = (date: Date) => {
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return `${hours}:${minutes} ${ampm}`;
};

const formatDateForInput = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const parseTime = (timeStr: string): { hour: number; minute: number } | null => {
  const match = timeStr.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return null;

  const [, hourStr, minuteStr, ampm] = match;
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return { hour, minute };
};

const combineDateAndTime = (dateString: string, time: { hour: number; minute: number }): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, time.hour, time.minute);
};

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  isEditing,
  eventData,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (eventData.start && eventData.end) {
      setTitle(String(eventData.title ?? ""));
      setDate(formatDateForInput(eventData.start));
      setStartTime(formatToInput(eventData.start));
      setEndTime(formatToInput(eventData.end));
      setDescription(eventData.description || "");
    }
  }, [eventData]);

  if (!isOpen) return null;

  const handleSave = () => {
    const parsedStart = parseTime(startTime);
    const parsedEnd = parseTime(endTime);

    if (!parsedStart || !parsedEnd || !date) {
      alert("Please enter a valid date and time in hh:mm AM/PM format.");
      return;
    }

    const start = combineDateAndTime(date, parsedStart);
    const end = combineDateAndTime(date, parsedEnd);

    const newEvent: EventFormData = {
      title: title.trim(),
      start,
      end,
      description: description.trim(),
    };

    onSave(newEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow-lg relative z-50">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Event" : "Add New Event"}
        </h2>

        <input
          type="text"
          placeholder="Event title"
          className="w-full mb-2 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="text-sm">Date</label>
        <input
          type="date"
          className="w-full mb-2 p-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label className="text-sm">Start Time (hh:mm AM/PM)</label>
        <input
          type="text"
          className="w-full mb-2 p-2 border rounded"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="e.g. 07:00 PM"
        />
        <label className="text-sm">End Time (hh:mm AM/PM)</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="e.g. 08:00 PM"
        />
        <textarea
          placeholder="Description (optional)"
          className="w-full mb-4 p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          {isEditing && onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
