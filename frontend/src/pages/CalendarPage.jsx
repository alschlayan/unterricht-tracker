import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import useData from "../hooks/useData";
import LessonModal from "../components/LessonModal";
import { updateLesson } from "../api";

function addMinutesToISO(dateStr, timeStr, minutes) {
  const start = new Date(`${dateStr}T${timeStr || "09:00"}`);
  const end = new Date(start.getTime() + minutes * 60000);
  return { start, end };
}

export default function CalendarPage() {
  const { lessons, students, reload } = useData();
  const [selected, setSelected] = useState(null);

  const events = useMemo(() => {
    return lessons.map((l) => {
      const { start, end } = addMinutesToISO(l.date, l.startTime, l.durationMinutes);
      return {
        id: l.id,
        title: `${l.student?.name ? l.student.name + " – " : ""}${l.durationMinutes} min`,
        start,
        end,
        extendedProps: { lesson: l }
      };
    });
  }, [lessons]);

  // Drag & Drop: wir übernehmen nur Datum+Startzeit aus dem neuen Start
  async function onEventDrop(info) {
    const l = info.event.extendedProps.lesson;
    const start = info.event.start; // Date
    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, "0");
    const dd = String(start.getDate()).padStart(2, "0");
    const hh = String(start.getHours()).padStart(2, "0");
    const mi = String(start.getMinutes()).padStart(2, "0");

    await updateLesson(l.id, {
      date: `${yyyy}-${mm}-${dd}`,
      startTime: `${hh}:${mi}`,
      durationMinutes: l.durationMinutes,
      student: l.student ? { id: l.student.id } : null
    });
    reload();
  }

  return (
    <div className="container">
      <h1>Kalender</h1>

      <div className="card" style={{ marginTop: 12 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek"
          }}
          // ✅ Wochenansicht mit vertikaler Zeitleiste
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          nowIndicator
          selectable
          editable
          eventDrop={onEventDrop}
          eventClick={(info) => setSelected(info.event.extendedProps.lesson)}
          events={events}
          height="auto"
        />
      </div>

      <LessonModal
        open={!!selected}
        lesson={selected}
        students={students}
        onChanged={reload}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
