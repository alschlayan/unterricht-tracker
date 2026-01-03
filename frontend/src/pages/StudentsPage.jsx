import { useMemo, useState } from "react";
import StudentsPanel from "../components/StudentsPanel";
import StudentDetails from "../components/StudentDetails";
import useData from "../hooks/useData";

export default function StudentsPage() {
  const { students, lessons, reload } = useData();
  const [selectedId, setSelectedId] = useState("");

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedId) || null,
    [students, selectedId]
  );

  return (
    <div className="container">
      <h1>Schülerverwaltung</h1>

      <div className="grid" style={{ gridTemplateColumns: "minmax(320px, 420px) 1fr" }}>
        <div>
          <div className="card">
            <h2>Schülerliste</h2>

            {students.length === 0 ? (
              <p style={{ color: "#6b7280" }}>Noch keine Schüler angelegt.</p>
            ) : (
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                {students.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedId(s.id)}
                    style={{
                      textAlign: "left",
                      background: selectedId === s.id ? "#2563eb" : "#fff",
                      color: selectedId === s.id ? "#fff" : "#111827",
                      border: "1px solid #e5e7eb",
                      padding: 12,
                      borderRadius: 12,
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{s.name}</div>
                    <div style={{ opacity: 0.8, fontSize: 14 }}>
                      {s.email || "Keine E-Mail"}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <StudentsPanel students={students} onChanged={reload} />
        </div>

        <StudentDetails
          student={selectedStudent}
          lessons={lessons}
          students={students}
          onChanged={reload}
        />
      </div>
    </div>
  );
}
