import { useState } from "react";
import { createStudent } from "../api";

export default function StudentsPanel({ onChanged, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function addStudent(e) {
    e.preventDefault();
    await createStudent({ name, email: email || null });
    setName("");
    setEmail("");
    onChanged?.();
  }

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        background: "#fbfbfc"
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 10 }}>Neuen Schüler anlegen</div>

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
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="submit">Speichern</button>
          <button type="button" onClick={onCancel}>
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
