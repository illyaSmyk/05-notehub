const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) {
  throw new Error("VITE_NOTEHUB_TOKEN не задан у змінних оточення");
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

// ===== Типы =====
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// ===== Функции =====

// Получение заметок с пагинацией и поиском
export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = ""
): Promise<FetchNotesResponse> => {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (search) params.append("search", search);

  const res = await fetch(`${BASE_URL}?${params.toString()}`, { headers });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch notes");
  }

  return res.json();
};

// Создание новой заметки
export const createNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(note),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create note");
  }
  return res.json();
};

// Удаление заметки по ID
export const deleteNote = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete note");
  }
};