import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import deLocale from "@fullcalendar/core/locales/de";

import useData from "../hooks/useData";
import LessonModal from "../components/LessonModal";
import { updateLesson } from "../api";
import { ueLabel } from "../utils/ue";

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}
function toHHMM(d) {
  return d.toTimeString().slice(0, 5);
}
function lessonToTimes(dateStr, timeStr, minutes) {
  const start = new Date(`${dateStr}T${timeStr || "09:00"}`);
  const end = new Date(start.getTime() + minutes * 60000);
  return { start, end };
}

export default function CalendarPage() {
  const { lessons, students, reload } = useData();
  const [selected, setSelected] = useState(null);

  const events = useMemo(
    () =>
      lessons.map((l) => {
        const { start, end } = lessonToTimes(l.date, l.startTime, l.durationMinutes);
        return {
          id: l.id,
          title: `${l.student?.name ? l.student.name + " – " : ""}${ueLabel(l.durationMinutes)}`,
          start,
          end,
          extendedProps: { lesson: l }
        };
      }),
    [lessons]
  );

  async function onEventDrop(info) {
    const l = info.event.extendedProps.lesson;
    const s = info.event.start;

    await updateLesson(l.id, {
      date: toISODate(s),
      startTime: toHHMM(s),
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
  locale={deLocale}                 // ✅ Deutsch
  firstDay={1}                      // ✅ Montag als Wochenstart

  initialView="dayGridMonth"

  headerToolbar={{
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek"
  }}

  /* 🔹 TITEL (Monat/Jahr oben) */
  titleFormat={{
    year: "numeric",
    month: "short"
  }}

  /* 🔹 Tageskopf (Mo. 01.04) */
  dayHeaderFormat={{
    day: "2-digit",
    month: "2-digit"
  }}


  /* 🔹 Wochenansicht: Zeitachse links */
  slotLabelFormat={{
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }}

  slotMinTime="06:00:00"
  slotMaxTime="22:00:00"
  nowIndicator
  editable
  eventDrop={onEventDrop}
  eventClick={(e) => setSelected(e.event.extendedProps.lesson)}
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
