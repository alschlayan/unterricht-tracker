import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import StudentsPage from "./pages/StudentsPage";
import LessonsPage from "./pages/LessonsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/kalender" element={<CalendarPage />} />
        <Route path="/schueler" element={<StudentsPage />} />
        <Route path="/eintraege" element={<LessonsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
