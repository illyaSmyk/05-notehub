import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchNotes, createNote, deleteNote,} from "../../services/noteService";
import type { NoteFormValues } from "../../types/note";
import type { Note } from "../../services/noteService"


const PER_PAGE = 12;

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка заметок
  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNotes(page, PER_PAGE, debouncedSearch);
        setNotes(data.notes);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, [page, debouncedSearch]);

  // Создание заметки
  const handleCreateNote = async (values: NoteFormValues) => {
    try {
      const newNote = await createNote(values);
      setNotes((prev) => [newNote, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  // Удаление какой-то заметки
  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            forcePage={page - 1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && <NoteList notes={notes} onDelete={handleDeleteNote} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;