import { useMemo, useState } from "react";
import useData from "../hooks/useData";
import StudentsPanel from "../components/StudentsPanel";
import StudentDetails from "../components/StudentDetails";
import StudentDiagramFullscreen from "../components/StudentDiagramFullscreen";

export default function StudentsPage() {
  const { students, lessons, reload } = useData();

  const [selectedId, setSelectedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [diagramOpen, setDiagramOpen] = useState(false);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedId) || null,
    [students, selectedId]
  );

  function openDetails(id) {
    setSelectedId(id);
    setDiagramOpen(false);
  }

  function openDiagram(id) {
    setSelectedId(id);
    setDiagramOpen(true);
  }

  return (
    <div className="container">
      <h1>Schülerverwaltung</h1>

      {/* ✅ Fullscreen Diagramm Overlay */}
      {diagramOpen && (
        <StudentDiagramFullscreen
          student={selectedStudent}
          lessons={lessons}
          onBack={() => setDiagramOpen(false)}
        />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 420px) 1fr",
          gap: 14,
          marginTop: 12
        }}
      >
        {/* LEFT: Schülerliste */}
        <div className="card" style={{ padding: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12
            }}
          >
            <strong style={{ color: "#6b7280" }}>Schülerliste</strong>

            <button
              type="button"
              onClick={() => setShowAdd((v) => !v)}
              title="Schüler hinzufügen"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                padding: 0,
                display: "grid",
                placeItems: "center"
              }}
            >
              +
            </button>
          </div>

          {showAdd && (
            <div style={{ marginBottom: 14 }}>
              <StudentsPanel
                onChanged={async () => {
                  await reload();
                  setShowAdd(false);
                }}
                onCancel={() => setShowAdd(false)}
              />
            </div>
          )}

          {students.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Noch keine Schüler vorhanden.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {students.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: 10,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: selectedId === s.id ? "#f9fafb" : "#fff"
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {s.email || "—"}
                    </div>
                  </div>

                  {/* ✅ Buttons */}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button
                      type="button"
                      title="Schülerdetails"
                      onClick={() => openDetails(s.id)}
                      style={{
                        width: 36,
                        height: 36,
                        padding: 0,
                        borderRadius: 10,
                        display: "grid",
                        placeItems: "center"
                      }}
                    >
                      🔍
                    </button>

                    <button
                      type="button"
                      title="Ausbildungsdiagramm"
                      onClick={() => openDiagram(s.id)}
                      style={{
                        width: 36,
                        height: 36,
                        padding: 0,
                        borderRadius: 10,
                        display: "grid",
                        placeItems: "center"
                      }}
                    >
                      📊
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Details */}
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
