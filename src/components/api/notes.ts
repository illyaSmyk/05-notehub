const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) {
  throw new Error("VITE_NOTEHUB_TOKEN не задан у змінних оточення");
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  createdAt: string;
  updatedAt: string;
}

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = ""
): Promise<{ notes: Note[]; totalPages: number }> => {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (search) params.append("search", search);

  const res = await fetch(`${BASE_URL}?${params.toString()}`, { headers });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch notes");
  }
  return res.json(); // { notes: [...], totalPages: number }
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}): Promise<Note> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
};

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