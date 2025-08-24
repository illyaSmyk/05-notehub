import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { NoteFormValues, Tag } from "../../types/note";
import { tags } from "../../types/note";
import css from "./NoteForm.module.css";

type NoteFormProps = {
  onSubmit: (values: NoteFormValues) => void;
  onCancel: () => void;
};

//  валидация
const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title can't be longer than 50 characters")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content can't be longer than 500 characters"),
  tag: Yup.mixed<Tag>()
    .oneOf(tags, "Invalid tag")
    .required("Tag is required"),
});

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onCancel }) => {
  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <Field
              name="title"
              type="text"
              placeholder="Title"
              className={css.input}
            />
            <ErrorMessage name="title" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <Field
              name="content"
              as="textarea"
              placeholder="Content"
              className={css.textarea}
            />
            <ErrorMessage name="content" component="div" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <Field name="tag" as="select" className={css.select}>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="div" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={css.submitButton}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;