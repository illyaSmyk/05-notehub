import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {  tags } from "../../types/note";
import type { NoteFormValues, Tag } from "../../types/note";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";

export interface NoteFormProps {
  onSubmit: (values: NoteFormValues) => void;
  onCancel: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required("Title is required"),
  content: Yup.string().max(500),
  tag: Yup.mixed<Tag>().oneOf(tags).required("Tag is required"),
});

const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const initialValues: NoteFormValues = { title: "", content: "", tag: "Todo" };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <Field name="title" type="text" placeholder="Title" className={css.input} />
            <ErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <Field name="content" as="textarea" placeholder="Content" className={css.textarea} />
            <ErrorMessage name="content" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <Field name="tag" as="select" className={css.select}>
              {tags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="div" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="submit" disabled={isSubmitting} className={css.submitButton}>
              Save
            </button>
            <button type="button" onClick={onCancel} className={css.cancelButton}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;