import { useEffect, useState } from "react";
import { getLessons, getStudents } from "../api";

export default function useData() {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);

  async function reload() {
    const [lRes, sRes] = await Promise.all([getLessons(), getStudents()]);
    setLessons(lRes.data);
    setStudents(sRes.data);
  }

  useEffect(() => {
    reload();
  }, []);

  return { lessons, students, reload };
}
