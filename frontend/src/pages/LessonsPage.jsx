import { useState } from "react";
import useData from "../hooks/useData";
import { createLesson } from "../api";
import LessonsList from "../components/LessonsList";

export default function LessonsPage() {
  const { lessons, students, reload } = useData();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [minutes, setMinutes] = useState("");
  const [studentId, setStudentId] = useState("");

  async function addLesson(e) {
    e.preventDefault();
    await createLesson({
      date,
      startTime: startTime || null,
      durationMinutes: Number(minutes),
      student: studentId ? { id: studentId } : null
    });
    setDate(""); setStartTime(""); setMinutes(""); setStudentId("");
    reload();
  }

  return (
    <div className="container">
      <h1>Einträge</h1>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Unterricht hinzufügen</h2>
        <form onSubmit={addLesson}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
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
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", marginBottom: 12 }}
          >
            <option value="">Kein Schüler (optional)</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button>Speichern</button>
        </form>
      </div>

      <LessonsList lessons={lessons} students={students} onChanged={reload} />
    </div>
  );
}
