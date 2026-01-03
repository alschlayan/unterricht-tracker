import useData from "../hooks/useData";

export default function HomePage() {
  const { lessons, students } = useData();

  const now = new Date();

  const dayMinutes = lessons
    .filter((l) => new Date(l.date).toDateString() === now.toDateString())
    .reduce((s, l) => s + l.durationMinutes, 0);

  const weekMinutes = lessons
    .filter((l) => {
      const d = new Date(l.date);
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    })
    .reduce((s, l) => s + l.durationMinutes, 0);

  const monthMinutes = lessons
    .filter((l) => new Date(l.date).getMonth() === now.getMonth())
    .reduce((s, l) => s + l.durationMinutes, 0);

  return (
    <div className="container">
      <h1>Start</h1>

      <div className="grid">
        <div className="card">
          <h2>Heute</h2>
          <div className="value">{(dayMinutes / 60).toFixed(1)} h</div>
        </div>

        <div className="card">
          <h2>Diese Woche</h2>
          <div className="value">{(weekMinutes / 60).toFixed(1)} h</div>
        </div>

        <div className="card">
          <h2>Diesen Monat</h2>
          <div className="value">{(monthMinutes / 60).toFixed(1)} h</div>
        </div>

        <div className="card">
          <h2>Schüler hinterlegt</h2>
          <div className="value">{students.length}</div>
        </div>
      </div>
    </div>
  );
}
