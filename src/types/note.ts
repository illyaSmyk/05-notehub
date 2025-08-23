// src/types/note.ts
export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
  updatedAt: string;
}

export interface NoteFormValues {
  title: string;
  content: string;
  tag: Tag;
}

export const tags: Tag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];
