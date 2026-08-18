import { SubmissionForm } from "@/components/submission-form";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="max-w-3xl">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-wide text-brand uppercase">
            Registration
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
            Business details
          </h1>
          <p className="mt-2 text-sm text-muted">
            Provide the information below to add a business to the registry.
            Your details are stored securely.
          </p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-6 shadow-sm sm:p-8">
          <SubmissionForm />
        </div>
      </div>
    </div>
  );
}
