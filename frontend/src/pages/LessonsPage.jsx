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
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState(false);
  const [transferred, setTransferred] = useState(false);

  async function addLesson(e) {
    e.preventDefault();
    await createLesson({
  date,
  startTime: startTime || null,
  durationMinutes: Number(minutes),
  student: studentId ? { id: studentId } : null,
  amount: amount ? Number(amount) : null,
  paid,
  transferred: paid ? transferred : false
});

    setDate(""); setStartTime(""); setMinutes(""); setStudentId("");
    reload();
  }

const unpaidByStudent = new Map();
for (const l of lessons) {
  const sid = l.student?.id;
  if (!sid) continue;
  if (!l.paid) unpaidByStudent.set(sid, (unpaidByStudent.get(sid) || 0) + 1);
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

          <input
  type="number"
  step="0.01"
  placeholder="Betrag (z.B. 55.00)"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
/>

          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", marginBottom: 12 }}
          >
            <option value="">Kein Schüler (optional)</option>
            {students.map((s) => {
              const unpaid = unpaidByStudent.get(s.id) || 0;
            return (
              <option key={s.id} value={s.id}>
              {s.name}{unpaid > 0 ? ` ⚠️ offen: ${unpaid}` : ""}
            </option>
  );
})}

          </select>

<label className="checkboxRow">
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


<label className="checkboxRow" style={{ opacity: paid ? 1 : 0.5 }}>
  <input
    type="checkbox"
    checked={transferred}
    disabled={!paid}
    onChange={(e) => setTransferred(e.target.checked)}
  />
  Überwiesen
</label>

          <button>Speichern</button>
        </form>
      </div>

      <LessonsList lessons={lessons} students={students} onChanged={reload} />
    </div>
  );
}
