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
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import AddEventModal from "../components/AddEventModal";
import ical from "ical.js";
import ical2json from "ical2json";
import { useWindowSize } from "react-use";

interface IcalEvent {
  SUMMARY?: string;
  DTSTART: string;
  DTEND: string;
  DESCRIPTION?: string;
  LOCATION?: string;
}

const style = document.createElement("style");
style.innerHTML = `
  .dark .rbc-month-view {
    background-color: #2a2a2a !important;
  }
  .dark .rbc-off-range {
    background-color: #333 !important;
    color: #999 !important;
  }
  .dark .rbc-today {
    background-color: rgba(139, 92, 246, 0.15) !important;
  }
  .rbc-event {
    width: 100% !important;
    box-sizing: border-box !important;
    border-radius: 0.5rem !important;
    overflow: hidden !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .rbc-event-content {
    white-space: normal !important;
    padding: 0 !important;
    margin: 0 !important;
    height: 100%;
  }
`;
document.head.appendChild(style);

interface MyEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

const CustomToolbar: React.FC<ToolbarProps<MyEvent, object>> = ({ label }) => (
  <div className="text-center text-xl font-bold py-3 text-purple-700 dark:text-purple-300">
    {label}
  </div>
);

const EventComponent = ({ event, view }: { event: MyEvent; view: View }) => {
  const { width } = useWindowSize();
  const isSplitScreen = width < 900;
  const isWeek = view === "week";
  const shouldHide = isSplitScreen && isWeek;

  if (shouldHide) return null;

  const start = new Date(event.start);
  const end = new Date(event.end);
  const duration = (end.getTime() - start.getTime()) / (1000 * 60);
  if (duration < 30) return null;

  return (
    <div className="w-full h-full px-2 py-1 text-white text-sm truncate flex items-center">
      <span className="font-bold">{event.title}</span>
      {event.location && (
        <span className="ml-2 text-xs opacity-80 truncate">({event.location})</span>
      )}
    </div>
  );
};

const Calendar = () => {
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<MyEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileImport = async (file: File) => {
    try {
      let text = await file.text();
      text = text
        .split("BEGIN:VTIMEZONE").join("X-BEGIN:VTIMEZONE")
        .split("END:VTIMEZONE").join("X-END:VTIMEZONE");

      const jcalData = ical.parse(text);
      const parsed = ical2json.convert(jcalData) as unknown as {
        VCALENDAR: { VEVENT?: IcalEvent[] }[];
      };

      const vevents = parsed?.VCALENDAR?.[0]?.VEVENT ?? [];

      const newEvents: MyEvent[] = vevents.map((e) => ({
        id: crypto.randomUUID(),
        title: typeof e.SUMMARY === "string" ? e.SUMMARY : "Untitled Event",
        start: new Date(e.DTSTART),
        end: new Date(e.DTEND),
        description: e.DESCRIPTION || "",
        location: e.LOCATION || "",
      }));

      setEvents((prev) => [...prev, ...newEvents]);
    } catch (err) {
      console.error("File import failed:", err);
      alert("This doesn't seem to be a valid calendar file.");
    }
  };

  const handleNavigate = (action: "TODAY" | "PREV" | "NEXT") => {
    const base = new Date(currentDate);
    const delta = view === "month" ? 30 : 7;
    if (action === "TODAY") setCurrentDate(new Date());
    if (action === "NEXT") setCurrentDate(addDays(base, delta));
    if (action === "PREV") setCurrentDate(subDays(base, delta));
  };

  return (
    <div className="relative min-h-screen px-4 py-10 text-gray-900 dark:text-white">
      <div className="relative z-10 w-full max-w-screen-xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Your Calendar</h1>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleNavigate("TODAY")} className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-4 py-2 rounded-md">
              Today
            </button>
            <button onClick={() => handleNavigate("PREV")} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-md">
              Back
            </button>
            <button onClick={() => handleNavigate("NEXT")} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-md">
              Next
            </button>
            <select
              value={view}
              onChange={(e) => setView(e.target.value as View)}
              className="px-4 py-2 rounded-md text-white bg-pink-400 hover:bg-pink-500 font-semibold"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            <button
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md"
              onClick={() => {
                const now = new Date();
                const blankEvent: MyEvent = {
                  id: crypto.randomUUID(),
                  title: "",
                  start: now,
                  end: new Date(now.getTime() + 60 * 60 * 1000),
                  description: "",
                  location: "",
                };
                setNewEvent(blankEvent);
                setSelectedEvent(null);
                setModalOpen(true);
              }}
            >
              + Add Event
            </button>
          </div>
        </div>

        <div
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file?.name.endsWith(".ics")) {
              handleFileImport(file);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          className="w-full p-4 text-center border-2 border-dashed border-pink-300 rounded-lg cursor-pointer bg-pink-50 dark:bg-purple-700/30 hover:bg-pink-100 dark:hover:bg-purple-600/30 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-sm font-semibold text-gray-700 dark:text-purple-200">
            Drag & drop your <code>.ics</code> calendar file here or click to browse
          </p>
          <input
            type="file"
            accept=".ics"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileImport(file);
            }}
          />
        </div>

        <motion.div
          key={`${view}-${currentDate.toDateString()}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full h-[750px] bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-zinc-600"
        >
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            view={view}
            onView={(v) => setView(v)}
            views={["month", "week", "day"]}
            components={{
              toolbar: CustomToolbar,
              event: (props) => <EventComponent {...props} view={view} />,
            }}
            onSelectEvent={(event) => {
              setSelectedEvent(event as MyEvent);
              setNewEvent(event as MyEvent);
              setModalOpen(true);
            }}
          />
        </motion.div>
      </div>

      {newEvent && (
        <AddEventModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedEvent(null);
          }}
          onSave={(updatedEvent) => {
            if (selectedEvent) {
              setEvents((prev) =>
                prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
              );
            } else {
              setEvents((prev) => [...prev, updatedEvent]);
            }
            setModalOpen(false);
            setSelectedEvent(null);
          }}
          onDelete={() => {
            if (selectedEvent) {
              setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
              setModalOpen(false);
              setSelectedEvent(null);
            }
          }}
          isEditing={!!selectedEvent}
          eventData={newEvent}
          setEventData={setNewEvent}
        />
      )}
    </div>
  );
};

export default Calendar;