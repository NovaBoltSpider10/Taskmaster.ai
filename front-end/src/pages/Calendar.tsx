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

interface MyEvent {
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

type IcalEvent = {
  SUMMARY?: string;
  DTSTART: string;
  DTEND: string;
  DESCRIPTION?: string;
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

const CustomToolbar: React.FC<ToolbarProps<MyEvent, object>> = ({ label }) => (
  <div className="text-center text-xl font-bold py-3 text-emphasis">
    {label}
  </div>
);

const Calendar = () => {
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<MyEvent>({
    title: "",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    description: "",
  });
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileImport = async (file: File) => {
    try {
      let text = await file.text();
      text = text
        .split("BEGIN:VTIMEZONE").join("X-BEGIN:VTIMEZONE")
        .split("END:VTIMEZONE").join("X-END:VTIMEZONE");

      const jcalData = ical.parse(text);
      const parsed = ical2json.convert(jcalData) as {
        VCALENDAR: { VEVENT?: IcalEvent[] }[];
      };

      const vevents = parsed?.VCALENDAR?.[0]?.VEVENT ?? [];

      const newEvents: MyEvent[] = vevents.map((e) => ({
        title: typeof e.SUMMARY === "string" ? e.SUMMARY : "Untitled Event",
        start: new Date(e.DTSTART),
        end: new Date(e.DTEND),
        description: e.DESCRIPTION || "",
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
    <div className="w-full">
      <div className="relative z-10 w-full max-w-screen-xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-emphasis">Your Calendar</h1>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleNavigate("TODAY")} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-4 py-2 rounded-md transition">
              Today
            </button>
            <button onClick={() => handleNavigate("PREV")} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-4 py-2 rounded-md transition">
              Back
            </button>
            <button onClick={() => handleNavigate("NEXT")} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-4 py-2 rounded-md transition">
              Next
            </button>
            <select
              value={view}
              onChange={(e) => setView(e.target.value as View)}
              className="px-4 py-2 rounded-md text-foreground bg-input border border-input font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            <button
              className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-md transition"
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

        <div
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file?.name.endsWith(".ics")) {
              handleFileImport(file);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          className="w-full p-4 text-center border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-sm font-semibold">
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
          className="w-full h-[750px] bg-card rounded-2xl shadow-soft overflow-hidden border border-border"
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
            components={{ toolbar: CustomToolbar }}
            onSelectEvent={(event) => {
              setSelectedEvent(event as MyEvent);
              setNewEvent({
                title: typeof event.title === "string" ? event.title : "",
                start: new Date(event.start),
                end: new Date(event.end),
                description: event.description || "",
              });
              setModalOpen(true);
            }}
          />
        </motion.div>
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
              prev.map((e) => (e === selectedEvent ? updatedEvent : e))
            );
          } else {
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
