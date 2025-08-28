import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchNotes, createNote } from "../../services/noteService";
import type { FetchNotesResponse,} from "../../types/api";

import type { NoteFormValues } from "../../types/note";

const PER_PAGE = 12;

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Запрос заметок
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, PER_PAGE, debouncedSearch),
    staleTime: 1000 * 60, // 1 минута кеша
    placeholderData: keepPreviousData,
  });

  // Мутация для создания заметки
  const createNoteMutation = useMutation({
    mutationFn: (values: NoteFormValues) => createNote(values),
    onSuccess: () => {
      // После успешного создания — обновляем список заметок
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const handlePageChange = (selected: number) => {
    setPage(selected + 1);
  };

 

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {(data?.totalPages ?? 0) > 1 && (
          <Pagination
  pageCount={data?.totalPages ?? 1}
  forcePage={page - 1}
  onPageChange={({ selected }) => handlePageChange(selected)}
  pageRangeDisplayed={2}
  marginPagesDisplayed={1}
/>
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <LoadingIndicator />}
      {isError && <ErrorMessage message={error?.message || "Unknown error"} />}

      {!isLoading && !isError && data && (
        <NoteList notes={data.notes} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={(values) => createNoteMutation.mutate(values)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;