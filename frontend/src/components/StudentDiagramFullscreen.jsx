import StudentDiagram from "./StudentDiagram";

export default function StudentDiagramFullscreen({ student, lessons, onBack }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#f3f4f6",
        zIndex: 9999,
        overflow: "auto",
        padding: 16
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 12
          }}
        >
          ⬅️ Zurück zur Schülerliste
        </button>

        <div style={{ marginTop: 12 }}>
          <StudentDiagram student={student} lessons={lessons} />
        </div>
      </div>
    </div>
  );
}
