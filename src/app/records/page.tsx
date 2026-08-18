import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Always read the latest rows rather than serving a cached page.
export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function RecordsPage() {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-brand uppercase">
            Records
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Submissions
          </h1>
          <p className="mt-2 text-sm text-muted">
            {submissions.length}{" "}
            {submissions.length === 1 ? "entry" : "entries"} collected.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-hover"
        >
          New registration
        </Link>
      </div>

      {submissions.length > 0 ? (
        <p className="mb-3 text-xs text-muted lg:hidden">
          Scroll sideways to see all columns.
        </p>
      ) : null}

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-surface p-12 text-center">
          <p className="text-sm font-medium">No submissions yet</p>
          <p className="mt-1 text-sm text-muted">
            Entries will appear here once the form is submitted.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-sm">
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-foreground/[0.03]">
                  {[
                    "Full name",
                    "Business",
                    "Role",
                    "Phone",
                    "Email",
                    "Type",
                    "Location",
                    "RIN/TIN",
                    "Submitted",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-4 py-3 font-medium whitespace-nowrap text-muted"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border-subtle last:border-0 hover:bg-foreground/[0.02]"
                  >
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {row.fullName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.businessName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {row.role}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {row.phone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {row.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {row.businessType}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {row.location}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-muted">
                      {row.tin}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {dateFormatter.format(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
