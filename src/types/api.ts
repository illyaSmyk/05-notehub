import type { Note } from "./note";

export interface PaginatedNotes {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}