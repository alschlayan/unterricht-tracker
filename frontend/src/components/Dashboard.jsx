import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import StudentsPanel from "./StudentsPanel";
import { getLessons, createLesson, getStudents } from "../api";
import LessonsList from "./LessonsList";

export default function Dashboard() {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);

  const [date, setDate] = useState("");
  const [minutes, setMinutes] = useState("");
  const [studentId, setStudentId] = useState("");

  async function loadAll() {
    const [lRes, sRes] = await Promise.all([getLessons(), getStudents()]);
    setLessons(lRes.data);
    setStudents(sRes.data);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function addLesson(e) {
    e.preventDefault();

    const payload = {
      date,
      durationMinutes: Number(minutes),
      student: studentId ? { id: studentId } : null
    };

    await createLesson(payload);

    setDate("");
    setMinutes("");
    setStudentId("");
    await loadAll();
  }

  const now = new Date();

  const dayMinutes = lessons
    .filter((l) => new Date(l.date).toDateString() === now.toDateString())
    .reduce((s, l) => s + l.durationMinutes, 0);

  const weekMinutes = lessons
    .filter((l) => {
      const d = new Date(l.date);
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    })
    .reduce((s, l) => s + l.durationMinutes, 0);

  const monthMinutes = lessons
    .filter((l) => new Date(l.date).getMonth() === now.getMonth())
    .reduce((s, l) => s + l.durationMinutes, 0);

  const events = useMemo(() => {
    return lessons.map((l) => ({
      title: `${l.durationMinutes} min${l.student?.name ? " – " + l.student.name : ""}`,
      date: l.date
    }));
  }, [lessons]);

  return (
    <div className="container">
      <h1>Unterrichtsübersicht</h1>

      <div className="grid">
        <div className="card">
          <h2>Heute</h2>
          <div className="value">{(dayMinutes / 60).toFixed(1)} h</div>
        </div>

        <div className="card">
          <h2>Diese Woche</h2>
          <div className="value">{(weekMinutes / 60).toFixed(1)} h</div>
        </div>

        <div className="card">
          <h2>Diesen Monat</h2>
          <div className="value">{(monthMinutes / 60).toFixed(1)} h</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 32 }}>
        <h2>Unterricht hinzufügen</h2>

        <form onSubmit={addLesson}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Dauer in Minuten"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            required
          />

          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 12
            }}
          >
            <option value="">Kein Schüler (optional)</option>
            {students.map((s) => (
              <option value={s.id} key={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <button>Speichern</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 32 }}>
        <h2>Kalender</h2>
        <FullCalendar plugins={[dayGridPlugin]} height="auto" events={events} />
      </div>
<LessonsList lessons={lessons} students={students} onChanged={loadAll} />

      <StudentsPanel students={students} onChanged={loadAll} />
    </div>
  );
}

