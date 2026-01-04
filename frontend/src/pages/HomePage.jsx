import { useEffect, useMemo, useState } from "react";
import useData from "../hooks/useData";
import { UE_MINUTES, minutesToUE } from "../utils/ue";
import { getMonthTargetUE, setMonthTargetUE } from "../api";

function PencilIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function sameDay(a, b) {
  return a.toDateString() === b.toDateString();
}

function safeNumber(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default function HomePage() {
  const { lessons, students } = useData();

  // ✅ kommt jetzt aus der DB
  const [targetUE, setTargetUEState] = useState(80);
  const [loadingTarget, setLoadingTarget] = useState(true);

  const [editingTarget, setEditingTarget] = useState(false);
  const [draftTarget, setDraftTarget] = useState("80");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMonthTargetUE();
        const val = safeNumber(res.data?.value, 80);
        setTargetUEState(val);
        setDraftTarget(String(val));
      } finally {
        setLoadingTarget(false);
      }
    })();
  }, []);

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const { todayMin, yesterdayMin, weekMin, monthMin } = useMemo(() => {
    let t = 0, y = 0, w = 0, m = 0;

    for (const l of lessons) {
      const d = new Date(l.date);
      const mins = l.durationMinutes || 0;

      if (sameDay(d, now)) t += mins;
      if (sameDay(d, yesterday)) y += mins;

      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      if (diffDays >= 0 && diffDays <= 7) w += mins;

      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) m += mins;
    }

    return { todayMin: t, yesterdayMin: y, weekMin: w, monthMin: m };
  }, [lessons]);

  const monthUE = Number(minutesToUE(monthMin));
  const target = Math.max(0, Number(targetUE) || 0);
  const pct = target > 0 ? Math.min(100, Math.round((monthUE / target) * 100)) : 0;
  const remainingUE = Math.max(0, target - monthUE);

  function openEdit() {
    setDraftTarget(String(targetUE));
    setEditingTarget(true);
  }

  function cancelEdit() {
    setDraftTarget(String(targetUE));
    setEditingTarget(false);
  }

  async function saveEdit() {
    const next = Math.max(0, safeNumber(draftTarget, targetUE));
    // ✅ in DB speichern
    const res = await setMonthTargetUE(next);
    const saved = safeNumber(res.data?.value, next);

    setTargetUEState(saved);
    setEditingTarget(false);
  }

  return (
    <div className="container">
      <h1>Start</h1>

      <div className="card heroCard">
        <div className="heroMain">
          <div className="heroLabel">Monatsarbeitszeit</div>
          <div className="heroUE">
            {monthUE.toFixed(1)} <span>UE</span>
          </div>
        </div>

        <div className="heroControls">
          <div className="heroRow">
            <div style={{ fontWeight: 800 }}>
              Fortschritt: {pct}%{" "}
              <span style={{ color: "#6b7280", fontWeight: 600 }}>
                (Soll: {loadingTarget ? "…" : target.toFixed(0)} UE)
              </span>
            </div>

            {!editingTarget ? (
              <button
                type="button"
                onClick={openEdit}
                title="Monatssoll bearbeiten"
                aria-label="Monatssoll bearbeiten"
                disabled={loadingTarget}
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  padding: 0,
                  opacity: loadingTarget ? 0.6 : 1
                }}
              >
                <PencilIcon />
              </button>
            ) : (
              <div className="targetInline" style={{ gap: 8 }}>
                <span style={{ color: "#6b7280", fontWeight: 700 }}>Soll</span>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={draftTarget}
                  onChange={(e) => setDraftTarget(e.target.value)}
                  style={{ width: 120, marginBottom: 0 }}
                  autoFocus
                />
                <span style={{ color: "#6b7280", fontWeight: 700 }}>UE</span>
                <button type="button" onClick={saveEdit}>
                  Speichern
                </button>
                <button type="button" onClick={cancelEdit}>
                  Abbrechen
                </button>
              </div>
            )}
          </div>

          <div className="progressBarGray" aria-label="Monatssoll Fortschritt">
            <div className="progressFillGreen" style={{ width: `${pct}%` }} />
          </div>

          <div className="heroFooter">
            <div>
              Ist: <strong>{monthUE.toFixed(1)} UE</strong>
            </div>
            <div>
              Rest: <strong>{remainingUE.toFixed(1)} UE</strong>
            </div>
            <div style={{ color: "#6b7280" }}>1 UE = {UE_MINUTES} min</div>
          </div>
        </div>
      </div>

      <div className="statsRow">
        <div className="card statCard">
          <div className="statTitle">Vortag</div>
          <div className="statValue">{minutesToUE(yesterdayMin)} UE</div>
        </div>

        <div className="card statCard">
          <div className="statTitle">Heute</div>
          <div className="statValue">{minutesToUE(todayMin)} UE</div>
        </div>

        <div className="card statCard">
          <div className="statTitle">Diese Woche</div>
          <div className="statValue">{minutesToUE(weekMin)} UE</div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="card statCard">
          <div className="statTitle">Schüler</div>
          <div className="statValue">{students.length}</div>
        </div>
      </div>
    </div>
  );
}
