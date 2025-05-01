import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  View,
  ToolbarProps,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  subDays,
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, ReactNode } from "react";
import AddEventModal from "../components/AddEventModal";

// Final event type
interface MyEvent {
  title: string | ReactNode;
  start: Date;
  end: Date;
  description?: string;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

// ✅ Fix: use actual event type for ToolbarProps
const CustomToolbar: React.FC<ToolbarProps<MyEvent, object>> = ({ label }) => {
  return (
    <div className="text-center text-lg font-semibold py-2 text-gray-700">
      {label}
    </div>
  );
};

const Calendar = () => {
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [events, setEvents] = useState<MyEvent[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<MyEvent>({
    title: "",
    start: new Date(),
    end: new Date(),
    description: "",
  });
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);

  const handleNavigate = (action: "TODAY" | "PREV" | "NEXT") => {
    const baseDate = new Date(currentDate);
    const delta = view === "month" ? 30 : 7;

    if (action === "TODAY") {
      setCurrentDate(new Date());
    } else if (action === "NEXT") {
      setCurrentDate(addDays(baseDate, delta));
    } else if (action === "PREV") {
      setCurrentDate(subDays(baseDate, delta));
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
        <h1 className="text-2xl font-bold">Task Calendar</h1>
        <div className="flex flex-wrap gap-2">
          <button
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            onClick={() => handleNavigate("TODAY")}
          >
            Today
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            onClick={() => handleNavigate("PREV")}
          >
            Back
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            onClick={() => handleNavigate("NEXT")}
          >
            Next
          </button>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as View)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            <option value="month">Month View</option>
            <option value="week">Week View</option>
            <option value="day">Day View</option>
          </select>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => {
              const now = new Date();
              setNewEvent({
                title: "",
                start: now,
                end: new Date(now.getTime() + 60 * 60 * 1000),
                description: "",
              });
              setSelectedEvent(null);
              setModalOpen(true);
            }}
          >
            + Add Event
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          view={view}
          onView={(newView: View) => setView(newView)}
          views={["month", "week", "day"]}
          components={{ toolbar: CustomToolbar }}
          onSelectEvent={(event) => {
            setSelectedEvent(event as MyEvent);
            setNewEvent({
              ...event,
              title: String(event.title ?? ""),
            } as MyEvent);
            setModalOpen(true);
          }}
          style={{ height: 600 }}
        />
      </div>

      <AddEventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={(updatedEvent) => {
          if (selectedEvent) {
            setEvents((prev) =>
              prev.map((event) =>
                event === selectedEvent ? updatedEvent : event
              )
            );
          } else if (updatedEvent.title) {
            setEvents((prev) => [...prev, updatedEvent]);
          }
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        onDelete={() => {
          if (selectedEvent) {
            setEvents((prev) => prev.filter((e) => e !== selectedEvent));
            setModalOpen(false);
            setSelectedEvent(null);
          }
        }}
        isEditing={!!selectedEvent}
        eventData={newEvent}
        setEventData={setNewEvent}
      />
    </div>
  );
};

export default Calendar;
