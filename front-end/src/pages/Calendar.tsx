import AnimatedBackground from "../components/AnimatedBackground";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  View,
  ToolbarProps,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays, subDays } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, ReactNode } from "react";
import AddEventModal from "../components/AddEventModal";

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

const CustomToolbar: React.FC<ToolbarProps<MyEvent, object>> = ({ label }) => {
  return (
    <div className="text-center text-xl font-semibold py-2 text-gray-700 dark:text-gray-100">
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

    if (action === "TODAY") setCurrentDate(new Date());
    else if (action === "NEXT") setCurrentDate(addDays(baseDate, delta));
    else if (action === "PREV") setCurrentDate(subDays(baseDate, delta));
  };

  return (
    <div className="relative min-h-screen w-full text-gray-900 dark:text-white px-4 py-10">
      <AnimatedBackground />
      <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-3xl font-bold">Task Calendar</h1>
          <div className="flex flex-wrap gap-3">
            <button
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              onClick={() => handleNavigate("TODAY")}
            >
              Today
            </button>
            <button
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              onClick={() => handleNavigate("PREV")}
            >
              Back
            </button>
            <button
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              onClick={() => handleNavigate("NEXT")}
            >
              Next
            </button>

            <div className="relative w-44">
              <select
                value={view}
                onChange={(e) => setView(e.target.value as View)}
                className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md appearance-none cursor-pointer dark:text-white"
              >
                <option className="text-black dark:text-white" value="month">
                  Month View
                </option>
                <option className="text-black dark:text-white" value="week">
                  Week View
                </option>
                <option className="text-black dark:text-white" value="day">
                  Day View
                </option>
              </select>
              <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.086l3.71-3.855a.75.75 0 111.08 1.04l-4.25 4.416a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <button
              className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow font-semibold"
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

        <div className="bg-white dark:bg-darkCard/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 ring-1 ring-gray-100 dark:ring-gray-600 transition">
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
              });
              setModalOpen(true);
            }}
            style={{ height: 750 }}
          />
        </div>
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
