import axios from "axios";

export const api = axios.create({ baseURL: "http://localhost:8080/api" });

export const getLessons = () => api.get("/lessons");
export const createLesson = (data) => api.post("/lessons", data);
export const updateLesson = (id, data) => api.put(`/lessons/${id}`, data);
export const deleteLesson = (id) => api.delete(`/lessons/${id}`);

export const getStudents = () => api.get("/students");
export const createStudent = (data) => api.post("/students", data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

export const getMonthTargetUE = () => api.get("/settings/month-target-ue");
export const setMonthTargetUE = (value) =>
  api.put("/settings/month-target-ue", { value });

export const getAdkProgress = (studentId) => api.get(`/adk/${studentId}`);

export const setAdkItem = (studentId, itemKey, completed) =>
  api.put(`/adk/${studentId}/${encodeURIComponent(itemKey)}`, { completed });
