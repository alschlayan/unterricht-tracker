import { useState } from "react";
import { updateLesson, deleteLesson } from "../api";

export default function LessonModal({ open, onClose, lesson, students, onChanged }) {
  const [date, setDate] = useState(lesson?.date || "");
  const [startTime, setStartTime] = useState(lesson?.startTime || "");
  const [minutes, setMinutes] = useState(String(lesson?.durationMinutes || ""));
  const [studentId, setStudentId] = useState(lesson?.student?.id || "");

  if (!open) return null;

  async function save() {
    await updateLesson(lesson.id, {
      date,
      startTime: startTime || null,
      durationMinutes: Number(minutes),
      student: studentId ? { id: studentId } : null
    });
    onChanged();
    onClose();
  }

  async function remove() {
    if (!confirm("Eintrag wirklich löschen?")) return;
    await deleteLesson(lesson.id);
    onChanged();
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50
      }}
      onClick={onClose}
    >
      <div className="card" style={{ width: "min(560px, 100%)" }} onClick={(e) => e.stopPropagation()}>
        <h2>Eintrag bearbeiten</h2>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="Minuten" />

        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", marginBottom: 12 }}
        >
          <option value="">Kein Schüler</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={save}>Speichern</button>
          <button type="button" onClick={onClose}>Schließen</button>
          <button type="button" onClick={remove}>Löschen</button>
        </div>
      </div>
    </div>
  );
}
