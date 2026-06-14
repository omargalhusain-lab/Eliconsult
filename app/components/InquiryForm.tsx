"use client";

import { FormEvent, useState } from "react";

type Field = {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  span?: "full";
  type?: string;
};

type InquiryFormProps = {
  fields: Field[];
  messageField?: Field;
  buttonLabel: string;
  successMessage: string;
  compact?: boolean;
};

export default function InquiryForm({
  fields,
  messageField,
  buttonLabel,
  successMessage,
  compact = false,
}: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form
      className={compact ? "inquiry-form inquiry-form--compact" : "inquiry-form"}
      onSubmit={handleSubmit}
    >
      <div className="form-grid">
        {fields.map((field) => (
          <label
            className={field.span === "full" ? "field field--full" : "field"}
            key={field.name}
          >
            <span>{field.label}</span>
            <input
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              type={field.type ?? "text"}
            />
          </label>
        ))}
        {messageField ? (
          <label className="field field--full">
            <span>{messageField.label}</span>
            <textarea
              name={messageField.name}
              placeholder={messageField.placeholder}
              required={messageField.required}
              rows={5}
            />
          </label>
        ) : null}
      </div>
      <button className="form-submit" type="submit">
        {buttonLabel}
      </button>
      {submitted ? <p className="form-success">{successMessage}</p> : null}
    </form>
  );
}
