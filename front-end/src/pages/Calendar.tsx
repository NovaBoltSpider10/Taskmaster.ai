import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  View,
  ToolbarProps,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays, subDays } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTasks } from "../components/tasksStore";
import AddEventModal from "../components/AddEventModal";

interface MyEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  allDay?: boolean;
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

const EventComponent = ({ event }: { event: MyEvent }) => {
  return (
    <div className="w-full h-full px-2 py-1 text-white text-sm truncate flex items-center gap-1">
      <span className="font-bold">{event.title}</span>
      {event.location && (
        <span className="text-xs opacity-80 truncate">({event.location})</span>
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

  useEffect(() => {
    const tasks = getTasks();
    const taskEvents = tasks.map((task) => {
      const deadline = new Date(task.deadline);
      const start = new Date(deadline.getTime() - 1 * 60 * 60 * 1000); // 1 hour before
      return {
        id: task._id,
        title: task.title,
        start,
        end: deadline,
        description: task.topic || "",
        location: task.classLocation || "",
        allDay: false,
      };
    });
    setEvents(taskEvents);
  }, []);

  const handleNavigate = (action: "TODAY" | "PREV" | "NEXT") => {
    const base = new Date(currentDate);
    const delta = view === "month" ? 30 : view === "week" ? 7 : 1;
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
                const blankEvent: MyEvent = {
                  id: crypto.randomUUID(),
                  title: "",
                  start: now,
                  end: now,
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

        {/* <div
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
        </div> */}

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
            components={{
              toolbar: CustomToolbar,
              event: (props) => <EventComponent {...props} />,
            }}
            onSelectEvent={(event) => {
              setSelectedEvent(event as MyEvent);
              setNewEvent(event as MyEvent);
              setModalOpen(true);
            }}
            step={60}
            timeslots={1}
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
