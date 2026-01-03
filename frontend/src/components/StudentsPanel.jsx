import { useState } from "react";
import { createStudent, deleteStudent } from "../api";

export default function StudentsPanel({ students, onChanged }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function addStudent(e) {
    e.preventDefault();
    await createStudent({ name, email: email || null });
    setName("");
    setEmail("");
    onChanged();
  }

  async function remove(id) {
    await deleteStudent(id);
    onChanged();
  }

  return (
    <div className="card" style={{ marginTop: 32 }}>
      <h2>Schüler</h2>

      <form onSubmit={addStudent}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="E-Mail (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button>Schüler speichern</button>
      </form>

      <div style={{ marginTop: 16 }}>
        {students.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Noch keine Schüler angelegt.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {students.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "#fff"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  {s.email ? (
                    <div style={{ color: "#6b7280", fontSize: 14 }}>{s.email}</div>
                  ) : null}
                </div>
                <button type="button" onClick={() => remove(s.id)}>
                  Löschen
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

