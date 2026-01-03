import { useMemo, useState } from "react";
import { deleteLesson, updateLesson } from "../api";

export default function LessonsList({ lessons, students, onChanged }) {
  const [editingId, setEditingId] = useState(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [minutes, setMinutes] = useState("");
  const [studentId, setStudentId] = useState("");

  const sorted = useMemo(() => {
    // Neueste zuerst, max 25
    return [...lessons]
      .sort((a, b) => {
        const da = new Date(`${a.date}T${a.startTime || "00:00"}`);
        const db = new Date(`${b.date}T${b.startTime || "00:00"}`);
        return db - da;
      })
      .slice(0, 25);
  }, [lessons]);

  function startEdit(l) {
    setEditingId(l.id);
    setDate(l.date || "");
    setStartTime(l.startTime || "");
    setMinutes(String(l.durationMinutes ?? ""));
    setStudentId(l.student?.id || "");
  }

  function cancel() {
    setEditingId(null);
    setDate("");
    setStartTime("");
    setMinutes("");
    setStudentId("");
  }

  async function save(id) {
    await updateLesson(id, {
      date,
      startTime: startTime || null,
      durationMinutes: Number(minutes),
      student: studentId ? { id: studentId } : null
    });

    cancel();
    await onChanged();
  }

  async function remove(id) {
    if_toggle: {
      // Confirm kann in manchen Browsern/Setups blocken; trotzdem ist es sinnvoll:
      // Wenn du KEINE Abfrage willst, lösche die nächsten 2 Zeilen.
    }
    if (!confirm("Eintrag wirklich löschen?")) return;

    await deleteLesson(id);
    await onChanged();
  }

  return (
    <div className="card" style={{ marginTop: 32 }}>
      <h2>Letzte Einträge</h2>

      {sorted.length === 0 ? (
        <p style={{ color: "#6b7280" }}>Noch keine Einträge vorhanden.</p>
      ) : (
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {sorted.map((l) => {
            const isEditing = editingId === l.id;

            if (isEditing) {
              return (
                <div
                  key={l.id}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "#fff"
                  }}
                >
                  <div style={{ display: "grid", gap: 10 }}>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />

                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />

                    <input
                      type="number"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      placeholder="Minuten"
                      required
                      min={1}
                    />

                    <select
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #ddd"
                      }}
                    >
                      <option value="">Kein Schüler</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button type="button" onClick={() => save(l.id)}>
                        Speichern
                      </button>
                      <button type="button" onClick={cancel}>
                        Abbrechen
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            const timeLabel = l.startTime ? ` ${l.startTime}` : "";
            const studentLabel = l.student?.name ? `Schüler: ${l.student.name}` : "Kein Schüler";

            return (
              <div
                key={l.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  padding: 14,
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#fff"
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {l.date}
                    {timeLabel} — {l.durationMinutes} min
                  </div>
                  <div style={{ color: "#6b7280", fontSize: 14 }}>{studentLabel}</div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => startEdit(l)}>
                    Bearbeiten
                  </button>
                  <button type="button" onClick={() => remove(l.id)}>
                    Löschen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
