import { useMemo, useState } from "react";
import { deleteLesson, updateLesson } from "../api";
import { minutesToUE } from "../utils/ue";

function money(amount) {
  if (amount == null || amount === "") return "—";
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

function paymentLabel(l) {
  if (!l.paid) return "offen";
  if (l.paid && l.transferred) return "bezahlt · überwiesen";
  return "bezahlt";
}

export default function LessonsList({ lessons, students, onChanged }) {
  const [editingId, setEditingId] = useState(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [minutes, setMinutes] = useState("");
  const [studentId, setStudentId] = useState("");

  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState(false);
  const [transferred, setTransferred] = useState(false);

  const sorted = useMemo(() => {
    return [...lessons]
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.startTime || "00:00"}`) -
          new Date(`${a.date}T${a.startTime || "00:00"}`)
      )
      .slice(0, 25);
  }, [lessons]);

  function startEdit(l) {
    setEditingId(l.id);
    setDate(l.date || "");
    setStartTime(l.startTime || "");
    setMinutes(String(l.durationMinutes ?? ""));
    setStudentId(l.student?.id || "");

    setAmount(l.amount ?? "");
    setPaid(!!l.paid);
    setTransferred(!!l.transferred);
  }

  function cancel() {
    setEditingId(null);
  }

  async function save(id) {
    await updateLesson(id, {
      date,
      startTime: startTime || null,
      durationMinutes: Number(minutes),
      student: studentId ? { id: studentId } : null,

      amount: amount === "" ? null : Number(amount),
      paid: !!paid,
      transferred: paid ? !!transferred : false
    });

    cancel();
    onChanged();
  }

  async function remove(id) {
    if (!confirm("Eintrag wirklich löschen?")) return;
    await deleteLesson(id);
    onChanged();
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
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} required min={1} />

                    <select
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
                    >
                      <option value="">Kein Schüler</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      step="0.01"
                      placeholder="Betrag (EUR)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />

                    <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={paid}
                        onChange={(e) => {
                          setPaid(e.target.checked);
                          if (!e.target.checked) setTransferred(false);
                        }}
                      />
                      Bezahlt
                    </label>

                    <label style={{ display: "flex", gap: 10, alignItems: "center", opacity: paid ? 1 : 0.5 }}>
                      <input
                        type="checkbox"
                        checked={transferred}
                        disabled={!paid}
                        onChange={(e) => setTransferred(e.target.checked)}
                      />
                      Überwiesen
                    </label>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button type="button" onClick={() => save(l.id)}>Speichern</button>
                      <button type="button" onClick={cancel}>Abbrechen</button>
                    </div>
                  </div>
                </div>
              );
            }

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
                  <div style={{ fontWeight: 900 }}>
                    {l.date}{l.startTime ? ` ${l.startTime}` : ""} — {minutesToUE(l.durationMinutes)} UE
                  </div>
                  <div style={{ color: "#6b7280", fontSize: 14 }}>
                    {l.student?.name || "Kein Schüler"} · {money(l.amount)} · {paymentLabel(l)}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => startEdit(l)}>Bearbeiten</button>
                  <button type="button" onClick={() => remove(l.id)}>Löschen</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
