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
  formType: "main_contact" | "filflex_access";
  successMessage: string;
  compact?: boolean;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const FORM_ENDPOINT = "/submit-form.php";

export default function InquiryForm({
  fields,
  messageField,
  buttonLabel,
  formType,
  successMessage,
  compact = false,
}: InquiryFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [responseMessage, setResponseMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("form_type", formType);
    formData.set("page_url", window.location.href);

    setSubmitState("submitting");
    setResponseMessage("");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      const payload = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (response.ok && payload?.success) {
        setSubmitState("success");
        setResponseMessage(payload.message || successMessage);
        form.reset();
        return;
      }

      setSubmitState("error");
      setResponseMessage(payload?.message || "Failed to submit request.");
    } catch {
      setSubmitState("error");
      setResponseMessage("Failed to submit request.");
    }
  }

  return (
    <form
      action={FORM_ENDPOINT}
      className={compact ? "inquiry-form inquiry-form--compact" : "inquiry-form"}
      method="post"
      onSubmit={handleSubmit}
    >
      <input name="form_type" type="hidden" value={formType} />
      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          type="text"
        />
      </label>
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
      <button
        className="form-submit"
        disabled={submitState === "submitting"}
        type="submit"
      >
        {submitState === "submitting" ? "Sending..." : buttonLabel}
      </button>
      {submitState === "success" ? (
        <p className="form-success" role="status" aria-live="polite">
          {responseMessage || successMessage}
        </p>
      ) : null}
      {submitState === "error" ? (
        <p className="form-error" role="alert">
          {responseMessage || "Failed to submit request."}
        </p>
      ) : null}
    </form>
  );
}
