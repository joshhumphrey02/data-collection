"use client";

import { useActionState, useEffect, useRef } from "react";
import { createSubmission } from "@/app/actions";
import { BUSINESS_TYPES, type FormState } from "@/lib/submission";

const INITIAL: FormState = { status: "idle" };

const fieldBase =
  "w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground shadow-xs outline-none transition focus:ring-2 focus:ring-brand/30";

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function SubmissionForm() {
  const [state, formAction, pending] = useActionState(
    createSubmission,
    INITIAL,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the inputs once a submission is stored.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  const err = state.errors ?? {};
  const val = state.values ?? {};

  const inputClass = (name: keyof typeof err) =>
    `${fieldBase} ${err[name] ? "border-danger" : "border-border-subtle"}`;

  const aria = (name: keyof typeof err) =>
    ({
      "aria-invalid": err[name] ? true : undefined,
      "aria-describedby": err[name] ? `${name}-error` : undefined,
    }) as const;

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-5">
      {state.message ? (
        <div
          role="status"
          className={`rounded-lg border px-4 py-3 text-sm ${
            state.status === "success"
              ? "border-success/30 bg-success/10 text-success"
              : "border-danger/30 bg-danger/10 text-danger"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="Full name" error={err.fullName}>
          <input
            id="fullName"
            name="fullName"
            defaultValue={val.fullName}
            autoComplete="name"
            placeholder="Jane Doe"
            className={inputClass("fullName")}
            {...aria("fullName")}
          />
        </Field>

        <Field id="businessName" label="Business name" error={err.businessName}>
          <input
            id="businessName"
            name="businessName"
            defaultValue={val.businessName}
            autoComplete="organization"
            placeholder="Acme Trading Ltd"
            className={inputClass("businessName")}
            {...aria("businessName")}
          />
        </Field>

        <Field id="role" label="Role / Title / Position" error={err.role}>
          <input
            id="role"
            name="role"
            defaultValue={val.role}
            autoComplete="organization-title"
            placeholder="Managing Director"
            className={inputClass("role")}
            {...aria("role")}
          />
        </Field>

        <Field id="phone" label="Phone number" error={err.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={val.phone}
            autoComplete="tel"
            placeholder="+234 801 234 5678"
            className={inputClass("phone")}
            {...aria("phone")}
          />
        </Field>

        <Field id="email" label="Email" error={err.email}>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={val.email}
            autoComplete="email"
            placeholder="jane@acme.com"
            className={inputClass("email")}
            {...aria("email")}
          />
        </Field>

        <Field id="businessType" label="Business type" error={err.businessType}>
          <select
            id="businessType"
            name="businessType"
            defaultValue={val.businessType ?? ""}
            className={inputClass("businessType")}
            {...aria("businessType")}
          >
            <option value="" disabled>
              Select a type
            </option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field id="location" label="Business location" error={err.location}>
          <input
            id="location"
            name="location"
            defaultValue={val.location}
            placeholder="12 Marina Road, Lagos"
            className={inputClass("location")}
            {...aria("location")}
          />
        </Field>

        <Field
          id="tin"
          label="RIN / TIN"
          error={err.tin}
          hint="Tax Identification Number"
        >
          <input
            id="tin"
            name="tin"
            defaultValue={val.tin}
            placeholder="12345678-0001"
            className={`${inputClass("tin")} font-mono`}
            {...aria("tin")}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3 border-t border-border-subtle pt-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-hover focus:ring-2 focus:ring-brand/40 focus:outline-none disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit registration"}
        </button>
        <p className="text-xs text-muted">All fields are required.</p>
      </div>
    </form>
  );
}
