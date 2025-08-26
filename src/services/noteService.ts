import axios from "axios";
import type { Note, NoteFormValues } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) {
  throw new Error("VITE_NOTEHUB_TOKEN не задан у змінних оточення");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = ""
) => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const { data } = await api.get<{ notes: Note[]; totalPages: number }>("/", { params });
  return data;
};

export const createNote = async (note: NoteFormValues) => {
  const { data } = await api.post<Note>("/", note);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await api.delete<Note>(`/${id}`);
  return data;
};