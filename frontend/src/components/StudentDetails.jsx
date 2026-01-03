import { useMemo, useState } from "react";
import { createLesson, deleteLesson, updateLesson } from "../api";

export default function StudentDetails({ student, lessons, students, onChanged }) {
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newMinutes, setNewMinutes] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editMinutes, setEditMinutes] = useState("");
  const [editStudentId, setEditStudentId] = useState("");

  const studentLessons = useMemo(() => {
    if (!student) return [];
    return lessons
      .filter((l) => l.student?.id === student.id)
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.startTime || "00:00"}`) -
          new Date(`${a.date}T${a.startTime || "00:00"}`)
      );
  }, [lessons, student]);

  const totalMinutes = studentLessons.reduce((s, l) => s + (l.durationMinutes || 0), 0);
  const latest = studentLessons.slice(0, 20);

  function startEdit(l) {
    setEditingId(l.id);
    setEditDate(l.date || "");
    setEditStartTime(l.startTime || "");
    setEditMinutes(String(l.durationMinutes ?? ""));
    setEditStudentId(l.student?.id || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDate("");
    setEditStartTime("");
    setEditMinutes("");
    setEditStudentId("");
  }

  async function saveEdit(id) {
    await updateLesson(id, {
      date: editDate,
      startTime: editStartTime || null,
      durationMinutes: Number(editMinutes),
      student: editStudentId ? { id: editStudentId } : null
    });
    cancelEdit();
    await onChanged();
  }

  async function removeLesson(id) {
    if (!confirm("Eintrag wirklich löschen?")) return;
    await deleteLesson(id);
    await onChanged();
  }

  async function addForStudent(e) {
    e.preventDefault();
    if (!student) return;

    await createLesson({
      date: newDate,
      startTime: newStartTime || null,
      durationMinutes: Number(newMinutes),
      student: { id: student.id }
    });

    setNewDate("");
    setNewStartTime("");
    setNewMinutes("");
    await onChanged();
  }

  if (!student) {
    return (
      <div className="card">
        <h2>Schülerdetails</h2>
        <p style={{ color: "#6b7280" }}>Wähle links einen Schüler aus.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Schülerdetails</h2>

      <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>{student.name}</div>
      {student.email ? (
        <div style={{ color: "#6b7280", marginTop: 4 }}>{student.email}</div>
      ) : (
        <div style={{ color: "#6b7280", marginTop: 4 }}>Keine E-Mail hinterlegt</div>
      )}

      <div className="grid" style={{ marginTop: 18 }}>
        <div className="card" style={{ boxShadow: "none", border: "1px solid #e5e7eb" }}>
          <h2>Einträge</h2>
          <div className="value">{studentLessons.length}</div>
        </div>
        <div className="card" style={{ boxShadow: "none", border: "1px solid #e5e7eb" }}>
          <h2>Stunden gesamt</h2>
          <div className="value">{(totalMinutes / 60).toFixed(1)} h</div>
        </div>
      </div>

      {/* ✅ Neuer Unterricht für diesen Schüler */}
      <div style={{ marginTop: 18 }}>
        <h2>Neuer Unterricht für {student.name}</h2>
        <form onSubmit={addForStudent}>
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
          <input type="time" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} />
          <input
            type="number"
            placeholder="Dauer in Minuten"
            value={newMinutes}
            onChange={(e) => setNewMinutes(e.target.value)}
            required
            min={1}
          />
          <button>Speichern</button>
        </form>
      </div>

      {/* ✅ Einträge bearbeiten/löschen direkt in den Details */}
      <div style={{ marginTop: 18 }}>
        <h2>Einträge (bearbeitbar)</h2>

        {latest.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Noch keine Unterrichtseinträge.</p>
        ) : (
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {latest.map((l) => {
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
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        required
                      />

                      <input
                        type="time"
                        value={editStartTime}
                        onChange={(e) => setEditStartTime(e.target.value)}
                      />

                      <input
                        type="number"
                        value={editMinutes}
                        onChange={(e) => setEditMinutes(e.target.value)}
                        placeholder="Minuten"
                        required
                        min={1}
                      />

                      {/* Du kannst hier optional den Schüler wechseln */}
                      <select
                        value={editStudentId}
                        onChange={(e) => setEditStudentId(e.target.value)}
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
                        <button type="button" onClick={() => saveEdit(l.id)}>
                          Speichern
                        </button>
                        <button type="button" onClick={cancelEdit}>
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={l.id}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {l.date}
                      {l.startTime ? ` ${l.startTime}` : ""} — {l.durationMinutes} min
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => startEdit(l)}>
                      Bearbeiten
                    </button>
                    <button type="button" onClick={() => removeLesson(l.id)}>
                      Löschen
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
